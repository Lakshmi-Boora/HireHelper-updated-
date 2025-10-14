import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Absolute path to backend/uploads
const uploadDir = path.join(path.resolve(), "backend", "uploads");

// Ensure folder exists
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/", upload.single("picture"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  res.json({
    message: "File uploaded successfully",
    filePath: `/uploads/${req.file.filename}`, // this will be served by express.static
  });
});

export default router;
