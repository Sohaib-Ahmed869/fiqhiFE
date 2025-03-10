import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../Contexts/AuthContext";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    const response = await forgotPassword(email);
    if (response.success) {
      toast.success("Password reset link has been sent to your email");
      // Optionally, navigate to login after a delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      toast.error(response.error || "Failed to send password reset link");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="mb-12">
        <img src={logo} alt="Logo" className="h-24" />
      </div>

      {/* Forgot Password Form */}
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Forgot Password
        </h1>
        <p className="text-gray-600 mt-1">
          Enter your email address to receive a password reset link.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="input input-bordered w-full bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-full text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
