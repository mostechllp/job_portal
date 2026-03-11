import express from "express";
import { authController } from "../config/container.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", authController.register)
router.post("/login", authController.login);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP)

router.get('/me', protect, authController.getMe);

export default router