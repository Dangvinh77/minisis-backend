import { Router } from "express";
import { changePassword, getUserProfile, login, registerUser, updateUserProfile } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/personal", verifyToken, getUserProfile);
router.put("/personal", verifyToken, updateUserProfile);
router.put("/security", verifyToken, changePassword);
export default router;
