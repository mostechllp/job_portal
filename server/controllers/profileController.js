import { profileService } from "../config/container.js";

export class ProfileController {
  async getProfile(req, res, next) {
    try {
      const profile = await profileService.getProfile(req.user._id);
      res
        .status(200)
        .json({ message: "Profile fetched successfully", profile });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const profile = await profileService.updateProfile(
        req.user._id,
        req.body,
      );
      res
        .status(200)
        .json({ message: "Profile updated successfully", profile });
    } catch (error) {
      next(error);
    }
  }

  async addSkill(req, res, next) {
    try {
      const { skill } = req.body;
      const profile = await profileService.addSkill(req.user._id, skill);
      res.status(200).json({ message: "Skill added successfully", profile });
    } catch (error) {
      next(error);
    }
  }

  async removeSkill(req, res, next) {
    try {
      const { skill } = req.params;
      const profile = await profileService.removeSkill(req.user._id, skill);
      res.status(200).json({ message: "Skill removed successfully", profile });
    } catch (error) {
      next(error);
    }
  }

  async addExperience(req, res, next) {
    try {
      const profile = await profileService.addExperience(
        req.user._id,
        req.body,
      );
      res
        .status(200)
        .json({ message: "Experience added successfully", profile });
    } catch (error) {
      next(error);
    }
  }

  async updateExperience(req, res, next) {
    try {
      const { experienceId } = req.params;
      const profile = await profileService.updateExperience(
        req.user._id,
        experienceId,
        req.body,
      );
      res
        .status(200)
        .json({ message: "Experience updated successfully", profile });
    } catch (error) {
      next(error);
    }
  }

  async deleteExperience(req, res, next) {
    try {
      const { experienceId } = req.params;
      const profile = await profileService.deleteExperience(
        req.user._id,
        experienceId,
      );
      res
        .status(200)
        .json({ message: "Experience deleted successfully", profile });
    } catch (error) {
      next(error);
    }
  }

  async uploadResume(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const profile = await profileService.uploadResume(
        req.user._id,
        req.file,
        req.body.existingPublicId,
      );

      res.status(200).json({ message: "Resume updated successfully", profile });
    } catch (error) {
      next(error);
    }
  }

  async deleteResume(req, res, next) {
    try {
      const { publicId } = req.body;
      const profile = await profileService.deleteResume(req.user._id, publicId);
      res.status(200).json({ message: "Resume deleted successfully", profile });
    } catch (error) {
      next(error);
    }
  }
  async addEducation(req, res, next) {
    try {
      const profile = await profileService.addEducation(req.user._id, req.body);
      res
        .status(200)
        .json({ message: "Education added successfully", profile });
    } catch (error) {
      next(error);
    }
  }

  async updateEducation(req, res, next) {
    try {
      const { educationId } = req.params;
      const profile = await profileService.updateEducation(
        req.user._id,
        educationId,
        req.body,
      );
      res
        .status(200)
        .json({ message: "Education updated successfully", profile });
    } catch (error) {
      next(error);
    }
  }

  async deleteEducation(req, res, next) {
    try {
      const { educationId } = req.params;
      const profile = await profileService.deleteEducation(
        req.user._id,
        educationId,
      );
      res
        .status(200)
        .json({ message: "Education deleted successfully", profile });
    } catch (error) {
      next(error);
    }
  }

  // Languages methods
  async addLanguage(req, res, next) {
    try {
      const profile = await profileService.addLanguage(req.user._id, req.body);
      res.status(200).json({ message: "Language added successfully", profile });
    } catch (error) {
      next(error);
    }
  }

  async removeLanguage(req, res, next) {
    try {
      const { language } = req.body;
      const profile = await profileService.removeLanguage(
        req.user._id,
        language,
      );
      res
        .status(200)
        .json({ message: "Language removed successfully", profile });
    } catch (error) {
      next(error);
    }
  }

  async uploadProfileImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Validate file type
      if (!req.file.mimetype.startsWith("image/")) {
        return res
          .status(400)
          .json({ message: "Only image files are allowed" });
      }

      // Validate file size (max 5MB)
      if (req.file.size > 5 * 1024 * 1024) {
        return res
          .status(400)
          .json({ message: "File size must be less than 5MB" });
      }

      const updatedUser = await profileService.uploadProfileImage(
        req.user._id,
        req.file,
      );

      // get the profile to return complete data
      const profile = await profileService.getProfile(req.user._id);

      res.status(200).json({
        message: "Profile image uploaded successfully",
        profile,
        user: updatedUser, 
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProfileImage(req, res, next) {
    try {
      const updatedUser = await profileService.deleteProfileImage(req.user._id);

      const profile = await profileService.getProfile(req.user._id);

      res.status(200).json({
        message: "Profile image deleted successfully",
        profile,
        user: updatedUser, 
      });
    } catch (error) {
      next(error);
    }
  }
}
