import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import nodemailer from "nodemailer";

export const registerUser=async(req, res)=>{
  try {
    const {first_name, last_name, email_id, password} = req.body;
    if (!first_name || !last_name || !email_id || !password) {
      return res.status(400).json({msg:"All fields are required"});
    }
    const existingUser = await User.findOne({email_id});
    if (existingUser) {
      return res.status(409).json({msg:"User already exists"});
    }
    const hashedPassword=await bcrypt.hash(password, 10);
    const otp=Math.floor(100000 + Math.random() * 900000).toString();
    const newUser=new User({
      first_name,
      last_name,
      email_id,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
      isVerified: false
    });
    await newUser.save();

    const transporter=nodemailer.createTransport({
      service:"gmail",
      auth: {user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS}
    });
    await transporter.sendMail({
      from:process.env.EMAIL_USER,
      to:email_id,
      subject:"HireHelper - Verify your account",
      text:`Your OTP is ${otp}`
    });
    res.status(200).json({ msg: "OTP sent, verify to complete registration" });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

export const verifyOtp=async(req, res)=>{
  try {
    const {email_id, otp}=req.body;
    const user=await User.findOne({email_id});
    if (!user) return res.status(404).json({msg: "User not found"});
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({msg: "Invalid or expired OTP"});
    }
    user.otp=null;
    user.otpExpires=null;
    user.isVerified=true;
    user.canResetPassword=true;
    await user.save();
    generateTokenAndSetCookie(user,res);
    res.status(201).json({msg: "OTP verified, user registered successfully", user});
  } catch (err) {
    res.status(500).json({msg: "Internal server error", error: err.message});
  }
};

export const resendOtp=async(req, res)=>{
  try {
    const {email_id}=req.body;
    const user=await User.findOne({ email_id });
    if (!user) return res.status(404).json({ msg: "User not found" });
    const otp=Math.floor(100000 + Math.random() * 900000).toString();
    user.otp=otp;
    user.otpExpires=Date.now() + 10 * 60 * 1000;
    await user.save();
    const transporter=nodemailer.createTransport({
      service:"gmail",
      auth: {user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS}
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email_id,
      subject: "HireHelper - Resend OTP",
      text: `Your new OTP is ${otp}`
    });
    res.status(200).json({ msg: "New OTP sent" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const loginUser=async(req, res) =>{
  try {
    const {email_id, password} = req.body;
    const user = await User.findOne({email_id});
    if (!user) return res.status(404).json({msg: "User not found"});
    if (!user.isVerified) {
      return res.status(403).json({msg: "Please verify your email before login"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({msg: "Invalid credentials"});
    generateTokenAndSetCookie(user, res);
    res.status(200).json({msg: "Login successful", user});
  } catch (err) {
    res.status(500).json({msg: "Internal server error", error: err.message});
  }
};

export const forgotPassword=async(req, res)=>{
  try {
    const { email_id } = req.body;
    const user = await User.findOne({ email_id });
    if (!user) return res.status(404).json({ msg: "User not found" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email_id,
      subject: "HireHelper - Password Reset OTP",
      text: `Your OTP for resetting password is ${otp}`
    });

    res.status(200).json({ msg: "Password reset OTP sent" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const resetPassword=async(req, res)=>{
  try {
    const { email_id, newPassword } = req.body;
    const user = await User.findOne({ email_id });
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (!user.canResetPassword) {
      return res.status(400).json({ msg: "OTP not verified. Please verify OTP first." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.canResetPassword = false;
    await user.save();
    res.status(200).json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("jwt-hirehelper");
  res.status(200).json({ msg: "Logged out successfully" });
};
