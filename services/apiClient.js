// apiClient.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // Používáme cookies pro tokeny
});

export default api;
