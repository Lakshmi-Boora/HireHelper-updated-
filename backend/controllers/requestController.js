// Get requests for all tasks owned by current user
export const getRequestsForMyTasks = async (req, res) => {
  try {
    // Find all tasks owned by current user
    const tasks = await Task.find({ user_id: req.user.id });
    const taskIds = tasks.map(task => task._id);
    // Find all requests for those tasks
    const requests = await Request.find({ task_id: { $in: taskIds } })
      .populate("requester_id")
      .populate("task_id");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Cancel/Delete a request
export const cancelRequest = async (req, res) => {
  try {
    const request = await Request.findOneAndDelete({ _id: req.params.id, requester_id: req.user.id });
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });
    res.status(200).json({ success: true, message: "Request cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
import Request from "../models/request.model.js";
import AcceptedTask from "../models/acceptedtask.model.js";
import Notification from "../models/notification.model.js";
import Task from "../models/task.model.js";

export const sendRequest = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    // Check if task already has an accepted request
    const existingAcceptedRequest = await Request.findOne({
      task_id: taskId,
      status: "accepted"
    });

    if (existingAcceptedRequest) {
      return res.status(400).json({ error: "This task already has an accepted request and is no longer available" });
    }

    // Check if user already sent a request for this task
    const existingUserRequest = await Request.findOne({
      task_id: taskId,
      requester_id: req.user.id,
    });

    if (existingUserRequest) {
      return res.status(400).json({ error: "You have already sent a request for this task" });
    }

    const newRequest = new Request({ task_id: taskId, requester_id: req.user.id, description });
    await newRequest.save();

    // Notify task owner
    const task = await Task.findById(taskId);
    const notif = new Notification({
      user_id: task.user_id,
      message: `New request for your task: ${task.title}`,
    });
    await notif.save();

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester_id: req.user.id }).populate("task_id");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRequestsForTask = async (req, res) => {
  try {
    const { taskId } = req.params; // Get the specific task ID from URL params
    console.log('🔄 getRequestsForTask called for specific task:', taskId);
    
    // Verify the task belongs to the current user AND get requests for this specific task only
    const task = await Task.findOne({ _id: taskId, user_id: req.user.id });
    if (!task) {
      return res.status(404).json({ error: "Task not found or not authorized" });
    }

    // Get ALL requests for this SPECIFIC task only
    const requests = await Request.find({ task_id: taskId })
      .populate("requester_id", "first_name last_name email")
      .populate("task_id", "title location price");
    
    console.log('✅ Found', requests.length, 'requests for specific task:', task.title);
    res.json(requests);
  } catch (err) {
    console.error('❌ Error in getRequestsForTask:', err);
    res.status(500).json({ error: err.message });
  }
};

export const acceptRequest = async (req, res) => {
  // Debug: log raw findById result before populating
  const rawRequest = await Request.findById(req.params.id);
  console.log('Raw findById result:', rawRequest);
  const request = await Request.findById(req.params.id).populate("task_id");
  console.log('Populated request:', request);
  console.log('Accept request called with ID:', req.params.id);
  try {
    const request = await Request.findById(req.params.id).populate("task_id");
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (!request.task_id) {
      return res.status(404).json({ success: false, message: "Task not found for this request" });
    }

    const task = request.task_id;
    if (task.user_id.toString() !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });
    if (request.status !== "pending") return res.status(400).json({ success: false, message: "Request not pending" });
    if (task.status === "in-progress") {
      return res.status(400).json({ success: false, message: "Task already assigned to someone" });
    }

    request.status = "accepted";
    await request.save();
    
    task.status = "in-progress";
    task.assigned_to = request.requester_id;
    await task.save();

    // Reject all other pending requests for this task
    await Request.updateMany(
      { 
        task_id: task._id, 
        _id: { $ne: request._id },
        status: "pending" 
      },
      { status: "rejected" }
    );

    const accepted = await AcceptedTask.create({
      task_id: task._id,
      user_id: request.requester_id
    });

    await Notification.create({
      user_id: request.requester_id,
      message: `Your request for "${task.title}" was accepted.`
    });
     // Notify other rejected applicants
    const rejectedRequests = await Request.find({
      task_id: task._id,
      _id: { $ne: request._id },
      status: "rejected"
    }).populate("requester_id");

    for (const rejectedReq of rejectedRequests) {
      await Notification.create({
        user_id: rejectedReq.requester_id._id,
        message: `The task "${task.title}" has been assigned to someone else.`
      });
    }

    return res.status(200).json({ success: true, accepted });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("task_id");
    request.status = "rejected";
    await request.save();

    const notif = new Notification({
      user_id: request.requester_id,
      message: `Your request for task ${request.task_id.title} was rejected.`,
    });
    await notif.save();

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
