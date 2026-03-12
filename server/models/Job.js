// models/Job.js
import mongoose, { Schema } from "mongoose";

const JobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Engineering", "Design", "Marketing", "Sales", "Data", "Other"],
    },
    salary: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    applicantCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workType: {
      type: String,
      enum: ["remote", "hybrid", "on-site", "any"],
      default: "any",
    },
  },
  {
    timestamps: true,
  },
);

export const Job = mongoose.model("Job", JobSchema);
