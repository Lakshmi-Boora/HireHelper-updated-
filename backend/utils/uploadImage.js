import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const uploadImageToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "hire-a-helper/uploads",
    });

    fs.unlinkSync(localFilePath); // remove local temp file
    return result.secure_url; // Cloudinary image URL
  } catch (error) {
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export default uploadImageToCloudinary;
