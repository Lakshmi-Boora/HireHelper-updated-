import express from "express";
import { sendRequest, getMyRequests, getRequestsForTask, acceptRequest, rejectRequest, cancelRequest, getRequestsForMyTasks } from "../controllers/requestController.js";

import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/:taskId", protectRoute, sendRequest);                   // Send request
router.get("/my", protectRoute, getMyRequests);                       // My requests
router.get("/for-my-tasks", protectRoute, getRequestsForMyTasks);     // Requests for tasks owned by current user
router.get("/for-task/:taskId", protectRoute, getRequestsForTask);    // Requests for task
router.patch("/:id/accept", protectRoute, acceptRequest);             // Accept
router.patch("/:id/reject", protectRoute, rejectRequest);             // Reject
	router.delete("/:id", protectRoute, cancelRequest);                  // Cancel/Delete request

export default router;
