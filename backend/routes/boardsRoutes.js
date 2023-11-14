import express from "express";
const router = express.Router();
import {
  createBoard,
  deleteBoard,
  fetchBoards,
} from "../controllers/boardsController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/boards").get(protect, fetchBoards).post(protect, createBoard);
router.route("/:boardId").delete(protect, deleteBoard);

export default router;
