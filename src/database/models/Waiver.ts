import mongoose from "mongoose";

const waiverSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true },
    email: { type: String, required: true },
    school: { type: String },
    schoolNormalized: { type: String, required: true },
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

waiverSchema.index({ clerkId: 1, schoolNormalized: 1 }, { unique: true });

export default mongoose.models.Waiver || mongoose.model("Waiver", waiverSchema);
