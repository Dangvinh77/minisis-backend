import { Router } from "express";
import { createAccountByAdmin } from "../controllers/auth.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Admin tạo thêm tài khoản
router.post("/account-manager/create", verifyToken, isAdmin, createAccountByAdmin);

export default router;
