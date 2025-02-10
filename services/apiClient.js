import axios from "axios";
import { logout, refreshAccessToken } from "./authService";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("access_token");
  if (!token) {
    token = await refreshAccessToken(); // Pokusíme se získat nový token
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true; // ✅ Zabráníme cyklům
      const newToken = await refreshAccessToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api(error.config);
      } else {
        logout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
