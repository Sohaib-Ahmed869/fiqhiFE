// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../Contexts/AuthContext";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error, setError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  // Clear error when component mounts or when fields change
  React.useEffect(() => {
    setError(null);
  }, [email, password, setError]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
  
    setIsSubmitting(true);
    const success = await login(email, password, remember);
  
    if (success) {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("user"));
      
      // Navigate based on user role
      if (userData && userData.role) {
        if (userData.role === "admin") {
          navigate("/admin");
        } else if (userData.role === "shaykh") {
          navigate("/shaykh");
        } else {
          navigate("/user");
        }
      } else {
        // Fallback if user data or role is missing
        console.error("User role not found in localStorage");
        navigate("/user"); // Default to user portal
      }
    }
  
    setIsSubmitting(false);
  };

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="mb-12">
        <img src={logo} alt="The Fiqhi Council of Australia" className="h-24" />
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back!
          </h1>
          <p className="text-gray-600 mt-1">
            Enter your Credentials to access your account
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
        )}

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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember for 30 days
              </label>
            </div>
            <Link
              to="/forgotpassword"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-success w-full text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* <div className="text-center text-sm text-gray-500">Or</div> */}

        {/* Social Login
        <div className="space-y-3">
          <button className="btn btn-outline w-full normal-case">
            <img src={google} alt="Google" className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>

          <button className="btn btn-outline w-full normal-case">
            <img src={apple} alt="Apple" className="w-5 h-5 mr-2" />
            Sign in with Apple
          </button>
        </div> */}

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
