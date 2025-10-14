import React, { useState } from 'react';
import api from '../../../api/axios';
import { X } from 'lucide-react';

interface SendRequestFormProps {
  taskId: string;
  taskTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SendRequestForm: React.FC<SendRequestFormProps> = ({
  taskId,
  taskTitle,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post(`/requests/${taskId}`, {
        description: description.trim()
      });
      
      setDescription('');
      onSuccess();
      onClose();
      alert('Request sent successfully!');
    } catch (err: any) {
      console.error('Send request error:', err);
      setError(err.response?.data?.error || 'Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Send Request</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">{taskTitle}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Why are you interested in this task? Describe your skills and availability.
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Your Message *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe why you're a good fit for this task, your relevant experience, and when you're available..."
              rows={6}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendRequestForm;