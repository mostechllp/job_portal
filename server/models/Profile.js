import mongoose, { Schema } from "mongoose";

const ProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Personal Information
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    professionalSummary: {
      type: String,
      maxlength: 1000,
      default: "",
    },
    // Professional Information
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: [
      {
        title: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        current: {
          type: Boolean,
          default: false,
        },
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        location: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    // Resume
    resume: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
      fileName: { type: String, default: null },
      fileSize: { type: Number, default: null },
      fileType: { type: String, default: null }, // MIME type
      fileExtension: { type: String, default: null }, // pdf, docx, etc.
      uploadedAt: { type: Date, default: null },
    },
    // Job Preferences
    jobPreferences: {
      preferredRoles: [String],
      expectedSalary: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        currency: { type: String, default: "INR" },
      },
      workType: {
        type: String,
        enum: [
          "full-time",
          "part-time",
          "contract",
          "internship",
          "temporary",
          "freelance",
        ],
        default: "full-time",
      },
      preferredLocations: [String],
      noticePeriod: {
        type: String,
        enum: ["immediate", "2 weeks", "1 month", "3 months"],
        default: null,
      },
    },
    // Social Links
    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    // Additional Info
    languages: [
      {
        name: String,
        proficiency: {
          type: String,
          enum: ["basic", "conversational", "professional", "native"],
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Ensure virtuals are included in JSON output
ProfileSchema.set("toJSON", { virtuals: true });
ProfileSchema.set("toObject", { virtuals: true });

export const Profile = mongoose.model("Profile", ProfileSchema);
