import express from "express";
const router = express.Router();
import {
  createBoard,
  getAllBoards,
  getById,
  addMember,
  updateBoardDescription,
  updateBoardTitle,
  getMembers,
} from "../controllers/boardsController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/create").post(protect, createBoard);
router.route("/").get(protect, getAllBoards);
router.route("/:id").get(protect, getById);
router.route("/:boardId/add-member").post(protect, addMember);
router
  .route("/:boardId/update-board-description")
  .put(protect, updateBoardDescription);
router.route("/:boardId/update-board-title").put(protect, updateBoardTitle);
router.route("/:boardId/getMembers").get(protect, getMembers);

export default router;
