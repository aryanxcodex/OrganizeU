import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  console.log(userId);

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  console.log(token);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const generateInviteToken = (userId, boardId, emailId) => {
  const token = jwt.sign({ userId, boardId, emailId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return token;
};

export { generateToken, generateInviteToken };
