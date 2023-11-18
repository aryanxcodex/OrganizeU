import asyncHandler from "express-async-handler";
import Boards from "../models/boards.js";
import Tasks from "../models/tasks.js";
// import { conn } from "../config/db.js";

//@desc Create a Task
//route POST /api/t/tasks
//@access PRIVATE

const createTask = asyncHandler(async (req, res) => {
  const { boardId, cardId, title, pos } = req.body;

  const newTask = await Tasks.create({
    title: title,
    status: "incomplete",
    pos,
  });

  const updatedBoard = await Boards.findOneAndUpdate(
    { _id: boardId },
    { $push: { "cards.$[cardElem].tasks": newTask._id } },
    {
      new: true,
      useFindAndModify: false,
      arrayFilters: [{ "cardElem._id": cardId }],
    }
  );

  if (updatedBoard) {
    res.status(200).json({ newTask, updatedBoard, message: "Task Created.." });
  } else {
    throw new Error("Invalid Board or Card Id");
  }
});

//@desc Delete a Task
//route DELETE /api/t/tasks/:taskId
//@access PRIVATE

const deleteTask = asyncHandler(async (req, res) => {
  const { boardId, cardId } = req.body;
  const { taskId } = req.params;

  try {
    const updatedBoard = await Boards.findOneAndUpdate(
      { _id: boardId },
      { $pull: { "cards.$[cardElem].tasks": taskId } },
      {
        new: true,
        useFindAndModify: false,
        arrayFilters: [{ "cardElem._id": cardId }],
      }
    );

    await Tasks.findByIdAndDelete(taskId);

    res.status(200).json({ updatedBoard, message: "Task Deleted.." });
  } catch (error) {
    throw new Error(error.message);
  }
});

//@desc Update a Tasks Position/Description/Status
//route PUT /api/t/tasks/:taskId
//@access PRIVATE

const updateTasks = asyncHandler(async (req, res) => {
  
});

export { createTask, deleteTask };
