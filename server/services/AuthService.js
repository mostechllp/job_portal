import bcrypt from "bcryptjs";
import { userRepository } from "../config/container.js";
import jwt from "jsonwebtoken";

export class AuthService {
  async register(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await userRepository.create({
      ...userData,
      password: hashedPassword,
    });
  }
  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found!");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({message: "Password not match"})
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    };
  }
}
