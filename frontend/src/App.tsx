import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import AuthScreen from './components/auth/AuthScreen';
import LandingPage from './components/LandingPage';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './components/dashboard/Dashboard';
import EditTaskView from './components/dashboard/views/EditTaskView';
import MyRequestsView from './components/dashboard/views/MyRequestsView';
import MyTasksView from './components/dashboard/views/MyTasksView';
import AddTaskView from './components/dashboard/views/AddTaskView';
import TaskDetailsView from './components/dashboard/views/TaskDetailsView';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading HireHelper...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Default route: Landing page for unauthenticated, Dashboard for authenticated */}
      <Route path="/" element={user ? <Dashboard /> : <LandingPage />} />

      {/* Auth-related routes */}
      <Route path="/login" element={<AuthScreen />} />
      <Route path="/register" element={<AuthScreen />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Dashboard-related routes */}
      <Route path="/tasks/edit/:id" element={<EditTaskView />} />
      <Route path="/my-requests" element={<MyRequestsView />} />
      <Route
        path="/my-tasks"
        element={<Dashboard key="my-tasks-default" defaultView="my-tasks" />}
      />
      <Route path="/tasks/:id" element={<TaskDetailsView />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <AppContent />
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
