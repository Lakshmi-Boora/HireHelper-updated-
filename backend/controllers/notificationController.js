import Notification from "../models/notification.model.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    notif.isRead = true;
    await notif.save();
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
