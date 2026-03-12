import { AuthController } from "../controllers/authController.js";
import { ProfileController } from "../controllers/profileController.js";
import { ProfileRepository } from "../repositories/ProfileRepository.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { AuthService } from "../services/AuthService.js";
import { ProfileService } from "../services/ProfileService.js";

const userRepository = new UserRepository();
const authService = new AuthService();
const authController = new AuthController();

const profileRepository = new ProfileRepository();
const profileService = new ProfileService();
const profileController = new ProfileController();

export {
    userRepository,
    authService,
    authController,
    profileRepository,
    profileService,
    profileController
}