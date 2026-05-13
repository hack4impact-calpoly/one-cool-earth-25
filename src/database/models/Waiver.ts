import mongoose from "mongoose";

const waiverSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    status: { type: String, enum: ["complete", "incomplete"], required: true, default: "incomplete" },
    waiverSubmissionId: { type: String, required: false },
    waiverSignedAt: { type: Date, required: false },
    waiverLastCheckedAt: { type: Date, required: true, default: Date.now },
  },
  {
    collection: "waivers",
    timestamps: true,
  },
);

export default mongoose.models.Waiver || mongoose.model("Waiver", waiverSchema);
