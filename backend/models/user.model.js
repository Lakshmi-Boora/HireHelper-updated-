import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email_id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: String },
  profile_picture: { type: String },
  bio: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  canResetPassword: { type: Boolean, default: false }
},
{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
