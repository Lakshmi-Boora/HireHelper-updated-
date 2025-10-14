import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import FeedView from './views/FeedView';
import MyTasksView from './views/MyTasksView';
import RequestsView from './views/RequestsView';
import MyRequestsView from './views/MyRequestsView';
import AddTaskView from './views/AddTaskView';
import SettingsView from './views/SettingsView';
import NotificationView from './views/NotificationView';

const Dashboard: React.FC<{ defaultView?: string }> = ({ defaultView }) => {
  const [currentView, setCurrentView] = useState(defaultView || 'feed');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'feed':
        return <FeedView />;
      case 'my-tasks':
        return <MyTasksView />;
      case 'requests':
        return <RequestsView />;
      case 'my-requests':
        return <MyRequestsView />;
      case 'add-task':
        return <AddTaskView />;
      case 'settings':
        return <SettingsView />;
      case 'notifications':
        return <NotificationView />;
      default:
        return <FeedView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          currentView={currentView}
          onNotificationClick={() => setCurrentView('notifications')}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;