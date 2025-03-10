// src/utils/api.js
import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  // baseURL: "https://fiqhibackend.onrender.com/api",
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For file uploads (FormData), don't set Content-Type header
    // Let Axios set the proper boundary for multipart/form-data
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    // Handle token expiration or authentication errors
    if (response && (response.status === 401 || response.status === 403)) {
      // Clear localStorage when token is invalid or expired
      localStorage.removeItem("token");

      // // Redirect to login if not already there
      // if (window.location.pathname !== "/login") {
      //   window.location.href = "/login";
      // }
    }

    return Promise.reject(error);
  }
);

export default api;
