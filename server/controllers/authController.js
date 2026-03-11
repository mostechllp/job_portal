import { authService, userRepository } from "../config/container.js";

export class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      return res
        .status(201)
        .json({ message: "User registered successfulyy!", user });
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  async getMe(req, res, next) {
    try {
      // req.user is already populated by the 'protect' middleware
      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ user: req.user });
    } catch (err) {
      next(err);
    }
  }
}
