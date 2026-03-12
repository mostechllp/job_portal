import express from "express";
import {publicJobController } from "../config/container.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", publicJobController.getPublicJobs);
router.get("/search", publicJobController.searchJobs);
router.get("/:id", publicJobController.getPublicJobById);
router.get("/:id/similar", publicJobController.getSimilarJobs);

export default router;