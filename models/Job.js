import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxlength: 100,
    },
    company: {
      type: String,
      required: [true, "Please provide company"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending", "accepted"],
      default: "pending",
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship", "contract"],
      default: "full-time",
    },
    location: {
      type: String,
      maxlength: 100,
      default: "N/A",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);
export default Job;
