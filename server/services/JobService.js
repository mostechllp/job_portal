// services/JobService.js
import { jobRepository, profileRepository } from "../config/container.js";
import { jobAlertTemplate } from "../templates/emailTemplate.js";
import { sendEmail } from "./EmailService.js";

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

  async findMatchingCandidates(job) {
    try {
      // Extract all text content from job description for matching
      const jobText = [
        job.title,
        job.category,
        ...(job.tags || []),
        job.description?.overview || "",
        ...(job.description?.requirements || []),
        ...(job.description?.responsibilities || [])
      ].join(" ").toLowerCase();

      const jobTags = [...(job.tags || []), ...(job.description?.requirements || [])]
        .map(tag => tag.toLowerCase().trim());

      const jobTitleWords = job.title.toLowerCase().split(" ");
      const jobCategory = job.category.toLowerCase();

      const profiles = await profileRepository.find();
      const matches = [];

      for (const profile of profiles) {
        if (!profile.user || profile.user.role !== "seeker") {
          continue;
        }

        let matchScore = 0;
        const matchReasons = [];

        // Check skills match against job tags and requirements
        if (profile.skills && profile.skills.length > 0) {
          const profileSkills = profile.skills.map(s => s.toLowerCase().trim());
          
          const matchedSkills = [];
          for (const tag of jobTags) {
            for (const skill of profileSkills) {
              if (skill.includes(tag) || tag.includes(skill)) {
                matchedSkills.push(tag);
                break;
              }
            }
          }

          if (matchedSkills.length > 0) {
            const uniqueMatches = [...new Set(matchedSkills)];
            matchScore += uniqueMatches.length * 20;
            matchReasons.push(`Skills match: ${uniqueMatches.join(", ")}`);
          }
        }

        // Check preferred roles match
        if (profile.jobPreferences?.preferredRoles?.length > 0) {
          const preferredRoles = profile.jobPreferences.preferredRoles.map(
            r => r.toLowerCase().trim()
          );

          let roleMatched = false;
          for (const role of preferredRoles) {
            for (const word of jobTitleWords) {
              if (role.includes(word) || word.includes(role)) {
                roleMatched = true;
                break;
              }
            }
            if (roleMatched) break;
          }

          if (!roleMatched) {
            for (const role of preferredRoles) {
              if (role.includes(jobCategory) || jobCategory.includes(role)) {
                roleMatched = true;
                break;
              }
            }
          }

          if (roleMatched) {
            matchScore += 15;
            matchReasons.push("Job matches your preferred roles");
          }
        }

        // Check location preference
        if (profile.jobPreferences?.preferredLocations?.length > 0) {
          const preferredLocations = profile.jobPreferences.preferredLocations.map(
            l => l.toLowerCase().trim()
          );
          const jobLocation = job.location.toLowerCase();

          let locationMatched = false;
          for (const loc of preferredLocations) {
            if (loc.includes("remote") && jobLocation.includes("remote")) {
              locationMatched = true;
              break;
            }
            if (jobLocation.includes(loc) || loc.includes(jobLocation)) {
              locationMatched = true;
              break;
            }
          }

          if (locationMatched) {
            matchScore += 10;
            matchReasons.push("Location matches your preferences");
          }
        }

        if (matchScore > 0) {
          matches.push({
            user: {
              _id: profile.user._id,
              name: profile.user.name,
              email: profile.user.email,
              profileImg: profile.user.profileImg,
            },
            profile: {
              skills: profile.skills || [],
              jobPreferences: profile.jobPreferences,
            },
            matchScore: Math.min(matchScore, 100),
            matchReasons,
            skills: profile.skills || [],
            preferredRoles: profile.jobPreferences?.preferredRoles || [],
          });
        }
      }

      return matches.sort((a, b) => b.matchScore - a.matchScore);
    } catch (error) {
      console.error("Error in findMatchingCandidates:", error);
      throw new Error("Error finding matching candidates: " + error.message);
    }
  }

  async createJobWithAlerts(jobData, userId) {
    try {
      const newJob = {
        ...jobData,
        createdBy: userId,
        applicantCount: 0,
        isActive: true,
      };

      const job = await jobRepository.create(newJob);
      const matches = await this.findMatchingCandidates(job);

      if (matches.length > 0) {
        const topMatches = matches.slice(0, 50);
        this.sendJobAlertsToMatches(job, topMatches).catch(err =>
          console.error("Error sending job alerts:", err)
        );
      }

      return {
        ...job.toObject(),
        matches,
      };
    } catch (error) {
      console.error("Error in createJobWithAlerts:", error);
      throw new Error("Error creating job with alerts: " + error.message);
    }
  }

  async sendJobAlertsToMatches(job, matches) {
    const emailPromises = matches.map((match) => {
      const template = jobAlertTemplate(match.user, job);
      return sendEmail({
        to: match.user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
    });

    const results = await Promise.allSettled(emailPromises);
    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value
    ).length;

    return { total: matches.length, successful };
  }

  async getPublicJobs(filters = {}) {
    try {
      const { page = 1, limit = 10, category, location, type } = filters;
      const skip = (page - 1) * limit;

      const query = { isActive: true };

      if (category) {
        query.category = category;
      }

      if (location) {
        query.location = { $regex: location, $options: "i" };
      }

      if (type) {
        query.workType = type;
      }

      const total = await jobRepository.countDocuments(query);
      const jobs = await jobRepository.findPublic(query, {
        skip,
        limit,
        sort: { createdAt: -1 },
      });

      return {
        data: jobs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error in getPublicJobs service:", error);
      throw new Error("Error fetching public jobs: " + error.message);
    }
  }

  async getPublicJobById(id) {
    try {
      const job = await jobRepository.findById(id);

      if (!job) {
        throw new Error("Job not found");
      }

      if (!job.isActive) {
        throw new Error("Job is no longer active");
      }

      // Return all job data including the structured description
      return {
        _id: job._id,
        title: job.title,
        company: job.company,
        category: job.category,
        salary: job.salary,
        location: job.location,
        workType: job.workType,
        description: job.description, // Now returns the full description object
        tags: job.tags,
        isActive: job.isActive,
        createdAt: job.createdAt,
        applicantCount: job.applicantCount,
      };
    } catch (error) {
      throw error;
    }
  }

  async searchJobs(searchParams) {
    try {
      const { query, location, category } = searchParams;

      const searchQuery = { isActive: true };

      if (query) {
        searchQuery.$or = [
          { title: { $regex: query, $options: "i" } },
          { "description.overview": { $regex: query, $options: "i" } },
          { "description.responsibilities": { $elemMatch: { $regex: query, $options: "i" } } },
          { "description.requirements": { $elemMatch: { $regex: query, $options: "i" } } },
          { tags: { $in: [new RegExp(query, "i")] } },
        ];
      }

      if (location) {
        searchQuery.location = { $regex: location, $options: "i" };
      }

      if (category) {
        searchQuery.category = category;
      }

      const jobs = await jobRepository.findPublic(searchQuery, {
        sort: { createdAt: -1 },
        limit: 50,
      });

      return jobs;
    } catch (error) {
      throw new Error("Error searching jobs: " + error.message);
    }
  }

  async getSimilarJobs(jobId, limit = 5) {
    try {
      const job = await jobRepository.findById(jobId);

      if (!job) {
        throw new Error("Job not found");
      }

      const similarJobs = await jobRepository.findPublic(
        {
          _id: { $ne: jobId },
          isActive: true,
          $or: [
            { category: job.category },
            { tags: { $in: job.tags } },
            { "description.requirements": { $in: job.description?.requirements || [] } }
          ],
        },
        {
          limit,
          sort: { createdAt: -1 },
        }
      );

      return similarJobs;
    } catch (error) {
      throw new Error("Error fetching similar jobs: " + error.message);
    }
  }
}