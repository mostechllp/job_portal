import { Profile } from "../models/Profile.js";

export class ProfileRepository {

  async find() {
    try {
      return await Profile.find()
      .populate({
        path: 'user',
        model: 'User',
        select: 'name email profileImg role'
      })
        .lean();
    } catch (error) {
      throw new Error("Error finding profile: " + error.message);
    }
  }

  async findByUserId(userId) {
    try {
      return await Profile.findOne({ user: userId }).populate(
        "user",
        "name email profileImg role",
      );
    } catch (error) {
      throw new Error("Error finding profile: " + error.message);
    }
  }

  async create(userId) {
    try {
      // Create a new profile with just the user ID
      const profileData = {
        user: userId, // This should be just the ID string/value, not an object
        skills: [],
        experience: [],
        education: [],
        jobPreferences: {
          preferredRoles: [],
          expectedSalary: { min: 0, max: 0, currency: "INR" },
          workType: "any",
          preferredLocations: [],
        },
        phone: "",
        location: "",
        professionalSummary: "",
        resume: {
          url: null,
          publicId: null,
          fileName: null,
          fileSize: null,
          uploadedAt: null,
        },
        socialLinks: {
          linkedin: "",
          github: "",
          portfolio: "",
          twitter: "",
        },
        languages: [],
      };

      return await Profile.create(profileData);
    } catch (error) {
      console.error("Error in profile repository create:", error);
      throw new Error("Error creating profile: " + error.message);
    }
  }

  async updateByUserId(userId, updateData) {
    try {
      let profile = await Profile.findOneAndUpdate(
        { user: userId },
        { $set: updateData },
        { returnDocument: "after", upsert: true, runValidators: true },
      ).populate("user", "name email profileImg role");

      return profile;
    } catch (error) {
      throw new Error("Error updating profile: " + error.message);
    }
  }

  async addSkill(userId, skill) {
    try {
      return await Profile.findOneAndUpdate(
        { user: userId },
        { $addToSet: { skills: skill } },
        { returnDocument: "after", upsert: true, runValidators: true },
      );
    } catch (error) {
      throw new Error("Error adding skill: " + error.message);
    }
  }

  async removeSkill(userId, skill) {
    try {
      return await Profile.findOneAndUpdate(
        { user: userId },
        { $pull: { skills: skill } },
        { returnDocument: "after", runValidators: true },
      );
    } catch (error) {
      throw new Error("Error removing skill: " + error.message);
    }
  }

  async addExperience(userId, experienceData) {
    try {
      return await Profile.findOneAndUpdate(
        { user: userId },
        { $push: { experience: experienceData } },
        { returnDocument: "after", upsert: true, runValidators: true },
      );
    } catch (error) {
      throw new Error("Error adding experience: " + error.message);
    }
  }

  async updateExperience(userId, experienceId, updateData) {
    try {
      return await Profile.findOneAndUpdate(
        { user: userId, "experience._id": experienceId },
        { $set: { "experience.$": updateData } },
        { returnDocument: "after", runValidators: true },
      );
    } catch (error) {
      throw new Error("Error updating experience: " + error.message);
    }
  }

  async deleteExperience(userId, experienceId) {
    try {
      return await Profile.findOneAndUpdate(
        { user: userId },
        { $pull: { experience: { _id: experienceId } } },
        { returnDocument: "after", runValidators: true },
      );
    } catch (error) {
      throw new Error("Error deleting experience: " + error.message);
    }
  }

  async updateResume(userId, resumeData) {
    try {
      return await Profile.findOneAndUpdate(
        { user: userId },
        {
          $set: {
            resume: {
              ...resumeData,
              uploadedAt: new Date(),
            },
          },
        },
        { returnDocument: "after", upsert: true, runValidators: true },
      );
    } catch (error) {
      throw new Error("Error updating resume: " + error.message);
    }
  }
  async addEducation(userId, educationData) {
    try {
      return await Profile.findOneAndUpdate(
        { user: userId },
        { $push: { education: educationData } },
        { returnDocument: "after", upsert: true, runValidators: true },
      );
    } catch (error) {
      throw new Error("Error adding education: " + error.message);
    }
  }

  async updateEducation(userId, educationId, updateData) {
    try {
      return await Profile.findOneAndUpdate(
        { user: userId, "education._id": educationId },
        { $set: { "education.$": updateData } },
        { returnDocument: "after", runValidators: true },
      );
    } catch (error) {
      throw new Error("Error updating education: " + error.message);
    }
  }

  async deleteEducation(userId, educationId) {
    try {
      return await Profile.findOneAndUpdate(
        { user: userId },
        { $pull: { education: { _id: educationId } } },
        { returnDocument: "after", runValidators: true },
      );
    } catch (error) {
      throw new Error("Error deleting education: " + error.message);
    }
  }

  // Languages methods
  async addLanguage(userId, languageData) {
    try {
      return await Profile.findOneAndUpdate(
        { user: userId },
        { $addToSet: { languages: languageData } },
        { returnDocument: "after", upsert: true, runValidators: true },
      );
    } catch (error) {
      throw new Error("Error adding language: " + error.message);
    }
  }

  async removeLanguage(userId, language) {
    try {
      return await Profile.findOneAndUpdate(
        { user: userId },
        { $pull: { languages: language } },
        { returnDocument: "after", runValidators: true },
      );
    } catch (error) {
      throw new Error("Error removing language: " + error.message);
    }
  }
}
