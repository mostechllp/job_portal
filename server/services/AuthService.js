import bcrypt from "bcryptjs";
import { userRepository } from "../config/container.js";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

// Don't initialize SendGrid at module level
let sendGridInitialized = false;

const initializeSendGrid = () => {
  if (!sendGridInitialized) {
    if (!process.env.SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY is not set in environment variables");
      return false;
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("SendGrid initialized successfully");
    sendGridInitialized = true;
    return true;
  }
  return true;
};

const emailTemplate = (user, otp) => {
  const msg = {
    to: user.email,
    from: process.env.FROM_EMAIL || "fidha@mostech.ae",
    subject: "Verify your CareerHub Account",
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #4f46e5; margin: 0;">CareerHub</h1>
              </div>
              
              <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5; text-align: center;">
                Thank you for signing up, <strong>${user.name}</strong>! Please use the following OTP to verify your email address:
              </p>
              
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px; margin: 30px 0;">
                <div style="font-size: 48px; font-weight: bold; letter-spacing: 10px; color: black; font-family: monospace;">
                  ${otp}
                </div>
              </div>
              
              <p style="color: #666; font-size: 14px; text-align: center;">
                This OTP will expire in <strong>10 minutes</strong>.
              </p>
              
              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 40px;">
                If you didn't create an account with CareerHub, please ignore this email.
              </p>
            </div>
          `,
    text: `Hello ${user.name},\n\nYour CareerHub verification OTP is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't create an account with CareerHub, please ignore this email.`,
  };
  return msg;
};

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

      // Initialize SendGrid here - AFTER env vars are loaded
      const isInitialized = initializeSendGrid();

      // Try to send email via SendGrid
      try {
        if (!isInitialized || !process.env.SENDGRID_API_KEY) {
          throw new Error("SendGrid not properly configured");
        }

        const msg = emailTemplate(user, otp)

        const response = await sgMail.send(msg);
      } catch (emailError) {
        console.error("SendGrid email failed:", {
          message: emailError.message,
          code: emailError.code,
          response: emailError.response?.body,
        });

        throw new Error("Failed to send verification email");
      }

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
      const msg = emailTemplate(user, otp)

      await sgMail.send(msg);
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
      throw new Error("User not found!");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Password does not match");
    }

    if (!user.isVerified) {
      throw new Error("Please verify your email first");
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
}
