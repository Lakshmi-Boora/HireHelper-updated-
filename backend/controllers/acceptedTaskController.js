import AcceptedTask from "../models/acceptedtask.model.js";

export const getMyAcceptedTasks = async (req, res) => {
  try {
    const tasks = await AcceptedTask.find({ user_id: req.user.id }).populate("task_id");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const completeAcceptedTask = async (req, res) => {
  try {
    const task = await AcceptedTask.findById(req.params.id);
    task.status = "completed";
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
