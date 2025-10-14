import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { Clock, MapPin, MessageCircle, Trash2 } from 'lucide-react';

const MyRequestsView: React.FC = () => {
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/requests/my')
      .then((res: { data: any }) => {
        if (Array.isArray(res.data)) {
          setMyRequests(res.data);
          setFilteredRequests(res.data);
        } else {
          setMyRequests([]);
          setFilteredRequests([]);
        }
      })
      .catch((err: unknown) => {
        console.error('Requests error:', err);
        setMyRequests([]);
        setFilteredRequests([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter requests based on search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredRequests(myRequests);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFilteredRequests(
      myRequests.filter(r =>
        (r.task_id?.title || '').toLowerCase().includes(term) ||
        (r.task_id?.location || '').toLowerCase().includes(term) ||
        (r.description || '').toLowerCase().includes(term)
      )
    );
  }, [searchTerm, myRequests]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!window.confirm('Are you sure you want to withdraw this request?')) return;
    try {
      await api.delete(`/requests/${requestId}`);
      setMyRequests(prev => prev.filter(r => r._id !== requestId));
      setFilteredRequests(prev => prev.filter(r => r._id !== requestId));
      alert('Request withdrawn successfully!');
    } catch (err) {
      alert('Failed to withdraw request.');
      console.error('Delete request error:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Search is handled by useEffect
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Requests</h2>
          <p className="text-base text-gray-600">Tasks I have applied to</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by task title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            className="px-3 py-2 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => {}} // Search is handled by useEffect
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="text-lg text-gray-600">Loading your requests...</div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-lg font-semibold mb-2">
            {myRequests.length === 0 
              ? "You haven't applied to any tasks yet" 
              : "No requests match your search"}
          </div>
          <div className="text-gray-500">
            {myRequests.length === 0 
              ? "Browse available tasks and send requests to get started." 
              : "Try different search terms"}
          </div>
        </div>
      ) : (
        filteredRequests.map((request) => {
          const task = request.task_id || {};
          return (
            <div key={request._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">
                      {task.title || 'Task Not Available'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  
                  {/* My Application Message */}
                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <div className="flex items-start">
                      <MessageCircle className="h-4 w-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-1">Your Application Message:</p>
                        <p className="text-sm text-gray-700">{request.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Task Details */}
                  {task.title && (
                    <>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        {task.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {task.location}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Applied: {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 items-center">
                {request.status === 'pending' && (
                  <button 
                    className="flex items-center px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors"
                    onClick={() => handleDeleteRequest(request._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> 
                    Withdraw Request
                  </button>
                )}
                
                {/* Status Info */}
                <div className="text-sm text-gray-600">
                  {request.status === 'pending' && '⏳ Waiting for task owner to respond'}
                  {request.status === 'accepted' && '✅ Your request was accepted! Contact the task owner.'}
                  {request.status === 'rejected' && '❌ Your request was not accepted for this task'}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyRequestsView;