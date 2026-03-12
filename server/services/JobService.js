import { jobRepository } from "../config/container.js";


export class JobService {

  async getAllJobs() {
    return await jobRepository.findAll();
  }

  async getActiveJobs() {
    return await jobRepository.findActive();
  }

  async getJobById(id) {
    const job = await jobRepository.findById(id);
    if (!job) {
      throw new Error("Job not found");
    }
    return job;
  }

  async createJob(jobData, userId) {
    const newJob = {
      ...jobData,
      createdBy: userId,
      applicantCount: 0,
      isActive: true,
    };
    return await jobRepository.create(newJob);
  }

  async updateJob(id, updateData, userId) {
    const job = await jobRepository.findById(id);
    if (!job) {
      throw new Error("Job not found");
    }
    
    // Check if user is authorized to update this job
    if (job.createdBy.toString() !== userId.toString()) {
      throw new Error("Unauthorized to update this job");
    }

    return await jobRepository.update(id, updateData);
  }

  async deleteJob(id, userId) {
    const job = await jobRepository.findById(id);
    if (!job) {
      throw new Error("Job not found");
    }

    // Check if user is authorized to delete this job
    if (job.createdBy.toString() !== userId.toString()) {
      throw new Error("Unauthorized to delete this job");
    }

    return await jobRepository.delete(id);
  }

  async toggleJobStatus(id, userId) {
    const job = await jobRepository.findById(id);
    if (!job) {
      throw new Error("Job not found");
    }

    // Check if user is authorized to toggle this job
    if (job.createdBy.toString() !== userId.toString()) {
      throw new Error("Unauthorized to modify this job");
    }

    return await jobRepository.toggleStatus(id, !job.isActive);
  }

  async incrementApplicantCount(id) {
    const job = await jobRepository.findById(id);
    if (!job) {
      throw new Error("Job not found");
    }
    return await jobRepository.incrementApplicantCount(id);
  }
}