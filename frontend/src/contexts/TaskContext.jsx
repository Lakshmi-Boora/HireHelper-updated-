// 🔹 Send Request for a Task
const sendRequest = async (taskId) => {
    setIsLoading(true);
    try {
        await api.post(`/requests/${taskId}`);
        setIsLoading(false);
        return true;
    }
    catch (err) {
        console.error("Send request error:", err.response?.data || err.message);
        setIsLoading(false);
        return false;
    }
};
import React, { createContext, useContext, useState } from "react";
import api from "../api/axios";
const TaskContext = createContext(undefined);
export const TaskProvider = ({ children }) => {
    // 🔹 Send Request for a Task
    const sendRequest = async (taskId) => {
        setIsLoading(true);
        try {
            await api.post(`/requests/${taskId}`);
            setIsLoading(false);
            return true;
        }
        catch (err) {
            console.error("Send request error:", err.response?.data || err.message);
            setIsLoading(false);
            return false;
        }
    };
    const [myTasks, setMyTasks] = useState([]);
    const [feedTasks, setFeedTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // 🔹 Create Task
    const createTask = async (taskData) => {
        setIsLoading(true);
        try {
            const res = await api.post("/tasks", taskData);
            setMyTasks((prev) => [...prev, res.data.task]);
            setIsLoading(false);
            return true;
        }
        catch (err) {
            console.error("Create task error:", err.response?.data || err.message);
            setIsLoading(false);
            return false;
        }
    };
    // 🔹 Get Feed
    const getFeed = async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/tasks/feed");
            setFeedTasks(res.data.tasks);
            setIsLoading(false);
        }
        catch (err) {
            console.error("Get feed error:", err.response?.data || err.message);
            setIsLoading(false);
        }
    };
    // 🔹 Get Task by ID
    const getTaskById = async (id) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/tasks/${id}`);
            setIsLoading(false);
            return res.data.task;
        }
        catch (err) {
            console.error("Get task by id error:", err.response?.data || err.message);
            setIsLoading(false);
            return null;
        }
    };
    // 🔹 Update Task
    const updateTask = async (id, taskData) => {
        setIsLoading(true);
        try {
            const res = await api.put(`/tasks/${id}`, taskData);
            setMyTasks((prev) => prev.map((t) => (t._id === id ? res.data.task : t)));
            setIsLoading(false);
            return true;
        }
        catch (err) {
            console.error("Update task error:", err.response?.data || err.message);
            setIsLoading(false);
            return false;
        }
    };
    // 🔹 Delete Task
    const deleteTask = async (id) => {
        setIsLoading(true);
        try {
            await api.delete(`/tasks/${id}`);
            setMyTasks((prev) => prev.filter((t) => t._id !== id));
            setIsLoading(false);
            return true;
        }
        catch (err) {
            console.error("Delete task error:", err.response?.data || err.message);
            setIsLoading(false);
            return false;
        }
    };
    // 🔹 Get My Tasks
    const getMyTasks = async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/tasks/my-tasks");
            setMyTasks(res.data.tasks);
            setIsLoading(false);
        }
        catch (err) {
            console.error("Get my tasks error:", err.response?.data || err.message);
            setIsLoading(false);
        }
    };
    const value = {
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
export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTasks must be used within a TaskProvider");
    }
    return context;
};
function setIsLoading(arg0) {
    throw new Error("Function not implemented.");
}
