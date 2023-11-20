import asyncHandler from "express-async-handler";
import Boards from "../models/boards.js";
import Cards from "../models/cards.js";
import Tasks from "../models/tasks.js";
// import { conn } from "../config/db.js";

//@desc Create a task within a card
//route POST /api/t/create
//@access PRIVATE

const createTask = asyncHandler(async (req, res) => {
  // Deconstruct the params
  const { title, cardId, boardId } = req.body;
  const user = req.user;

  // Validate the inputs
  if (!(title && cardId && boardId)) {
    throw new Error(
      "The create operation could not be completed because there is missing information"
    );
  }

  try {
    // Get card and board
    const card = await Cards.findById(cardId);
    const board = await Boards.findById(boardId);

    // Validate the ownership
    const validate1 = board.cards.filter(
      (item) => item.toString() === card._id.toString()
    );
    const validate2 = user.boards.filter(
      (item) => item.toString() === board._id.toString()
    );
    if (!(validate1 && validate2)) {
      throw new Error(
        "You dont have permission to add task to this card or board"
      );
    }

    // Create new task
    const task = await Tasks({ title: title, status: "incomplete" });
    task.owner = cardId;
    await task.save();

    // Add id of the new task to owner card
    card.tasks.push(task._id);
    await card.save();

    // Set data transfer object
    const result = await Cards.findById(cardId)
      .populate({ path: "tasks" })
      .exec();

    res.status(200).json({ result, message: "Task Created .." });
  } catch (error) {
    throw new Error(error.message);
  }
});

//@desc Get a Particular Task
//route GET /:boardId/:cardId/:taskId
//@access PRIVATE

const getTask = asyncHandler(async (req, res) => {
  // Get params
  const user = req.user;
  const { boardId, cardId, taskId } = req.params;

  try {
    // Get models
    const task = await Tasks.findById(taskId);
    const card = await Cards.findById(cardId);
    const board = await Boards.findById(boardId);

    // Validate owner
    const validate1 = card.tasks.filter(
      (item) => item.toString() === task._id.toString()
    );
    const validate2 = board.cards.filter(
      (item) => item.toString() === card._id.toString()
    );
    const validate3 = user.boards.filter(
      (item) => item.toString() === board._id.toString()
    );

    if (!(validate1 && validate2 && validate3)) {
      throw new Error("You dont have permission to access this task");
    }

    let returnObject = {
      ...task._doc,
      cardTitle: card.title,
      cardId: cardId,
      boardId: boardId,
    };

    res.status(200).json({ returnObject });
  } catch (error) {
    throw new Error(error.message);
  }
});

//@desc Update a Particular Task
//route PUT /:boardId/:cardId/:taskId
//@access PRIVATE

const updateTask = asyncHandler(async (req, res) => {
  // Get params
  const user = req.user;
  const { boardId, cardId, taskId } = req.params;
  const updatedObj = req.body;

  try {
    // Get models
    const task = await Tasks.findById(taskId);
    const card = await Cards.findById(cardId);
    const board = await Boards.findById(boardId);

    // Validate owner
    const validate1 = card.tasks.filter(
      (item) => item.toString() === task._id.toString()
    );
    const validate2 = board.cards.filter(
      (item) => item.toString() === card._id.toString()
    );
    const validate3 = user.boards.filter(
      (item) => item.toString() === board._id.toString()
    );
    if (!(validate1 && validate2 && validate3)) {
      throw new Error("You dont have permission to update this task");
    }

    //Update card
    await task.updateOne(updatedObj);
    await task.save();

    res.status(200).json({ task, message: "Success" });
  } catch (error) {
    throw new Error(error.message);
  }
});

const deleteTask = asyncHandler(async (req, res) => {
  // deconstruct the params
  const user = req.user;
  const { boardId, cardId, taskId } = req.params;

  try {
    // Get models
    const task = await Tasks.findById(taskId);
    const card = await Cards.findById(cardId);
    const board = await Boards.findById(boardId);

    // Validate owner
    const validate1 = card.tasks.filter(
      (item) => item.toString() === task._id.toString()
    );
    const validate2 = board.cards.filter(
      (item) => item.toString() === card._id.toString()
    );
    const validate3 = user.boards.filter(
      (item) => item.toString() === board._id.toString()
    );
    if (!(validate1 && validate2 && validate3)) {
      throw new Error("You dont have permission to delete this task");
    }

    // Delete the card
    const result = await Tasks.findByIdAndDelete(taskId);

    // Delete the task from tasks of cards
    card.tasks = card.tasks.filter(
      (tempTask) => tempTask.toString() !== taskId
    );
    await card.save();

    res.status(200).json({ result, card, message: "Success" });
  } catch (error) {
    throw new Error(error.message);
  }
});
export { createTask, getTask, updateTask, deleteTask };
