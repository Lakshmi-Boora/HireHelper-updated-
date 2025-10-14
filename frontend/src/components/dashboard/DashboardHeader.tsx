import React, { useState, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import api from '../../api/axios';

interface DashboardHeaderProps {
  onMenuToggle: () => void;
  currentView: string;
  onNotificationClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onMenuToggle, 
  currentView, 
  onNotificationClick 
}) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/my');
      const unread = response.data.filter((n: any) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to fetch notification count:', err);
    }
  };

  const getViewTitle = (view: string) => {
    const titles: { [key: string]: string } = {
      'feed': 'Task Feed',
      'my-tasks': 'My Tasks',
      'requests': 'Task Requests',
      'my-requests': 'My Requests',
      'add-task': 'Add New Task',
      'settings': 'Settings',
      'notifications': 'Notifications'
    };
    return titles[view] || 'Dashboard';
  };

  const handleNotificationClick = () => {
    console.log('Notification button clicked'); // Add this for debugging
    onNotificationClick();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuToggle}
            className="md:hidden text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{getViewTitle(currentView)}</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleNotificationClick}
            className="relative p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;