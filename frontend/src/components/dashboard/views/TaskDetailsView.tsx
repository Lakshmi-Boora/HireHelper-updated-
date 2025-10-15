import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, User, Calendar, Tag, ArrowLeft } from 'lucide-react';
import { useTasks } from '../../../contexts/TaskContext';
import SendRequestForm from './SendRequestForm'; // ADD THIS IMPORT

const TaskDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, isLoading } = useTasks(); // REMOVED sendRequest from useTasks
  const [task, setTask] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false); // ADD THIS STATE
  const [requestSent, setRequestSent] = useState(false); // ADD THIS STATE

  useEffect(() => {
    const fetchTask = async () => {
      if (id && /^[a-fA-F0-9]{24}$/.test(id)) {
        setLocalLoading(true);
        try {
          const taskData = await getTaskById(id);
          setTask(taskData);
        } catch (error) {
          setTask(null);
          console.error('Failed to fetch task:', error);
        } finally {
          setLocalLoading(false);
        }
      } else {
        setTask(null);
      }
    };
    fetchTask();
  }, [id]);

  // ADD THIS FUNCTION
  const handleSendRequestSuccess = () => {
    setRequestSent(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (localLoading) return <div className="flex justify-center items-center h-64 text-gray-600 text-lg">Loading task details...</div>;
  if (!task) return <div className="flex justify-center items-center h-64 text-gray-600 text-lg">Task not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-6">
        {/* Send Request Button - REPLACED THIS SECTION */}
        <div>
          {!requestSent ? (
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              onClick={() => setShowRequestForm(true)}
            >
              Send Request
            </button>
          ) : (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 font-medium">Request sent successfully!</p>
            </div>
          )}
        </div>

        {/* Task Title */}
        <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{task.description || 'No description provided'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Tag className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{task.category}</p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{task.location}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Start Time</p>
                  <p className="font-medium">{formatDate(task.startTime)}</p>
                </div>
              </div>

              {task.endTime && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">End Time</p>
                    <p className="font-medium">{formatDate(task.endTime)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                {task.status.replace('-', ' ')}
              </span>
            </div>

            {task.user_id && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Posted By</h3>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">{task.user_id.first_name} {task.user_id.last_name}</p>
                    <p className="text-sm text-gray-500">{task.user_id.email_id}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Timeline</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <p>Created: {formatDate(task.createdAt)}</p>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <p>Last updated: {formatDate(task.updatedAt)}</p>
                </div>
              </div>
            </div>

            {task.picture && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Task Image</h3>
                <img
  src={
    task.picture
      ? task.picture.startsWith('http')
        ? task.picture // Cloudinary URL
        : `http://localhost:2000${task.picture}` // local uploads
      : 'https://via.placeholder.com/400x200?text=No+Image'
  }
  alt={task.title}
  className="w-full h-48 object-cover rounded-lg shadow"
/>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD THIS COMPONENT AT THE BOTTOM */}
      <SendRequestForm
        taskId={task._id}
        taskTitle={task.title}
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        onSuccess={handleSendRequestSuccess}
      />
    </div>
  );
};

export default TaskDetailsView;