import asyncHandler from "express-async-handler";
import Boards from "../models/boards.js";
import User from "../models/users.js";
import { conn } from "../config/db.js";

//@desc Fetch Boards
//route GET /api/b/boards
//@access PRIVATE

const fetchBoards = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({ user });
  } else {
    res.status(404);
    throw new Error("User not Found");
  }
});

//@desc Create a Board
//route POST /api/b/boards
//@access PRIVATE

const createBoard = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const session = await conn.startSession();

  try {
    session.startTransaction();

    const creator = await User.findById(req.user._id);

    const board = await Boards.create(
      [
        {
          title,
          description,
          creator,
        },
      ],
      { session }
    );

    await User.updateOne(
      { _id: req.user._id },
      { $push: { boards: board } },
      { session }
    );

    await session.commitTransaction();

    res.status(200).json({ message: "Board Created.." });
  } catch (error) {
    await session.abortTransaction();
    throw new Error(error.message);
  }

  session.endSession();
});

//@desc Delete a Board
//route DELETE /api/b/:boardId
//@access PRIVATE

const deleteBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const session = await conn.startSession();

  try {
    session.startTransaction();

    await User.updateOne(
      { _id: req.user._id },
      { $pull: { boards: boardId } },
      { session }
    );

    await Boards.findByIdAndDelete(boardId, { session });

    await session.commitTransaction();

    res.status(200).json({ message: "Board Deleted.." });
  } catch (error) {
    await session.abortTransaction();
    throw new Error(error.message);
  }

  session.endSession();
});

export { fetchBoards, createBoard, deleteBoard };
