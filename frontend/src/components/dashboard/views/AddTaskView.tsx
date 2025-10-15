import React, { useState } from "react";
import { MapPin, Camera, Tag, Calendar } from "lucide-react";
import { useTasks } from "../../../contexts/TaskContext";
import api from "../../../api/axios";

const AddTaskView: React.FC = () => {
  const { createTask } = useTasks();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    picture: "",
    startTime: "",
    endTime: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const categories = [
    "Cleaning",
    "Moving",
    "Pet Care",
    "Gardening",
    "Tech Support",
    "Handyman",
    "Delivery",
    "Tutoring",
    "Event Help",
    "Other",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let uploadedUrl = "";

      // Upload picture if present
      if (file) {
        const formDataObj = new FormData();
        formDataObj.append("picture", file);

        const uploadRes = await api.post("/uploadPicture", formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedUrl = uploadRes.data.imageUrl; // backend sends file path
      }

      // Create task
      const success = await createTask({
        ...formData,
        picture: uploadedUrl,
      });

      if (success) {
        setFormData({
          title: "",
          description: "",
          category: "",
          location: "",
          picture: "",
          startTime: "",
          endTime: "",
        });
        setFile(null);
        alert("Task created successfully!");
      } else {
        alert("Failed to create task. Please try again.");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("An error occurred while creating the task.");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Post a New Task</h2>
        <p className="text-sm text-gray-600">Find the perfect helper for your task</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Title */}
            <div className="lg:col-span-2">
              <label htmlFor="title" className="block text-xs font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                placeholder="What do you need help with?"
              />
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
                placeholder="Provide details about your task..."
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-xs font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="relative">
                <Tag className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-xs font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  placeholder="Enter location"
                />
              </div>
            </div>

            {/* Start Time */}
            <div>
              <label htmlFor="startTime" className="block text-xs font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  id="startTime"
                  name="startTime"
                  type="date"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* End Time */}
            <div>
              <label htmlFor="endTime" className="block text-xs font-medium text-gray-700 mb-1">
                End Time
              </label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  id="endTime"
                  name="endTime"
                  type="date"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Add Photos (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
              <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Upload photos to describe your task</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors cursor-pointer inline-block"
              >
                Choose Photo
              </label>
              {file && <p className="text-xs text-green-600 mt-1">Selected: {file.name}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg text-sm transition duration-200"
            >
              Post Task
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition duration-200"
              onClick={() => {
                setFormData({
                  title: "",
                  description: "",
                  category: "",
                  location: "",
                  picture: "",
                  startTime: "",
                  endTime: "",
                });
                setFile(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskView;
