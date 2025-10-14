  // 🔹 Send Request for a Task
  const sendRequest = async (taskId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await api.post(`/requests/${taskId}`);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error("Send request error:", err.response?.data || err.message);
      setIsLoading(false);
      return false;
    }
  };
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../api/axios";

interface Task {
  _id: string;
  title: string;
  description?: string;
  category: string;
  location: string;
  picture?: string;
  startTime: string;
  endTime?: string;
  status: "pending" | "in-progress" | "completed";
  user_id: {
    _id: string;
    first_name: string;
    last_name: string;
    email_id: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TaskContextType {
  myTasks: Task[];
  feedTasks: Task[];
  isLoading: boolean;
  createTask: (taskData: Partial<Task>) => Promise<boolean>;
  getMyTasks: () => Promise<void>;
  getFeed: () => Promise<void>;
  getTaskById: (id: string) => Promise<Task | null>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  sendRequest: (taskId: string) => Promise<boolean>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  // 🔹 Send Request for a Task
  const sendRequest = async (taskId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
  await api.post(`/requests/${taskId}`);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error("Send request error:", err.response?.data || err.message);
      setIsLoading(false);
      return false;
    }
  };
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [feedTasks, setFeedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Create Task
  const createTask = async (taskData: Partial<Task>): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await api.post("/tasks", taskData);
      setMyTasks((prev) => [...prev, res.data.task]);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error("Create task error:", err.response?.data || err.message);
      setIsLoading(false);
      return false;
    }
  };

  // 🔹 Get Feed
  const getFeed = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await api.get("/tasks/feed");
      setFeedTasks(res.data.tasks);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Get feed error:", err.response?.data || err.message);
      setIsLoading(false);
    }
  };

  // 🔹 Get Task by ID
  const getTaskById = async (id: string): Promise<Task | null> => {
    setIsLoading(true);
    try {
      const res = await api.get(`/tasks/${id}`);
      setIsLoading(false);
      return res.data.task;
    } catch (err: any) {
      console.error("Get task by id error:", err.response?.data || err.message);
      setIsLoading(false);
      return null;
    }
  };

  // 🔹 Update Task
  const updateTask = async (id: string, taskData: Partial<Task>): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await api.put(`/tasks/${id}`, taskData);
      setMyTasks((prev) =>
        prev.map((t) => (t._id === id ? res.data.task : t))
      );
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error("Update task error:", err.response?.data || err.message);
      setIsLoading(false);
      return false;
    }
  };

  // 🔹 Delete Task
  const deleteTask = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await api.delete(`/tasks/${id}`);
      setMyTasks((prev) => prev.filter((t) => t._id !== id));
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error("Delete task error:", err.response?.data || err.message);
      setIsLoading(false);
      return false;
    }
  };

  // 🔹 Get My Tasks
  const getMyTasks = async (): Promise<void> => {
    setIsLoading(true);
    try {
  const res = await api.get("/tasks/my-tasks");
      setMyTasks(res.data.tasks);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Get my tasks error:", err.response?.data || err.message);
      setIsLoading(false);
    }
  };

  const value: TaskContextType = {
    myTasks,
    feedTasks,
    isLoading,
    createTask,
    getMyTasks,
    getFeed,
    getTaskById,
    updateTask,
    deleteTask,
    sendRequest,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// 🔹 Custom hook
export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
function setIsLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

