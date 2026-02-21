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

    time: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "events",
    timestamps: true,
  },
);

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
