import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("❌ API Error:", error?.response?.status, error?.response?.data);
    return Promise.reject(error);
  }
);

export default api;
