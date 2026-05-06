import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  dob: { type: String },
  // https://github.com/hack4impact-calpoly/one-cool-earth-25/issues/87
  phoneNumber: { type: String },
  role: {
    type: String,
    enum: ["admin", "volunteer"],
    default: "volunteer",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
