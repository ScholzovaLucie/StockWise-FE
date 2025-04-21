// apiClient.js
import axios from "axios";

const api = axios.create({
  baseURL:
    "https://stockwise-be-production-7684.up.railway.app" /*"http://localhost:8000/api",*/,
  withCredentials: true, // Používáme cookies pro tokeny
});

export default api;
