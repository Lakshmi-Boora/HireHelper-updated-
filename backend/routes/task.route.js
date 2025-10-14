import express from "express";
import {createTask,getMyTasks,getFeed,getTaskById,updateTask,deleteTask,} from "../controllers/task.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

router.post("/add", protectRoute, createTask); // static route for adding a task
router.post("/", protectRoute, createTask); // keep this if you use "/" for creation
router.get("/my-tasks", protectRoute, getMyTasks);
router.get("/feed", protectRoute, getFeed);
router.get("/:id", protectRoute, getTaskById);
router.put("/:id", protectRoute, updateTask);
router.delete("/:id", protectRoute, deleteTask);
export default router;
