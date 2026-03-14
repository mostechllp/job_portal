// models/Job.js
import mongoose, { Schema } from "mongoose";

const JobDescriptionSchema = new Schema({
  overview: {
    type: String,
    required: true,
  },
  responsibilities: [
    {
      type: String,
      required: true,
    },
  ],
  requirements: [
    {
      type: String,
      required: true,
    },
  ],
  benefits: [
    {
      type: String,
      default: [],
    },
  ],
});

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
      enum: [
        "Engineering",
        "Design",
        "Marketing",
        "Sales",
        "Data",
        "Product",
        "Customer Support",
        "Other",
      ],
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
      type: JobDescriptionSchema,
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
      enum: [
        "full-time",
        "part-time",
        "contract",
        "internship",
        "temporary",
        "freelance",
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Job = mongoose.model("Job", JobSchema);
