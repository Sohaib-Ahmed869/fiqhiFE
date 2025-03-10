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
        if (err.response?.status === 401) {
          setToken(null);
        }
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const login = async (email, password, remember = false) => {
    try {
      setLoading(true);
      console.log("Attempting login with:", email);
      
      const res = await api.post("/auth/login", { email, password });
      if (res.data && res.data.token) {
        // Store the token
        setToken(res.data.token);
        
        // Store the entire user object
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          
          // Also store role separately for backward compatibility
          localStorage.setItem("role", res.data.user.role);
        } else {
          console.error("User data missing from login response");
        }
        
        toast.success("Login successful!");
        return true;
      } else {
        toast.error("Login failed: Invalid response");
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
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
      if (res.data.success) {
        toast.success("Registration successful!");
        return { success: true, user: res.data.user };
      } else {
        toast.error(res.data.error || "Registration failed");
        return { success: false, message: res.data.error || "Registration failed" };
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
      return {
        success: false,
        message: err.response?.data?.error || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password function
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/forgotpassword", { email });
      return { success: true, message: res.data.data };
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send reset link");
      return {
        success: false,
        error: err.response?.data?.error || "Failed to send reset link",
      };
    } finally {
      setLoading(false);
    }
  };

  // Reset Password function
  const resetPassword = async (password, resetToken) => {
    try {
      setLoading(true);
      const res = await api.put(`/auth/resetpassword/${resetToken}`, { password });
      return { success: true, message: res.data.data };
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update password");
      return {
        success: false,
        error: err.response?.data?.error || "Failed to update password",
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
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
    forgotPassword,
    resetPassword, 
    logout,
    isAuthenticated,
    hasRole,
    setError,
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