import { AuthController } from "../controllers/authController.js";
import { JobController } from "../controllers/jobController.js";
import { ProfileController } from "../controllers/profileController.js";
import { PublicJobController } from "../controllers/publicJobController.js";
import { JobRepository } from "../repositories/JobRepository.js";
import { ProfileRepository } from "../repositories/ProfileRepository.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { AuthService } from "../services/AuthService.js";
import { JobService } from "../services/JobService.js";
import { ProfileService } from "../services/ProfileService.js";

const userRepository = new UserRepository();
const authService = new AuthService();
const authController = new AuthController();

const profileRepository = new ProfileRepository();
const profileService = new ProfileService();
const profileController = new ProfileController();

const jobRepository = new JobRepository();
const jobService = new JobService();
const jobController = new JobController();
const publicJobController = new PublicJobController()

export {
    userRepository,
    authService,
    authController,
    profileRepository,
    profileService,
    profileController,
    jobRepository,
    jobService,
    jobController,
    publicJobController
}