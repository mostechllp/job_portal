import { jobService } from "../config/container.js";

export class PublicJobController {
  getPublicJobs = async (req, res, next) => {

    try {
      const { page = 1, limit = 10, category, location, type } = req.query;

      const result = await jobService.getPublicJobs({
        page: parseInt(page),
        limit: parseInt(limit),
        category,
        location,
        type,
      });

      // Send the response in the format the frontend expects
      res.status(200).json({
        message: "Jobs fetched successfully",
        jobs: result.data, 
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("❌ Error in getPublicJobs:", error);
      next(error);
    }
  };
  searchJobs = async (req, res, next) => {
    try {
      const { query, location, category } = req.query;
      const jobs = await jobService.searchJobs({ query, location, category });

      res.status(200).json({
        message: "Search results fetched successfully",
        jobs,
      });
    } catch (error) {
      next(error);
    }
  };

  getPublicJobById = async (req, res, next) => {
    try {
      const { id } = req.params;

      // Validate if id is a valid ObjectId
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          message: "Invalid job ID format",
        });
      }

      const job = await jobService.getPublicJobById(id);

      res.status(200).json({
        message: "Job fetched successfully",
        job,
      });
    } catch (error) {
      if (
        error.message === "Job not found" ||
        error.message === "Job is no longer active"
      ) {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  };

  getSimilarJobs = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { limit = 5 } = req.query;

      // Validate if id is a valid ObjectId
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          message: "Invalid job ID format",
        });
      }

      const jobs = await jobService.getSimilarJobs(id, parseInt(limit));

      res.status(200).json({
        message: "Similar jobs fetched successfully",
        jobs,
      });
    } catch (error) {
      if (error.message === "Job not found") {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  };
}
