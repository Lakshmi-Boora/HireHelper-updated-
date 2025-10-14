import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, location, picture, startTime, endTime, category} = req.body;
    const task = await Task.create({
      title,
      description,
      location,
      picture,
      category,
      startTime,
      endTime,
      user_id: req.user._id,
    });
    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user_id: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching user's tasks:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const tasks = await Task.find({ user_id: { $ne: req.user._id } })
      .populate("user_id", "first_name last_name email_id")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching feed tasks:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("user_id", "first_name last_name email_id");
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, task });
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ success: false, message: "Task not found or not authorized" });
    res.status(200).json({ success: true, task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: "Task not found or not authorized" });
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
