import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ override: true });
console.log("Cloudinary configuration re-initialized...");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export default cloudinary;
