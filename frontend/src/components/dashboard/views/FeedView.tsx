import React, { useEffect, useState } from 'react';
import { Clock, MapPin, Star, Search } from 'lucide-react';
import { useTasks } from '../../../contexts/TaskContext';

interface User {
  _id: string;
  first_name: string;
  last_name: string;
}

interface Task {
  _id?: string;
  id?: number;
  title: string;
  description: string;
  location: string;
  price: number;
  timePosted?: string;
  createdAt?: string;
  rating?: number;
  category?: string;
  picture?: string;
  imageUrl?: string;
  user_id?: User;
}

const FeedView: React.FC = () => {
  const { feedTasks, getFeed, isLoading } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getFeed();
  }, []);

  const defaultTasks: Task[] = [
    {
      id: 1,
      title: 'Help with furniture assembly',
      description: 'Need someone to help assemble IKEA furniture in my living room. Should take about 2-3 hours.',
      location: 'Downtown, New York',
      price: 45,
      timePosted: '2 hours ago',
      rating: 4.8,
      category: 'Assembly',
      imageUrl: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
    },
    // ... other default tasks
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  const hasFeedTasks = feedTasks && feedTasks.length > 0;
  const displayTasks = hasFeedTasks ? feedTasks : defaultTasks;
  const isDefaultTasks = !hasFeedTasks;

  const filteredTasks = displayTasks.filter((task) =>
    (task.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (task.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Available Tasks</h2>
          <p className="text-base text-gray-600">Find tasks that match your skills</p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => {}}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700"
          >
            <Search className="h-4 w-4 mr-1" />
            Search
          </button>
        </div>
      </div>

      {isDefaultTasks && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 text-sm">
            These are sample tasks. Create your own tasks or check back later for real tasks in your area.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => {
          const isDefault = 'id' in task;
          return (
            <div
              key={task._id || (isDefault ? task.id : undefined)}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="relative">
  <img
  src={
    task.picture
      ? task.picture.startsWith("http")
        ? task.picture // Cloudinary URL
        : `http://localhost:2000${task.picture}` // local uploads
      : (task as any).imageUrl
      ? (task as any).imageUrl
      : "/Image_not_available.avif"
  }
  alt={task.title}
  className="w-full h-28 object-cover"
/>


  <div className="absolute top-2 right-2 bg-white px-1.5 py-0.5 rounded-full flex items-center">
    {isDefault && (task as any).rating ? (
      <>
        <Star className="h-3 w-3 text-yellow-400 fill-current mr-0.5" />
        <span className="text-xs font-medium">{(task as any).rating}</span>
      </>
    ) : (
      <span className="text-xs font-medium text-gray-700">
        {task.category || "Task"}
      </span>
    )}
  </div>
</div>


              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-semibold text-gray-900">{task.title}</h3>
                  {'price' in task && task.price && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">${task.price}</div>
                      <div className="text-xs text-gray-500">per hour</div>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-1">{task.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {task.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {isDefault
                      ? (task as any).timePosted
                      : (task.createdAt && new Date(task.createdAt).toLocaleDateString()) || 'Recently'}
                  </div>
                </div>

                {task.category && (
                  <div className="text-sm text-gray-600 mb-2">
                    Category: {task.category}
                  </div>
                )}

                {task.user_id && (
                  <div className="text-sm text-gray-600 mb-3">
                    Posted by: {task.user_id.first_name} {task.user_id.last_name}
                  </div>
                )}

                {task._id && /^[a-fA-F0-9]{24}$/.test(task._id) && (
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors duration-200"
                    onClick={() => {
                      window.location.href = `/tasks/${task._id}`;
                    }}
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeedView;
