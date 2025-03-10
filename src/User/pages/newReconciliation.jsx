import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";

const NewReconciliationScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    husband: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
    },
    wife: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
    },
    issueDescription: "",
    additionalInformation: "",
    urgencyLevel: "normal",
    preferredMeetingType: "in-person",
  });

  const handleChange = (e, person, field) => {
    if (person) {
      setFormData({
        ...formData,
        [person]: {
          ...formData[person],
          [field]: e.target.value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const goToNextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const goToPreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/reconciliations", formData);
      toast.success("Reconciliation request submitted successfully!");
      navigate("/user/reconciliation-queries");
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to submit reconciliation request"
      );
      console.error("Error creating reconciliation request:", err);
      toast.error("Failed to submit reconciliation request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              New Reconciliation Request
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Submit a request for family reconciliation support
            </p>
          </div>
          <button
            onClick={() => navigate("/user/reconciliation-queries")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            View Existing
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm">
          <form onSubmit={step === 3 ? handleSubmit : goToNextStep}>
            <div className="px-6 py-4">
              {/* Step Indicator */}
              <div className="flex items-center mb-6">
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full ${
                    step >= 1
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step >= 2 ? "bg-green-600" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full ${
                    step >= 2
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step >= 3 ? "bg-green-600" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full ${
                    step >= 3
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  3
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {/* Step 1: Husband Information */}
              {step === 1 && (
                <div>
                  <h4 className="text-lg font-medium mb-4">
                    Husband Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.husband.firstName}
                        onChange={(e) =>
                          handleChange(e, "husband", "firstName")
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.husband.lastName}
                        onChange={(e) => handleChange(e, "husband", "lastName")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.husband.phone}
                        onChange={(e) => handleChange(e, "husband", "phone")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.husband.email}
                        onChange={(e) => handleChange(e, "husband", "email")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={formData.husband.address}
                        onChange={(e) => handleChange(e, "husband", "address")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Wife Information */}
              {step === 2 && (
                <div>
                  <h4 className="text-lg font-medium mb-4">Wife Information</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.wife.firstName}
                        onChange={(e) => handleChange(e, "wife", "firstName")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.wife.lastName}
                        onChange={(e) => handleChange(e, "wife", "lastName")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.wife.phone}
                        onChange={(e) => handleChange(e, "wife", "phone")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.wife.email}
                        onChange={(e) => handleChange(e, "wife", "email")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={formData.wife.address}
                        onChange={(e) => handleChange(e, "wife", "address")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Issue Details */}
              {step === 3 && (
                <div>
                  <h4 className="text-lg font-medium mb-4">Issue Details</h4>

                  <div className="mb-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Description
                      </label>
                      <textarea
                        name="issueDescription"
                        value={formData.issueDescription}
                        onChange={(e) => handleChange(e)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Please describe the issues that require reconciliation..."
                        required
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Urgency Level
                        </label>
                        <div className="flex space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="urgencyLevel"
                              value="urgent"
                              checked={formData.urgencyLevel === "urgent"}
                              onChange={(e) => handleChange(e)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Urgent
                            </span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="urgencyLevel"
                              value="normal"
                              checked={formData.urgencyLevel === "normal"}
                              onChange={(e) => handleChange(e)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Normal
                            </span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="urgencyLevel"
                              value="low"
                              checked={formData.urgencyLevel === "low"}
                              onChange={(e) => handleChange(e)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Low
                            </span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Meeting Type
                        </label>
                        <div className="flex space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="preferredMeetingType"
                              value="in-person"
                              checked={
                                formData.preferredMeetingType === "in-person"
                              }
                              onChange={(e) => handleChange(e)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              In Person
                            </span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="preferredMeetingType"
                              value="online"
                              checked={
                                formData.preferredMeetingType === "online"
                              }
                              onChange={(e) => handleChange(e)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Online
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Information
                      </label>
                      <textarea
                        name="additionalInformation"
                        value={formData.additionalInformation}
                        onChange={(e) => handleChange(e)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Any additional details or special considerations..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                    Processing...
                  </>
                ) : step === 3 ? (
                  "Submit"
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewReconciliationScreen;
