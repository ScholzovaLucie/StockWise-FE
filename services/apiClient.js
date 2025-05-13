// apiClient.js
import axios from "axios";

const api = axios.create({
  baseURL:
    "http://localhost:8000/api" /*"https://stockwise-be-production-7684.up.railway.app/api/",*/,
  withCredentials: true, // Používáme cookies pro tokeny
});

export default api;
