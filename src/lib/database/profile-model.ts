import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface for the Profile document
export interface IProfile extends Document {
  username: string;
  email: string;
  password: string; // Hashed password — never store raw passwords!
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the Profile/User
const ProfileSchema: Schema<IProfile> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // By default, don't return password in queries
    },
    avatarUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Avoid model overwrite errors in Next.js using mongoose.models
const Profile: Model<IProfile> =
  mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);

export default Profile;
