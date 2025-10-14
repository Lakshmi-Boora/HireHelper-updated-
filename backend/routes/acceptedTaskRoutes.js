import express from "express";
import { getMyAcceptedTasks, completeAcceptedTask } from "../controllers/acceptedTaskController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/my", protectRoute, getMyAcceptedTasks);
router.patch("/:id/complete", protectRoute, completeAcceptedTask);

export default router;
