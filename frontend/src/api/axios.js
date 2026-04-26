import axios from "axios";
let backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
if (backendUrl.endsWith('/')) backendUrl = backendUrl.slice(0, -1);
if (!backendUrl.endsWith('/api/v1')) backendUrl += '/api/v1';

const api = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});
// Debug every request in DevTools
api.interceptors.request.use((config) => {
    console.log("➡️ API Request:", config.baseURL + config.url);
    return config;
});
api.interceptors.response.use((response) => response, (error) => {
    console.log("❌ API Error:", error?.response?.status, error?.response?.data);
    return Promise.reject(error);
});
export default api;
