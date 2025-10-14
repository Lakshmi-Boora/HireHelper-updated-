import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { Bell, CheckCircle, Trash2, Clock } from 'lucide-react';

interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  user_id: string;
}

const NotificationView: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter notifications based on active filter
  useEffect(() => {
    if (activeFilter === 'unread') {
      setFilteredNotifications(notifications.filter(n => !n.isRead));
    } else {
      setFilteredNotifications(notifications);
    }
  }, [notifications, activeFilter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications/my');
      setNotifications(response.data);
    } catch (err) {
      console.error('Notification error:', err);
      alert('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications => 
        notifications.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error('Mark as read error:', err);
      alert('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(
        unreadNotifications.map(n => api.patch(`/notifications/${n._id}/read`))
      );
      setNotifications(notifications => 
        notifications.map(n => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error('Mark all as read error:', err);
      alert('Failed to mark all as read');
    }
  };

  const getNotificationIcon = (message: string) => {
    if (message.includes('accepted')) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (message.includes('rejected')) return <Trash2 className="h-5 w-5 text-red-500" />;
    if (message.includes('request')) return <Bell className="h-5 w-5 text-blue-500" />;
    return <Bell className="h-5 w-5 text-gray-500" />;
  };

  const getNotificationColor = (isRead: boolean, message: string) => {
    if (isRead) return 'bg-gray-50 border-gray-200';
    
    if (message.includes('accepted')) return 'bg-green-50 border-green-200';
    if (message.includes('rejected')) return 'bg-red-50 border-red-200';
    if (message.includes('request')) return 'bg-blue-50 border-blue-200';
    
    return 'bg-white border-gray-200';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Clean Header - Only one title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-base font-bold text-gray-600 mt-1">Stay updated with your task activities</p>
        </div>
        
        <div className="flex gap-3">
          {/* Filter Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeFilter === 'all' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeFilter === 'unread' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Unread
            </button>
          </div>

          {/* Mark All as Read */}
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="text-lg text-gray-600">Loading notifications...</div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-lg font-semibold text-gray-900 mb-2">
            {activeFilter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </div>
          <div className="text-gray-500">
            {activeFilter === 'unread' 
              ? "You're all caught up!" 
              : "You'll see notifications here when you receive task requests or updates."}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${getNotificationColor(
                notification.isRead,
                notification.message
              )}`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.message)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${notification.isRead ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(notification.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {!notification.isRead && (
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="flex-shrink-0 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationView;