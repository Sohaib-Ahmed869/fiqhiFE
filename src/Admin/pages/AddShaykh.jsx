// src/pages/AddShaykh.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { FaUserPlus, FaArrowLeft } from "react-icons/fa";

const AddShaykh = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    yearsOfExperience: "",
    educationalInstitution: "",
    phoneNumber: "",
    address: "",
  });
  
  // Form validation errors
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear previous validation error when field is edited
    setValidationErrors({
      ...validationErrors,
      [name]: ""
    });
    
    // Update form data
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Validate fields as user types
    validateField(name, value);
  };
  
  // Field validation function
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "firstName":
      case "lastName":
        // Only allow letters, spaces, hyphens and apostrophes in names
        if (!/^[A-Za-z\s'-]*$/.test(value)) {
          error = "Name should only contain letters, spaces, hyphens and apostrophes";
        }
        break;
        
      case "email":
        // Basic email validation
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
        
      case "password":
        // Password should be at least 6 characters
        if (value && value.length < 6) {
          error = "Password should be at least 6 characters long";
        }
        break;
        
      case "phoneNumber":
        // Phone should only contain numbers, plus sign, spaces, parentheses and hyphens
        if (!/^[0-9+\s()-]*$/.test(value)) {
          error = "Phone number should only contain digits, +, spaces, parentheses and hyphens";
        }
        break;
        
      case "yearsOfExperience":
        // Ensure years is a positive number
        if (value && (isNaN(value) || parseInt(value) < 0)) {
          error = "Years of experience must be a positive number";
        }
        break;
        
      default:
        break;
    }
    
    // Update validation errors
    setValidationErrors({
      ...validationErrors,
      [name]: error
    });
    
    return error === "";
  };

  const validateForm = () => {
    // Validate all fields
    let isValid = true;
    let newErrors = {};
    
    // Check required fields and validate each field
    Object.keys(formData).forEach(key => {
      // First check if empty for required fields
      if (["firstName", "lastName", "email", "password", "phoneNumber", "address", "yearsOfExperience", "educationalInstitution"].includes(key) && !formData[key]) {
        newErrors[key] = "This field is required";
        isValid = false;
      } else {
        // If not empty, validate the field
        const fieldValid = validateField(key, formData[key]);
        if (!fieldValid) {
          isValid = false;
          // Keep existing error message from validateField
          newErrors[key] = validationErrors[key];
        }
      }
    });
    
    setValidationErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      setError("Please correct the validation errors before submitting");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Call the API endpoint to register a new shaykh
      const response = await api.post("/admin/shaykhs", formData);

      console.log("Shaykh added successfully:", response.data);

      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        yearsOfExperience: "",
        educationalInstitution: "",
        phoneNumber: "",
        address: "",
      });

      // Show success message
      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/admin/shaykhs");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An error occurred while adding the shaykh."
      );
      console.error("Error adding shaykh:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 rounded-md bg-green-50 border border-green-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Shaykh added successfully! Redirecting...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <FaUserPlus className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Shaykh Details
              </h3>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Please fill in all the required information to add a new shaykh to
              the system.
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    required
                    className={`w-full rounded-md border ${validationErrors.firstName ? 'border-red-500' : 'border-gray-300'} shadow-sm px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm`}
                  />
                  {validationErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    required
                    className={`w-full rounded-md border ${validationErrors.lastName ? 'border-red-500' : 'border-gray-300'} shadow-sm px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm`}
                  />
                  {validationErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email and Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                    className={`w-full rounded-md border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} shadow-sm px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm`}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    className={`w-full rounded-md border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} shadow-sm px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm`}
                  />
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                  )}
                </div>
              </div>

              {/* Experience and Institution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    placeholder="3"
                    required
                    min="0"
                    className={`w-full rounded-md border ${validationErrors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'} shadow-sm px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm`}
                  />
                  {validationErrors.yearsOfExperience && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.yearsOfExperience}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Educational Institution{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="educationalInstitution"
                    value={formData.educationalInstitution}
                    onChange={handleChange}
                    placeholder="Institution name"
                    required
                    className={`w-full rounded-md border ${validationErrors.educationalInstitution ? 'border-red-500' : 'border-gray-300'} shadow-sm px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm`}
                  />
                  {validationErrors.educationalInstitution && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.educationalInstitution}</p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <div className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    <select className="h-full bg-transparent py-0 pl-2 pr-7 border-0 focus:outline-none">
                      <option>AUS</option>
                      <option>USA</option>
                      <option>UK</option>
                      <option>CA</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+61 (555) 000-0000"
                    required
                    className={`flex-1 rounded-r-md border ${validationErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} shadow-sm px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm`}
                  />
                </div>
                {validationErrors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phoneNumber}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  required
                  className={`w-full rounded-md border ${validationErrors.address ? 'border-red-500' : 'border-gray-300'} shadow-sm px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm`}
                  placeholder="Full address"
                />
                {validationErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding Shaykh...
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="mr-2" /> Add Shaykh
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddShaykh;