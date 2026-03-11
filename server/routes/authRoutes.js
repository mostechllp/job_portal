import express from "express";
import { authController } from "../config/container.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", authController.register)
router.post("/login", authController.login);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP)
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-otp", authController.verifyResetOTP);
router.post("/reset-password", authController.resetPassword);

router.post("/admin-login", authController.adminLogin);

router.get('/me', protect, authController.getMe);

export default router