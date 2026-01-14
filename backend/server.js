import express from 'express';
import dotenv from 'dotenv';
//import mongoose from 'mongoose';
import path from "path";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';
import taskRoutes from './routes/task.route.js';
import uploadPictureRoutes from "./routes/uploadPicture.js";
import requestRoutes from "./routes/requestRoutes.js";
import acceptedTaskRoutes from "./routes/acceptedTaskRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

dotenv.config();
const app = express();
const PORT=ENV_VARS.PORT;
const __dirname = path.resolve();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://internship-infosys-2025-hire-a-helper-b326.onrender.com"
  ],
  credentials: true
}));
app.use("/uploads", express.static(path.join(__dirname, "backend", "uploads")));
console.log("Uploads folder path:", path.join(__dirname, "backend", "uploads"));
app.get("/test-file", (req, res) => {
  res.sendFile(path.join(__dirname, "backend", "uploads", "1759062020242.jpg"));
});

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/uploadPicture", uploadPictureRoutes);
app.use("/api/v1/requests", requestRoutes);
app.use("/api/v1/accepted", acceptedTaskRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/settings", settingsRoutes);

//console.log(ENV_VARS.MONGO_URI);
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
