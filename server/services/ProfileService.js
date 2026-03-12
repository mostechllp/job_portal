import {
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadProfileImage,
} from "../utils/cloudinary.js";
import { profileRepository, userRepository } from "../config/container.js";
import { User } from "../models/User.js";

export class ProfileService {
  async getProfile(userId) {
    let profile = await profileRepository.findByUserId(userId);

    if (!profile) {
      profile = await profileRepository.create(userId);
    }

    return profile;
  }

  async updateProfile(userId, profileData) {
    return await profileRepository.updateByUserId(userId, profileData);
  }

  async addSkill(userId, skill) {
    return await profileRepository.addSkill(userId, skill);
  }

  async removeSkill(userId, skill) {
    return await profileRepository.removeSkill(userId, skill);
  }

  async addExperience(userId, experienceData) {
    return await profileRepository.addExperience(userId, experienceData);
  }

  async updateExperience(userId, experienceId, experienceData) {
    return await profileRepository.updateExperience(
      userId,
      experienceId,
      experienceData,
    );
  }

  async deleteExperience(userId, experienceId) {
    return await profileRepository.deleteExperience(userId, experienceId);
  }

  // In profile.service.js - uploadResume function
  async uploadResume(userId, file, existingResumePublicId = null) {
    try {
      if (existingResumePublicId) {
        await deleteFromCloudinary(existingResumePublicId, "raw");
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const fileType = file.mimetype;
      const fileExtension = file.originalname.split(".").pop().toLowerCase();

      console.log(`Uploading resume: ${file.originalname} (${fileType})`);

      const uploadResult = await uploadToCloudinary(file, {
        folder: "resumes",
        userId: userId,
        userName: user.name,
      });

      console.log("Upload result from Cloudinary:", uploadResult);

      // Store the EXACT URL from Cloudinary first
      const resumeData = {
        url: uploadResult.secure_url, // Store the original URL
        publicId: uploadResult.public_id,
        fileName: file.originalname,
        fileSize: file.size,
        fileType: fileType,
        fileExtension: fileExtension,
        uploadedAt: new Date(),
      };

      console.log("Saving resume data:", resumeData);
      return await profileRepository.updateResume(userId, resumeData);
    } catch (error) {
      console.error("Error uploading resume:", error);
      throw new Error("Error uploading resume: " + error.message);
    }
  }

  async deleteResume(userId, publicId) {
    try {
      await deleteFromCloudinary(publicId, "raw");
      return await profileRepository.updateResume(userId, {
        url: null,
        publicId: null,
        fileName: null,
        fileSize: null,
        fileType: null,
        fileExtension: null,
        uploadedAt: null,
      });
    } catch (error) {
      console.error("Error deleting resume:", error);
      throw new Error("Error deleting resume: " + error.message);
    }
  }
  async addEducation(userId, educationData) {
    return await profileRepository.addEducation(userId, educationData);
  }

  async updateEducation(userId, educationId, educationData) {
    return await profileRepository.updateEducation(
      userId,
      educationId,
      educationData,
    );
  }

  async deleteEducation(userId, educationId) {
    return await profileRepository.deleteEducation(userId, educationId);
  }

  // Languages methods
  async addLanguage(userId, languageData) {
    return await profileRepository.addLanguage(userId, languageData);
  }

  async removeLanguage(userId, language) {
    return await profileRepository.removeLanguage(userId, language);
  }

  // services/profile.service.js

  async uploadProfileImage(userId, file) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // If user already has a profile image, delete it from Cloudinary
      if (user.profileImg) {
        const publicId = this.extractPublicIdFromUrl(user.profileImg);
        if (publicId) {
          await deleteFromCloudinary(publicId, "image").catch((err) =>
            console.error("Error deleting old profile image:", err),
          );
        }
      }

      // Upload new image
      const uploadResult = await uploadProfileImage(file, userId, user.name);

      // Update user with new image URL and return the updated user
      const updatedUser = await userRepository.updateProfileImage(
        userId,
        uploadResult.secure_url,
      );

      return updatedUser; // Return the updated user directly
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw new Error("Error uploading profile image: " + error.message);
    }
  }

  async deleteProfileImage(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Delete from Cloudinary if exists
      if (user.profileImg) {
        const publicId = this.extractPublicIdFromUrl(user.profileImg);
        if (publicId) {
          await deleteFromCloudinary(publicId, "image");
        }
      }

      // Update user and return the updated user
      const updatedUser = await userRepository.deleteProfileImage(userId);
      return updatedUser; // Return the updated user directly
    } catch (error) {
      console.error("Error deleting profile image:", error);
      throw new Error("Error deleting profile image: " + error.message);
    }
  }

  extractPublicIdFromUrl(url) {
    if (!url) return null;
    // Extract public_id from Cloudinary URL
    // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/profile_images/name_userid
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)\./);
    return matches ? matches[1] : null;
  }
}
