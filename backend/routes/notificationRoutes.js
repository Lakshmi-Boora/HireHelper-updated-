import express from "express";
import { getMyNotifications, markAsRead } from "../controllers/notificationController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/my", protectRoute, getMyNotifications);
router.patch("/:id/read", protectRoute, markAsRead);

export default router;
