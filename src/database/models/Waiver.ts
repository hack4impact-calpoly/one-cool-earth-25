// models/Waiver.ts
import mongoose from "mongoose";

const WaiverSchema = new mongoose.Schema(
  {
    clerkId: String,
    email: String,
    status: String,
    waiverSubmissionId: String,
    waiverLastCheckedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.models.Waiver || mongoose.model("Waiver", WaiverSchema, "waivers");
