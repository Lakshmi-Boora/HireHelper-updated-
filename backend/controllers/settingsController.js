import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Fetch logged-in user's profile
export const fetchProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in fetchProfile:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update profile details (name, phone, bio)
export const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { first_name, last_name, phone_number, bio },
      { new: true, runValidators: true }
    ).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in updateProfile:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log("Error in updatePassword:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update profile picture
export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // Delete old picture if exists
    if (user.profile_picture) {
      const oldPath = path.join(process.cwd(), "backend", "uploads", path.basename(user.profile_picture));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.profile_picture = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in updateProfilePicture:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
