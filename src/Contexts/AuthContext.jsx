// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios default headers when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // Load user data when token is available
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Replace with your actual endpoint to get user profile
        const res = await api.get("/auth/profile");
        setCurrentUser(res.data.user);
        setError(null);
      } catch (err) {
        console.error("Failed to load user", err);
        toast.error(err.response?.data?.error || "Failed to load user profile");

        // Clear token if it's invalid
        if (err.response?.status === 401) {
          setToken(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Login function
  const login = async (email, password, remember = false) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });

      setToken(res.data.token);
      localStorage.setItem("role", res.data.role);

      // If "remember for 30 days" is checked, we could set a longer expiry
      // on the token in localStorage, but that's handled server-side

      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/register", { name, email, password });

      // Auto-login after registration if the API provides a token
      if (res.data.token) {
        setToken(res.data.token);
      }

      return { success: true, data: res.data };
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
      return {
        success: false,
        error: err.response?.data?.error || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => !!token && !!currentUser;

  // Check if user has a specific role
  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  const value = {
    currentUser,
    loading,
    error,
    token,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
    setError, // Expose error setter to clear errors
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
