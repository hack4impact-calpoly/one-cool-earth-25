import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    location: {
      type: String,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    imageUrl: {
      type: String,
    },

    registeredCount: {
      type: Number,
      required: true,
    },

    attendanceCount: {
      type: Number,
    },
  },
  {
    collection: "events",
    timestamps: true,
  },
);

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
