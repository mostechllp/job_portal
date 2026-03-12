import { AuthController } from "../controllers/authController.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { AuthService } from "../services/AuthService.js";

const userRepository = new UserRepository();
const authService = new AuthService();
const authController = new AuthController();

export {
    userRepository,
    authService,
    authController
}