import { authService, userRepository } from "../config/container.js";

export class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return res.status(201).json(result); 
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
      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ user: req.user });
    } catch (err) {
      next(err);
    }
  }
  
  async verifyOTP(req, res, next) {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyOTP(email, otp);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async resendOTP(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.resendOTP(email);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}