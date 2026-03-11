import bcrypt from "bcryptjs";
import { userRepository } from "../config/container.js";
import jwt from "jsonwebtoken";
import {
  passwordResetSuccessTemplate,
  passwordResetTemplate,
  verificationTemplate,
} from "../templates/emailTemplate.js";
import { sendEmail } from "./EmailService.js";

export class AuthService {
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error("User already exists");
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = Date.now() + 10 * 60 * 1000;
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await userRepository.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || "seeker",
        otp,
        otpExpires,
      });

      const template = verificationTemplate(user, otp);

      await sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      return {
        message: "OTP sent to email",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async verifyOTP(email, otp) {
    const user = await userRepository.findByEmail(email);
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      throw new Error("Invalid or expired OTP");
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate token after verification
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return {
      message: "Account verified successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async resendOTP(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");
    if (user.isVerified) throw new Error("User already verified");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    try {
      const template = verificationTemplate(user, otp);
      await sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
    } catch (emailError) {
      console.error("Resend OTP email failed:", emailError.message);
    }

    return {
      message: "New OTP sent",
      ...(process.env.NODE_ENV === "development" && { dev_otp: otp }),
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    if (!user.isVerified) {
      const error = new Error("Please verify your email first");
      error.statusCode = 403; // Forbidden
      throw error;
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
        email: user.email,
        role: user.role,
      },
    };
  }
  async forgotPassword(email) {
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not for security
        return {
          message:
            "If a user with that email exists, a password reset OTP has been sent.",
        };
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Save OTP to user
      user.resetPasswordOTP = otp;
      user.resetPasswordExpires = otpExpires;
      await user.save();

      console.log(`Password reset OTP for ${email}: ${otp}`);

      const template = passwordResetTemplate(user, otp);

      await sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      return {
        message:
          "If a user with that email exists, a password reset OTP has been sent.",
        ...(process.env.NODE_ENV === "development" && { dev_otp: otp }),
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }

  async verifyResetOTP(email, otp) {
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new Error("Invalid or expired OTP");
      }

      // Check if OTP exists and is valid
      if (
        !user.resetPasswordOTP ||
        user.resetPasswordOTP !== otp ||
        user.resetPasswordExpires < Date.now()
      ) {
        throw new Error("Invalid or expired OTP");
      }

      return {
        message: "OTP verified successfully",
        valid: true,
      };
    } catch (error) {
      console.error("Verify reset OTP error:", error);
      throw error;
    }
  }

  async resetPassword(email, otp, newPassword) {
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new Error("Invalid or expired OTP");
      }

      // Verify OTP again
      if (
        !user.resetPasswordOTP ||
        user.resetPasswordOTP !== otp ||
        user.resetPasswordExpires < Date.now()
      ) {
        throw new Error("Invalid or expired OTP");
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password and clear reset fields
      user.password = hashedPassword;
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      // Send confirmation email
      const template = passwordResetSuccessTemplate(user);

      await sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      return {
        message: "Password reset successfully",
        success: true,
      };
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }

  async adminLogin(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      const error = new Error("Invalid admin credentials");
      error.statusCode = 401;
      throw error;
    }

    // Check if user has admin role
    if (user.role !== "admin") {
      const error = new Error("Access denied. Admin privileges required.");
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid admin credentials");
      error.statusCode = 401;
      throw error;
    }

    // Generate token with admin flag
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        isAdmin: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      isAdmin: true,
    };
  }
}
