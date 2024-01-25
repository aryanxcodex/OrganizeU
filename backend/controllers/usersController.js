import asyncHandler from "express-async-handler";
import User from "../models/users.js";
import { confirmationMail, invitationMail } from "../utils/confirmationMail.js";
import { generateToken, generateInviteToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import Boards from "../models/boards.js";

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

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
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
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User Logged Out" });
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
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updateUser = await user.save();

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
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

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  confirmUser,
  sendInvitation,
};
