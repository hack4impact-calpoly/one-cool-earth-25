import mongoose, { Schema } from "mongoose";

export const REGISTRATION_NOTIFICATION_SETTINGS_KEY = "registrationNotificationRecipients";

const notificationSettingsSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    emails: {
      type: [String],
      default: [],
    },
    updatedBy: {
      type: String,
    },
  },
  {
    collection: "notificationSettings",
    timestamps: true,
  },
);

export default mongoose.models.NotificationSettings ||
  mongoose.model("NotificationSettings", notificationSettingsSchema);
