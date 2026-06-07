import mongoose from "mongoose";

const waiverSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    school: { type: String },
    schoolNormalized: {
      type: String,
      required: true,
      default: "general",
    },
    status: {
      type: String,
      enum: ["complete", "incomplete"],
      required: true,
      default: "incomplete",
    },
    formLanguage: { type: String },
    formId: { type: String },
    waiverSubmissionId: { type: String },
    waiverSignedAt: { type: Date },
    waiverLastCheckedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    collection: "waivers",
    timestamps: true,
  },
);

waiverSchema.index({ clerkId: 1 }, { unique: true, sparse: true });
waiverSchema.index({ email: 1 }, { unique: true, sparse: true });

export default mongoose.models.Waiver || mongoose.model("Waiver", waiverSchema);
