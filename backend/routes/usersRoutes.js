import express from "express";
const router = express.Router();
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  confirmUser,
  sendInvitation,
  checkUserInvitation,
} from "../controllers/usersController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.get("/confirm/:id", confirmUser);
router.route("/createInvitation").post(protect, sendInvitation);
router.route("/checkUserInvitation").post(protect, checkUserInvitation);

export default router;
