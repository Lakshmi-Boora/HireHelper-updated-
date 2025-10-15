import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { useTasks } from '../../../contexts/TaskContext';

const MyTasksView: React.FC = () => {
  const { myTasks, getMyTasks, isLoading, deleteTask } = useTasks();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState(myTasks);

  useEffect(() => {
    getMyTasks();
  }, []);

  useEffect(() => {
    setFilteredTasks(
      myTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${task.user_id?.first_name} ${task.user_id?.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, myTasks]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✔️';
      case 'in-progress': return '⏳';
      case 'pending': return '🕒';
      default: return '❔';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading your tasks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Tasks</h2>
          <p className="text-base text-gray-600">Track your accepted and completed tasks</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-lg flex-1"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Search
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 aspect-square flex flex-col"
            >
              <div className="w-full flex-1 overflow-hidden">
                <img
  src={
    task.picture
      ? task.picture.startsWith('http')
        ? task.picture // Cloudinary or external URL
        : `http://localhost:2000/${task.picture.replace(/^\/+/, '')}` // ensure leading slash
      : 'https://via.placeholder.com/300'
  }
  alt={task.title}
  className="w-full h-full object-cover"
/>

              </div>

              <div className="p-3 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-1">{task.title}</h3>
                  <p className="text-gray-600 text-sm mb-1">
                    Client: {task.user_id?.first_name} {task.user_id?.last_name}
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {getStatusIcon(task.status)} {task.status.replace('-', ' ')}
                  </span>
                </div>

                <div className="text-gray-600 text-xs mt-2 flex flex-col gap-1">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(task.startTime)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{task.location || 'Location not specified'}</span>
                  </div>
                </div>

                <div className="flex space-x-1 mt-2">
                  <button
                    onClick={() => navigate(`/tasks/edit/${task._id}`)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1 rounded-lg text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this task?')) {
                        await deleteTask(task._id);
                        getMyTasks();
                      }
                    }}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1 rounded-lg text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasksView;
