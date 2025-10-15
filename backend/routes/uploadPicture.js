import express from "express";
import multer from "multer";
import uploadImageToCloudinary from "../utils/uploadImage.js";

const router = express.Router();

// Temporary storage for uploaded files before sending to Cloudinary
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("picture"), async (req, res) => {
  try {
    const localFilePath = req.file.path;
    const imageUrl = await uploadImageToCloudinary(localFilePath);

    if (!imageUrl) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

export default router;
