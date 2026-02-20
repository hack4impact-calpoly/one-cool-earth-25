import mongoose, { Schema } from "mongoose";

const organization = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    collection: "organizations",
    timestamps: true,
  },
);

export default mongoose.models.Organization || mongoose.model("Organization", organization);
