import { Router } from "express";
import { upload, uploadImage } from "../utils/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";
import { profileController } from "../config/container.js";

const router = Router();

// All profile routes require authentication
router.use(protect);

// Basic profile routes
router.get("/", profileController.getProfile);
router.put("/", profileController.updateProfile);

// Skills routes
router.post("/skills", profileController.addSkill);
router.delete("/skills/:skill", profileController.removeSkill);

// Experience routes
router.post("/experience", profileController.addExperience);
router.put("/experience/:experienceId", profileController.updateExperience);
router.delete("/experience/:experienceId", profileController.deleteExperience);

// Education routes
router.post("/education", profileController.addEducation);
router.put("/education/:educationId", profileController.updateEducation);
router.delete("/education/:educationId", profileController.deleteEducation);

// Languages routes
router.post("/languages", profileController.addLanguage);
router.delete("/languages", profileController.removeLanguage);

// profile image routes
router.post("/profile-image", uploadImage.single("profileImage"), profileController.uploadProfileImage);
router.delete("/profile-image", profileController.deleteProfileImage);

// Resume routes
router.post("/resume", upload.single("resume"), profileController.uploadResume);
router.delete("/resume", profileController.deleteResume);

export default router;