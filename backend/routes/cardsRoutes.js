import express from "express";
const router = express.Router();

import {
  createCard,
  getAllCards,
  updateCardTitle,
  deleteById,
  updateTaskOrder,
} from "../controllers/cardsController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/create").post(protect, createCard);
router.route("/:boardId").get(protect, getAllCards);
router.route("/:boardId/:cardId/update-title").put(protect, updateCardTitle);
router.route("/:boardId/:cardId").delete(protect, deleteById);
router.route("/change-task-order").put(protect, updateTaskOrder);

export default router;
