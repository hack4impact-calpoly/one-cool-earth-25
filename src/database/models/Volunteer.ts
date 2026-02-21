import mongoose, { Schema } from "mongoose";

const volunteer = new Schema(
  {
    kind: {
      type: String,
      required: true,
      enum: ["USER", "GUEST"],
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
    },

    dateOfBirth: {
      type: Date,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      select: false,
    },
  },
  {
    collection: "volunteers",
    timestamps: true,
  },
);

export default mongoose.models.Volunteer || mongoose.model("Volunteer", volunteer);
