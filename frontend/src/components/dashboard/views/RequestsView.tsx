import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { MapPin, Clock, MessageCircle, Eye, Users } from 'lucide-react';

const RequestsView: React.FC = () => {
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [applications, setApplications] = useState<{ [key: string]: any[] }>({});
  const [showAppsFor, setShowAppsFor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Accept request
  const handleAcceptRequest = async (requestId: string) => {
    try {
      await api.patch(`/requests/${requestId}/accept`);
      setReceivedRequests(prev =>
        prev.map(r => r._id === requestId ? { ...r, status: 'accepted' } : r)
      );
      setFilteredRequests(prev =>
        prev.map(r => r._id === requestId ? { ...r, status: 'accepted' } : r)
      );
      alert('Request accepted!');
    } catch (err) {
      alert('Failed to accept request.');
      console.error('Accept request error:', err);
    }
  };

  // Reject request
  const handleRejectRequest = async (requestId: string) => {
    try {
      await api.patch(`/requests/${requestId}/reject`);
      setReceivedRequests(prev =>
        prev.map(r => r._id === requestId ? { ...r, status: 'rejected' } : r)
      );
      setFilteredRequests(prev =>
        prev.map(r => r._id === requestId ? { ...r, status: 'rejected' } : r)
      );
      alert('Request rejected!');
    } catch (err) {
      alert('Failed to reject request.');
      console.error('Reject request error:', err);
    }
  };

  // View applications for a task
  const handleViewApplications = async (taskId: string) => {
    try {
      const res = await api.get(`/requests/for-task/${taskId}`);
      setApplications(prev => ({ ...prev, [taskId]: res.data }));
      setShowAppsFor(showAppsFor === taskId ? null : taskId);
    } catch (err) {
      console.error('Error fetching applications:', err);
      alert('Failed to load applications');
    }
  };

  // Fetch requests
  useEffect(() => {
    setLoading(true);
    api.get('/requests/for-my-tasks')
      .then((res: { data: any }) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setReceivedRequests(data);
        setFilteredRequests(data);
        setApiError(false);
      })
      .catch((err) => {
        console.error('Requests error:', err);
        setReceivedRequests([]);
        setFilteredRequests([]);
        setApiError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter requests based on search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredRequests(receivedRequests);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFilteredRequests(
      receivedRequests.filter(r =>
        (r.task_id?.title || '').toLowerCase().includes(term) ||
        (r.task_id?.location || '').toLowerCase().includes(term) ||
        (r.description || '').toLowerCase().includes(term) ||
        (r.requester_id?.first_name || '').toLowerCase().includes(term) ||
        (r.requester_id?.last_name || '').toLowerCase().includes(term)
      )
    );
  }, [searchTerm, receivedRequests]);

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
          <h2 className="text-xl font-bold text-gray-900">Requests Received</h2>
          <p className="text-base text-gray-600">Requests sent to your tasks</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by task, location, or applicant..."
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
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-lg text-gray-600">Loading requests...</div>
          </div>
        ) : apiError ? (
          <div className="text-red-600">
            Received requests endpoint not found. Please ask backend to add <code>/requests/for-my-tasks</code> API.
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-lg font-semibold mb-2">No requests received</div>
            <div className="text-gray-500">
              {receivedRequests.length === 0 
                ? "You haven't received any requests for your tasks yet." 
                : "No requests match your search."}
            </div>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.task_id?.title}</h3>
                  <div className="flex items-center text-gray-600 space-x-4 mb-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{new Date(request.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{request.task_id?.location}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    From: {request.requester_id?.first_name} {request.requester_id?.last_name}
                  </div>
                </div>
                <div className="text-right mt-3 lg:mt-0">
                  <div className="text-2xl font-bold text-green-600">{request.task_id?.price ? `$${request.task_id.price}` : ''}</div>
                  <div className="text-xs text-gray-500">proposed rate</div>
                </div>
              </div>

              {/* Display request description */}
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex items-start">
                  <MessageCircle className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 italic">
                    {request.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 items-center justify-between">
                <div className="flex space-x-3">
                  {request.status === 'pending' && (
                    <>
                      <button
                        className="px-4 py-2 border border-green-200 text-green-600 hover:bg-green-50 font-medium rounded-lg transition-colors"
                        onClick={() => handleAcceptRequest(request._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors"
                        onClick={() => handleRejectRequest(request._id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    Status: {request.status}
                  </span>
                </div>

                {/* View All Applications Button */}
                <button
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  onClick={() => handleViewApplications(request.task_id?._id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All Applications
                </button>
              </div>

              {/* Applications List */}
              {showAppsFor === request.task_id?._id && applications[request.task_id?._id] && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    All Applications for this Task:
                  </h4>
                  {applications[request.task_id._id].length === 0 ? (
                    <div className="text-gray-500">No other applications found.</div>
                  ) : (
                    <ul className="space-y-3">
                      {applications[request.task_id._id].map((app: any) => (
                        <li key={app._id} className="p-3 bg-white rounded border">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">{app.requester_id?.first_name} {app.requester_id?.last_name}</span>
                              <p className="text-sm text-gray-600 mt-1">{app.description}</p>
                              <div className="text-xs text-gray-500 mt-1">
                                Applied: {app.createdAt ? new Date(app.createdAt).toLocaleString() : ''}
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RequestsView;