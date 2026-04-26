import cloudinary from "./config/cloudinary.js";
import fs from "fs";

const testCloudinary = async () => {
    try {
        fs.writeFileSync("test.txt", "hello world");
        const res = await cloudinary.uploader.upload("test.txt", { resource_type: "raw", folder: "hire-a-helper/uploads" });
        console.log("Success:", res.secure_url);
        fs.unlinkSync("test.txt");
    } catch (e) {
        console.error("Cloudinary error!!", e);
    }
}
testCloudinary();
