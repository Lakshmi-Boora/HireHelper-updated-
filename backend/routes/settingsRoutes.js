import express from "express";
import multer from "multer";
import path from "path";
import {
  fetchProfile,
  updateProfile,
  updatePassword,
  updateProfilePicture,
} from "../controllers/settingsController.js";

import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Absolute path to backend/uploads
const uploadDir = path.join(process.cwd(), "backend", "uploads");

// Multer setup for profile picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});
const upload = multer({ storage });

// Routes
router.get("/profile", protectRoute, fetchProfile);
router.put("/profile", protectRoute, updateProfile);
router.put("/password", protectRoute, updatePassword);
router.put("/profile-picture", protectRoute, upload.single("profile_picture"), updateProfilePicture);

export default router;
