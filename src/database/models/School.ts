import mongoose, { Schema } from "mongoose";

const school = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    collection: "schools",
    timestamps: true,
  },
);

export default mongoose.models.School || mongoose.model("School", school);
