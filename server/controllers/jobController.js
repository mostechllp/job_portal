import { jobService } from "../config/container.js";
export class JobController {
  getAllJobs = async (req, res, next) => {
    try {
      const jobs = await jobService.getAllJobs();
      res.status(200).json({
        message: "Jobs fetched successfully",
        jobs,
      });
    } catch (error) {
      next(error);
    }
  };

  getActiveJobs = async (req, res, next) => {
    try {
      const jobs = await jobService.getActiveJobs();
      res.status(200).json({
        message: "Active jobs fetched successfully",
        jobs,
      });
    } catch (error) {
      next(error);
    }
  };

  getJobById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const job = await jobService.getJobById(id);
      res.status(200).json({
        message: "Job fetched successfully",
        job,
      });
    } catch (error) {
      next(error);
    }
  };

  createJob = async (req, res, next) => {
    try {
      const jobData = req.body;
      const userId = req.user._id;

      const newJob = await jobService.createJobWithAlerts(jobData, userId);

      res.status(201).json({
        message: "Job created successfully",
        job: newJob,
        matches: newJob.matches,
      });
    } catch (error) {
      next(error);
    }
  };

  getJobMatches = async (req, res, next) => {
    try {
      const { id } = req.params;
      const job = await jobService.getJobById(id);
      const matches = await jobService.findMatchingCandidates(job);

      res.status(200).json({
        message: "Matches fetched successfully",
        matches,
      });
    } catch (error) {
      next(error);
    }
  };

  updateJob = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user._id;

      const updatedJob = await jobService.updateJob(id, updateData, userId);

      res.status(200).json({
        message: "Job updated successfully",
        job: updatedJob,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteJob = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      await jobService.deleteJob(id, userId);

      res.status(200).json({
        message: "Job deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  toggleJobStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const updatedJob = await jobService.toggleJobStatus(id, userId);

      res.status(200).json({
        message: "Job status updated successfully",
        job: updatedJob,
      });
    } catch (error) {
      next(error);
    }
  };
}
