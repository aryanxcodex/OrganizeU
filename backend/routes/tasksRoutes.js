import express from "express";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";
import { createTask, deleteTask } from "../controllers/tasksController.js";

router.route("/tasks").post(protect, createTask);
router.route("/tasks/:taskId").delete(protect, deleteTask);

export default router;
