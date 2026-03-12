import express from "express";
import { authorizeAdmin, protect } from "../middleware/authMiddleware.js";
import { jobController } from "../config/container.js";

const router = express.Router();

// Public routes
router.get("/active", jobController.getActiveJobs);
router.get("/:id", jobController.getJobById);

// Protected routes (require authentication)
router.use(protect);

// Admin only routes
router.get("/", authorizeAdmin, jobController.getAllJobs);
router.post("/", authorizeAdmin, jobController.createJob);
router.put("/:id", authorizeAdmin, jobController.updateJob);
router.delete("/:id", authorizeAdmin, jobController.deleteJob);
router.patch("/:id/toggle", authorizeAdmin, jobController.toggleJobStatus);

export default router;