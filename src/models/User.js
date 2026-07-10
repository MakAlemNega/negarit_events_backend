import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true }, // stores the bcrypt hash, never the raw password
    role: {
      type: String,
      enum: ["customer", "organizer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true },
); // adds createdAt/updatedAt automatically

export default mongoose.model("User", userSchema);
