import mongoose, { Schema, Types } from "mongoose";
import "@/database/models/Event";

const partyMemberSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    waiverSigned: {
      type: Boolean,
      required: true,
      default: false,
    },
    registrant: {
      type: Boolean,
      required: true,
      default: false,
    },
    attending: {
      type: Boolean,
      required: true,
      default: true,
    },
    attended: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { _id: false },
);

const registrationSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Event",
      index: true,
    },
    partyMembers: {
      type: [partyMemberSchema],
      required: true,
      validate: {
        validator: (arr: unknown[]) => Array.isArray(arr) && arr.length > 0,
        message: "At least one party member is required",
      },
    },
    affiliatedOrganization: {
      type: String,
      required: false,
      ref: "Organization",
    },
    additionalComments: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    collection: "registrations",
    timestamps: true,
  },
);

export default mongoose.models.Registration || mongoose.model("Registration", registrationSchema);
