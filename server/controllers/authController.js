import { authService } from "../config/container.js";

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
}
