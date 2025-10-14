import dotenv from "dotenv";
dotenv.config();

export const ENV_VARS={
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL: process.env.EMAIL,
  EMAIL_PASS: process.env.EMAIL_PASS,
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 2000
};
