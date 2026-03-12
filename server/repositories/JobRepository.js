// repositories/JobRepository.js
import { Job } from "../models/Job.js";

export class JobRepository {
  async findAll() {
    try {
      return await Job.find().sort({ createdAt: -1 });
    } catch (error) {
      throw new Error("Error fetching jobs: " + error.message);
    }
  }

  async findActive() {
    try {
      return await Job.find({ isActive: true }).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error("Error fetching active jobs: " + error.message);
    }
  }

  async findById(id) {
    try {
      return await Job.findById(id);
    } catch (error) {
      throw new Error("Error finding job: " + error.message);
    }
  }

  async create(jobData) {
    try {
      return await Job.create(jobData);
    } catch (error) {
      throw new Error("Error creating job: " + error.message);
    }
  }

  async update(id, updateData) {
    try {
      return await Job.findByIdAndUpdate(
        id,
        { $set: updateData },
        { returnDocument: "after", runValidators: true }
      );
    } catch (error) {
      throw new Error("Error updating job: " + error.message);
    }
  }

  async delete(id) {
    try {
      return await Job.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Error deleting job: " + error.message);
    }
  }

  async toggleStatus(id, isActive) {
    try {
      return await Job.findByIdAndUpdate(
        id,
        { $set: { isActive } },
        { returnDocument: "after" }
      );
    } catch (error) {
      throw new Error("Error toggling job status: " + error.message);
    }
  }

  async incrementApplicantCount(id) {
    try {
      return await Job.findByIdAndUpdate(
        id,
        { $inc: { applicantCount: 1 } },
        { returnDocument: "after" }
      );
    } catch (error) {
      throw new Error("Error incrementing applicant count: " + error.message);
    }
  }
}