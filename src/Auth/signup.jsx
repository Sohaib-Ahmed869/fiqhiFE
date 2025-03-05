// SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import google from "../assets/google.png";
import apple from "../assets/apple.png";
import { useAuth } from "../Contexts/AuthContext"; // Assuming you have an AuthContext like in Login
import { toast } from "react-toastify";
const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register } = useAuth(); // Assuming your AuthContext provides a register function

  // Clear error when component mounts or when fields change
  React.useEffect(() => {
    setError(null);
  }, [name, email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the terms and policy");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log(name, email, password);
      const success = await register(name, email, password);

      if (success === true) {
        navigate("/login"); // Redirect to login after successful registration
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="mb-12">
        <img src={logo} alt="The Fiqhi Council of Australia" className="h-24" />
      </div>

      {/* Form */}
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Get Started Now
        </h1>

        <p className="text-gray-600 mt-1">
          Create your account to access our services
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full bg-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the terms & policy
            </label>
          </div>

          <button
            className="btn btn-success w-full text-white"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Signup"}
          </button>
        </form>

        {/* <div className="text-center text-sm text-gray-500">Or</div> */}

        {/* Social Login
        <div className="space-y-3">
          <button className="btn btn-outline w-full normal-case">
            <img src={google} alt="Google" className="w-5 h-5 mr-2" />
            Sign up with Google
          </button>

          <button className="btn btn-outline w-full normal-case">
            <img src={apple} alt="Apple" className="w-5 h-5 mr-2" />
            Sign up with Apple
          </button>
        </div> */}

        <div className="text-center text-sm">
          Have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
