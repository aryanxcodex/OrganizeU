import asyncHandler from "express-async-handler";
import User from "../models/users.js";
import { confirmationMail, invitationMail } from "../utils/confirmationMail.js";
import { generateToken, generateInviteToken } from "../utils/generateToken.js";
import jwt, { decode } from "jsonwebtoken";
import Boards from "../models/boards.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

//@desc AuthUser/ set Token
//route POST /api/users/auth
//@access PUBLIC

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPasswords(password))) {
    if (!user.isVerified) {
      res.status(400);
      throw new Error("Please Verify your email first");
    }
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

//@desc Register a new User
//route POST /api/users/register
//@access PUBLIC

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // const isVerified = true;

  const userExists = await User.findOne({
    $or: [{ name }, { email }],
  });

  if (userExists) {
    throw new Error("User already exists");
  }

  let avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new Error("Failed to upload avatar");
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: avatar.url,
  });

  if (user) {
    confirmationMail(email, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message:
        "Please check your inbox to confirm your email and continue to our website",
    });
  } else {
    throw new Error("Invalid Username or Password");
  }
});

//@desc Logout a User
//route POST /api/users/logout
//@access PUBLIC

const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  };
  return res
    .status(200)
    .clearCookie("jwt", {
      domain: "localhost", // Change to your domain
      path: "/", // Change to your path
      secure: false, // Set to true if using HTTPS
      httpOnly: true, // Set to true if you want to restrict access to JavaScript
    })
    .json({ message: "User logged out" });
});

//@desc Get User Profile
//route POST /api/users/profile
//@access Private

const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };

  res.status(200).json(user);
});

//@desc Update User Profile
//route POST /api/users/profile
//@access Private

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const userExists = await User.findOne({ name: req.body.name });
    console.log(userExists);

    if (userExists) {
      throw new Error(
        "User with this username already exists, Please choose different username"
      );
    }

    let avatarLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.avatar) &&
      req.files.avatar.length > 0
    ) {
      avatarLocalPath = req.files.avatar[0].path;
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
      throw new Error("Failed to upload avatar");
    }

    user.name = req.body.name || user.name;
    user.avatar = avatar.url || user.avatar;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updateUser = await user.save();

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      avatar: updateUser.avatar,
    });
  } else {
    res.status(404);
    throw new Error("User not Found");
  }
});

//@desc Confirm User
//route GET /api/users/confirm/:id
//@access Public

const confirmUser = asyncHandler(async (req, res) => {
  const token = req.params.id;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findByIdAndUpdate(decoded.userId, {
        isVerified: true,
      });

      res
        .status(200)
        .cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .json({
          message: "You are successfully verified !",
          _id: user._id,
          name: user.name,
          email: user.email,
        });
    } catch (error) {
      res.status(401);
      throw new Error(error.message);
    }
  } else {
    res.status(401);
    throw new Error("User not authorised");
  }
});

const sendInvitation = asyncHandler(async (req, res) => {
  const { boardId, emailId } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);

  const validate = user.boards.filter((board) => board === boardId);

  if (!validate) {
    res.status(400);
    throw new Error(
      "You can not invite members to this board, you are not a member or owner!"
    );
  }

  const board = await Boards.findById(boardId);

  const inviteToken = generateInviteToken(userId, boardId, emailId);

  const data = {
    invitee_name: req.user.name,
    board_name: board.title,
    invitation_link: `http://localhost:5173/invite?token=${inviteToken}`,
  };

  invitationMail(emailId, data);

  res.status(200).json({ message: "Invitation sent successfully" });
});

const checkUserInvitation = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { userId, emailId, boardId } = decoded;

      const userExists = await User.findOne({ email: emailId });

      if (userExists) {
        res.status(200).json({
          userExists: true,
          emailId,
          boardId,
          userId,
        });
      } else {
        res.status(200).json({
          userExists: false,
          emailId,
          boardId,
          userId,
        });
      }
    } catch (error) {
      res.status(401);
      throw new Error(error.message);
    }
  } else {
    res.status(401);
    throw new Error("User not authorised");
  }
});

const onboardInvitedUser = asyncHandler(async (req, res) => {
  const { userId, boardId, password, emailId, userExists, username } = req.body;
  let userDetails;

  if (userExists) {
    const user = await User.findOne({ email: emailId });

    if (user && (await user.matchPasswords(password))) {
      if (!user.isVerified) {
        res.status(400);
        throw new Error("Please Verify your email first");
      }
      generateToken(res, user._id);
      userDetails = user;
    } else {
      res.status(400);
      throw new Error("Invalid Credentials");
    }
  } else {
    const user = await User.create({
      name: username,
      email: emailId,
      password: password,
      isVerified: true,
    });
    generateToken(res, user._id);
    if (user) {
      userDetails = user;
    } else {
      res.status(400);
      throw new Error("Invalid Username or Password");
    }
  }

  const inviteeUser = await User.findById(userId);

  // Validate whether params.id is in the user's boards or not
  const validate = inviteeUser.boards.filter((board) => board === boardId);

  if (!validate) {
    res.status(400);
    throw new Error(
      "You can not add member to this board, you are not a member or owner!"
    );
  }

  const board = await Boards.findById(boardId);

  const newMember = await User.findOne({ email: emailId });
  newMember.boards.push(board._id);
  await newMember.save();
  board.members.push({
    user: newMember._id,
    role: "member",
  });
  await board.save();
  res.status(200).json({
    _id: userDetails._id,
    name: userDetails.name,
    email: userDetails.email,
  });
});

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  confirmUser,
  sendInvitation,
  checkUserInvitation,
  onboardInvitedUser,
};
