import express from "express";
const router = express.Router();

import { createCard } from "../controllers/boardsController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/:boardId").post(protect, createCard);

export default router;
