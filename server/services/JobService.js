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

  async findMatchingCandidates(job) {
    try {
      console.log("Finding matches for job:", job.title);
      console.log("Job tags:", job.tags);

      // Normalize job tags to lowercase for comparison
      const jobTags = job.tags.map((tag) => tag.toLowerCase().trim());
      const jobTitleWords = job.title.toLowerCase().split(" ");
      const jobCategory = job.category.toLowerCase();

      console.log("Normalized job tags:", jobTags);

      // Find all seeker profiles
      const profiles = await profileRepository.find();

      console.log(`Found ${profiles.length} total profiles`);

      const matches = [];

      for (const profile of profiles) {
        // Skip if no user or user is admin
        if (!profile.user || profile.user.role !== "seeker") {
          console.log("Skipping profile - no user or not seeker");
          continue;
        }

        console.log(`\nChecking profile for user: ${profile.user.name}`);
        console.log("Profile skills:", profile.skills);

        let matchScore = 0;
        const matchReasons = [];

        // Check skills match (CASE INSENSITIVE)
        if (profile.skills && profile.skills.length > 0) {
          const profileSkills = profile.skills.map((s) =>
            s.toLowerCase().trim(),
          );
          console.log("Normalized profile skills:", profileSkills);

          // Check each job tag against profile skills
          const matchedSkills = [];
          for (const tag of jobTags) {
            for (const skill of profileSkills) {
              // Check if tag is included in skill OR skill is included in tag
              if (skill.includes(tag) || tag.includes(skill)) {
                matchedSkills.push(tag);
                console.log(`Match found: "${tag}" matches skill "${skill}"`);
                break;
              }
            }
          }

          if (matchedSkills.length > 0) {
            // Remove duplicates
            const uniqueMatches = [...new Set(matchedSkills)];
            matchScore += uniqueMatches.length * 20; // 20 points per matching skill
            matchReasons.push(`Skills match: ${uniqueMatches.join(", ")}`);
            console.log(`Skill match score: ${uniqueMatches.length * 20}`);
          }
        }

        // Check preferred roles match
        if (profile.jobPreferences?.preferredRoles?.length > 0) {
          const preferredRoles = profile.jobPreferences.preferredRoles.map(
            (r) => r.toLowerCase().trim(),
          );
          console.log("Preferred roles:", preferredRoles);

          // Check job title against preferred roles
          let roleMatched = false;
          for (const role of preferredRoles) {
            for (const word of jobTitleWords) {
              if (role.includes(word) || word.includes(role)) {
                roleMatched = true;
                console.log(
                  `Role match: "${role}" matches job title word "${word}"`,
                );
                break;
              }
            }
            if (roleMatched) break;
          }

          // Also check job category against preferred roles
          if (!roleMatched) {
            for (const role of preferredRoles) {
              if (role.includes(jobCategory) || jobCategory.includes(role)) {
                roleMatched = true;
                console.log(
                  `Role match: "${role}" matches category "${jobCategory}"`,
                );
                break;
              }
            }
          }

          if (roleMatched) {
            matchScore += 15;
            matchReasons.push("Job matches your preferred roles");
            console.log("Role match score: +15");
          }
        }

        // Check location preference
        if (profile.jobPreferences?.preferredLocations?.length > 0) {
          const preferredLocations =
            profile.jobPreferences.preferredLocations.map((l) =>
              l.toLowerCase().trim(),
            );
          const jobLocation = job.location.toLowerCase();

          console.log("Preferred locations:", preferredLocations);
          console.log("Job location:", jobLocation);

          let locationMatched = false;
          for (const loc of preferredLocations) {
            if (loc.includes("remote") && jobLocation.includes("remote")) {
              locationMatched = true;
              console.log("Location match: remote");
              break;
            }
            if (jobLocation.includes(loc) || loc.includes(jobLocation)) {
              locationMatched = true;
              console.log(`Location match: "${loc}" matches "${jobLocation}"`);
              break;
            }
          }

          if (locationMatched) {
            matchScore += 10;
            matchReasons.push("Location matches your preferences");
            console.log("Location match score: +10");
          }
        }

        console.log(
          `Total match score for ${profile.user.name}: ${matchScore}`,
        );

        // Add to matches if score > 0
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
            matchScore: Math.min(matchScore, 100), // Cap at 100
            matchReasons,
            skills: profile.skills || [],
            preferredRoles: profile.jobPreferences?.preferredRoles || [],
          });
          console.log(
            `Added ${profile.user.name} to matches with score ${matchScore}`,
          );
        }
      }

      // Sort by match score descending
      const sortedMatches = matches.sort((a, b) => b.matchScore - a.matchScore);
      console.log(`\nTotal matches found: ${sortedMatches.length}`);

      return sortedMatches;
    } catch (error) {
      console.error("Error in findMatchingCandidates:", error);
      throw new Error("Error finding matching candidates: " + error.message);
    }
  }

  async createJobWithAlerts(jobData, userId) {
    try {
      console.log("Creating job with alerts:", jobData);

      // Create the job
      const newJob = {
        ...jobData,
        createdBy: userId,
        applicantCount: 0,
        isActive: true,
      };

      const job = await jobRepository.create(newJob);
      console.log("Job created with ID:", job._id);

      // Find matching candidates
      const matches = await this.findMatchingCandidates(job);
      console.log(`Found ${matches.length} matching candidates`);

      // Send email alerts to top matches
      if (matches.length > 0) {
        const topMatches = matches.slice(0, 50);
        console.log(`Sending emails to top ${topMatches.length} matches`);

        // Don't await - send in background
        this.sendJobAlertsToMatches(job, topMatches).catch((err) =>
          console.error("Error sending job alerts:", err),
        );
      }

      // Return job with matches
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
        to: match.user,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
    });

    const results = await Promise.allSettled(emailPromises);
    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value,
    ).length;

    console.log(`Job alerts sent: ${successful}/${matches.length} successful`);
    return { total: matches.length, successful };
  }

  // services/JobService.js
  async getPublicJobs(filters = {}) {
    try {
      console.log("JobService.getPublicJobs received filters:", filters); // Debug log

      const { page = 1, limit = 10, category, location, type } = filters;
      const skip = (page - 1) * limit;

      // Build query - only include active jobs
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

      console.log("Built MongoDB query:", query); // Debug log

      // Get total count for pagination
      const total = await jobRepository.countDocuments(query);
      console.log("Total matching jobs:", total); // Debug log

      // Get jobs with pagination
      const jobs = await jobRepository.findPublic(query, {
        skip,
        limit,
        sort: { createdAt: -1 },
      });

      console.log(`Found ${jobs.length} jobs`); // Debug log

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

      // Don't return sensitive information
      return {
        _id: job._id,
        title: job.title,
        company: job.company,
        category: job.category,
        salary: job.salary,
        location: job.location,
        description: job.description,
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
          { description: { $regex: query, $options: "i" } },
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

      // Find similar jobs based on tags and category
      const similarJobs = await jobRepository.findPublic(
        {
          _id: { $ne: jobId },
          isActive: true,
          $or: [{ category: job.category }, { tags: { $in: job.tags } }],
        },
        {
          limit,
          sort: { createdAt: -1 },
        },
      );

      return similarJobs;
    } catch (error) {
      throw new Error("Error fetching similar jobs: " + error.message);
    }
  }
}
