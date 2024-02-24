import asyncHandler from "express-async-handler";
import Boards from "../models/boards.js";
import User from "../models/users.js";

//@desc Get all the boards of the user
//route GET /api/b
//@access PRIVATE

const getAllBoards = asyncHandler(async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user._id);

    // Get board's ids of user
    const boardIds = user.boards;

    // Get boards of user
    const boards = await Boards.find({ _id: { $in: boardIds } }).populate({
      path: "members.user",
      model: "users",
      select: "name avatar",
    });

    // Delete unneccesary objects
    boards.forEach((board) => {
      board.cards = undefined;
    });

    res.status(200).json({ boards });
  } catch (error) {
    throw new Error(error.message);
  }
});

//@desc Fetch Cards and Tasks
//route GET /api/b/boards/:boardId
//@access PRIVATE

const fetchCardsnTasks = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const board = await Boards.findById(boardId).populate({
    path: "cards",
    populate: {
      path: "tasks",
      model: "tasks",
    },
  });
});

//@desc Create a Board
//route POST /api/b/create
//@access PRIVATE

const createBoard = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!(title && description)) {
    throw new Error("Title and/or description cannot be null");
  }

  try {
    //Create and save new board
    let newBoard = Boards({ title, description });
    newBoard.save();

    // Add this board to owner's boards
    const user = await User.findById(req.user._id);
    user.boards.unshift(newBoard.id);
    await user.save();

    // Add user to members of this board
    let allMembers = [];
    allMembers.push({
      user: user._id,
      role: "owner",
    });

    // Save new board
    newBoard.members = allMembers;
    await newBoard.save();

    res.status(200).json({ newBoard, message: "Board Created!.." });
  } catch (error) {
    throw new Error(error.message);
  }
});

//@desc Delete a Board
//route DELETE /api/b/:boardId
//@access PRIVATE

// const deleteBoard = asyncHandler(async (req, res) => {
//   const { boardId } = req.params;

//   const session = await conn.startSession();

//   try {
//     session.startTransaction();

//     await User.updateOne(
//       { _id: req.user._id },
//       { $pull: { boards: boardId } },
//       { session }
//     );

//     await Boards.findByIdAndDelete(boardId, { session });

//     await session.commitTransaction();

//     res.status(200).json({ message: "Board Deleted.." });
//   } catch (error) {
//     await session.abortTransaction();
//     throw new Error(error.message);
//   }

//   session.endSession();
// });

//@desc Create a Card within a Board
//route POST /api/c/:boardId
//@access PRIVATE

// const createCard = asyncHandler(async (req, res) => {
//   const { boardId } = req.params;
//   const { title } = req.body;

//   const board = await Boards.findById(boardId);

//   if (board) {
//     board.cards.push({ title });
//     const updatedBoard = await board.save();
//     res.status(200).json({ updatedBoard, message: "Card Created.." });
//   } else {
//     res.status(404);
//     throw new Error("Board Not Found");
//   }
// });

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate whether params.id is in the user's boards or not
  const validate = req.user.boards.filter((board) => board === id);
  if (!validate) {
    throw new Error(
      "You can not see this board, you are not a member or owner!"
    );
  }

  try {
    // Get board by id
    const board = await Boards.findById(id);
    res.status(200).json({ board });
  } catch (error) {
    throw new Error(error.message);
  }
});

const addMember = asyncHandler(async (req, res) => {
  // Validate whether params.boardId is in the user's boards or not
  const validate = req.user.boards.filter(
    (board) => board === req.params.boardId
  );
  if (!validate) {
    throw new Error(
      "You can not add member to this board, you are not a member or owner!"
    );
  }
});

const updateBoardTitle = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const { title } = req.body;
  // Validate whether params.id is in the user's boards or not
  const validate = req.user.boards.filter((board) => board === boardId);
  if (!validate) {
    throw new Error(
      "You can not change title of this board, you are not a member or owner!"
    );
  }

  try {
    // Get board by id
    const board = await Boards.findById(boardId);
    board.title = title;
    await board.save();
    res.status(200).json({ message: "Success!", board });
  } catch (error) {
    throw new Error(error.message);
  }
});

const updateBoardDescription = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const { description } = req.body;
  // Validate whether params.id is in the user's boards or not
  const validate = req.user.boards.filter((board) => board === boardId);
  if (!validate) {
    throw new Error(
      "You can not change description of this board, you are not a member or owner!"
    );
  }

  try {
    // Get board by id
    const board = await Boards.findById(boardId);
    board.description = description;
    await board.save();
    res.status(200).json({ message: "Success!", board });
  } catch (error) {
    throw new Error(error.message);
  }
});

const getMembers = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  // Validate whether boardId is in the user's boards or not
  const validate = req.user.boards.filter((board) => board === boardId);
  if (!validate) {
    throw new Error(
      "You can not get details of this board, you are not a member or owner!"
    );
  }

  try {
    // Get board by id
    const board = await Boards.findById(boardId);
    res.status(200).json({ members: board.members });
  } catch (error) {
    throw new Error(error.message);
  }
});

export {
  getAllBoards,
  fetchCardsnTasks,
  createBoard,
  getById,
  addMember,
  updateBoardDescription,
  updateBoardTitle,
  getMembers
};
