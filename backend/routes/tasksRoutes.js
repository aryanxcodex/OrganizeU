import express from "express";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";
import {
  createTask,
  getTask,
  deleteTask,
  updateTask,
  assignTask,
} from "../controllers/tasksController.js";

router.route("/create").post(protect, createTask);
router
  .route("/:boardId/:cardId/:taskId")
  .get(protect, getTask)
  .put(protect, updateTask);

router
  .route("/:boardId/:cardId/:taskId/delete-card")
  .delete(protect, deleteTask);

router.route("/:boardId/:cardId/:taskId/assign-task").put(protect, assignTask);

export default router;
