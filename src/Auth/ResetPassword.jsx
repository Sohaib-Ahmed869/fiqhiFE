// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../Contexts/AuthContext";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const { resetToken } = useParams(); // Retrieve token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
      };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);
    const response = await resetPassword(password, resetToken);
    if (response.success) {
      toast.success("Password updated successfully. Please login.");
      navigate("/login");
    } else {
      toast.error(response.error || "Failed to update password");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="mb-12">
        <img src={logo} alt="Logo" className="h-24" />
      </div>

      {/* Reset Password Form */}
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Reset Password</h1>
        <p className="text-gray-600 mt-1">Enter your new password below.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
<div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered w-full bg-white pr-16"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-xl text-grey-600 focus:outline-none"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <div className="relative">
            <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            className="input input-bordered w-full bg-white pr-16"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            />
            <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-xl text-grey-600 focus:outline-none"
            >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
        </div>
          <button
            type="submit"
            className="btn btn-success w-full text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating Password..." : "Reset Password"}
          </button>
        </form>
        <div className="text-center text-sm">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
