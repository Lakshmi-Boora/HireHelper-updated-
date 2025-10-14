import React from 'react';
import { 
  Home, 
  CheckSquare, 
  MessageSquare, 
  Send, 
  Plus, 
  Settings, 
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onToggle }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'my-tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'requests', label: 'Requests', icon: MessageSquare },
    { id: 'my-requests', label: 'My Requests', icon: Send },
    { id: 'add-task', label: 'Add Task', icon: Plus },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out
        w-56 md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <img
                src="/WhatsApp Image 2025-08-29 at 13.54.47_e67163a7.jpg"
                alt="HireHelper Logo"
                className="w-7 h-7 rounded-lg"
              />
              <h1 className="text-base font-bold text-gray-900">HireHelper</h1>
            </div>
            <button
              onClick={onToggle}
              className="md:hidden text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* User Profile */}
<div className="p-4 border-b border-gray-100">
  <div className="flex items-center space-x-2">
    <img
  src={user?.avatar || "/default-pfp.jpg"} // ✅ fallback
  alt={user?.name}
  className="w-9 h-9 rounded-full object-cover"
/>

    <div className="min-w-0"> {/* ensures child text respects parent width */}
      <h3 className="text-sm font-medium text-gray-900 truncate">
        {user?.name}
      </h3>
      <p
        className="text-xs text-gray-500 truncate max-w-[140px]" 
        title={user?.email}  // shows full email on hover
      >
        {user?.email}
      </p>
    </div>
  </div>
</div>


          {/* Navigation */}
          <nav className="flex-1 p-3">
            <ul className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onViewChange(item.id);
                        if (window.innerWidth < 768) onToggle();
                      }}
                      className={`
                        w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-left transition-all duration-200
                        ${currentView === item.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
