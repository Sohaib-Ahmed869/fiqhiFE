// src/pages/AddMarriageModal.jsx
import React, { useState } from "react";
import marriageService from "../../services/marriageServices";

const AddMarriageModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: "reservation",
    partnerOne: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      dateOfBirth: "",
    },
    partnerTwo: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      dateOfBirth: "",
    },
    preferredDate: "",
    preferredTime: "",
    preferredLocation: "",
    marriageDate: "",
    marriagePlace: "",
    witnesses: [{ name: "", contact: "" }],
    additionalInformation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const handleChange = (e, partner, field) => {
    if (partner) {
      setFormData({
        ...formData,
        [partner]: {
          ...formData[partner],
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

  const handleWitnessChange = (index, field, value) => {
    const updatedWitnesses = [...formData.witnesses];
    updatedWitnesses[index] = {
      ...updatedWitnesses[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      witnesses: updatedWitnesses,
    });
  };

  const addWitness = () => {
    setFormData({
      ...formData,
      witnesses: [...formData.witnesses, { name: "", contact: "" }],
    });
  };

  const removeWitness = (index) => {
    if (formData.witnesses.length > 1) {
      const updatedWitnesses = formData.witnesses.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        witnesses: updatedWitnesses,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;

      if (formData.type === "reservation") {
        // Create reservation
        const reservationData = {
          partnerOne: {
            firstName: formData.partnerOne.firstName,
            lastName: formData.partnerOne.lastName,
            phone: formData.partnerOne.phone,
            email: formData.partnerOne.email,
            address: formData.partnerOne.address,
          },
          partnerTwo: {
            firstName: formData.partnerTwo.firstName,
            lastName: formData.partnerTwo.lastName,
            phone: formData.partnerTwo.phone,
            email: formData.partnerTwo.email,
            address: formData.partnerTwo.address,
          },
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          preferredLocation: formData.preferredLocation,
          additionalInformation: formData.additionalInformation,
        };

        response = await marriageService.createReservation(reservationData);
        onSuccess(response.data.reservation);
      } else {
        // Create certificate request
        const certificateData = {
          partnerOne: {
            firstName: formData.partnerOne.firstName,
            lastName: formData.partnerOne.lastName,
            dateOfBirth: formData.partnerOne.dateOfBirth,
          },
          partnerTwo: {
            firstName: formData.partnerTwo.firstName,
            lastName: formData.partnerTwo.lastName,
            dateOfBirth: formData.partnerTwo.dateOfBirth,
          },
          marriageDate: formData.marriageDate,
          marriagePlace: formData.marriagePlace,
          witnesses: formData.witnesses,
          additionalInformation: formData.additionalInformation,
        };

        response = await marriageService.createCertificate(certificateData);
        onSuccess(response.data.certificate);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create marriage query");
      console.error("Error creating marriage query:", err);
    } finally {
      setLoading(false);
    }
  };

  const goToNextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const goToPreviousStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-lg font-medium text-gray-900">
            {formData.type === "reservation"
              ? "New Marriage Reservation Request"
              : "New Marriage Certificate Request"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={step === 3 ? handleSubmit : goToNextStep}>
          <div className="px-6 py-4">
            {/* Step Indicator */}
            <div className="flex items-center mb-6">
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-full ${
                  step >= 1
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  step >= 2 ? "bg-primary-600" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-full ${
                  step >= 2
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  step >= 3 ? "bg-primary-600" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-full ${
                  step >= 3
                    ? "bg-primary-600 text-white"
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

            {/* Step 1: Select Type */}
            {step === 1 && (
              <div>
                <h4 className="text-lg font-medium mb-4">
                  Select Request Type
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.type === "reservation"
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, type: "reservation" })
                    }
                  >
                    <div className="flex items-center mb-2">
                      <svg
                        className="h-6 w-6 text-primary-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <h5 className="font-medium">Marriage Reservation</h5>
                    </div>
                    <p className="text-sm text-gray-600">
                      Request a shaykh to conduct your marriage ceremony.
                      Meetings will be scheduled.
                    </p>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.type === "certificate"
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, type: "certificate" })
                    }
                  >
                    <div className="flex items-center mb-2">
                      <svg
                        className="h-6 w-6 text-primary-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h5 className="font-medium">Marriage Certificate</h5>
                    </div>
                    <p className="text-sm text-gray-600">
                      Request a marriage certificate for an already performed
                      marriage.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Partner Details */}
            {step === 2 && (
              <div>
                <h4 className="text-lg font-medium mb-4">Partner Details</h4>

                <div className="mb-6">
                  <h5 className="font-medium text-gray-700 mb-3 pb-2 border-b">
                    Partner 1
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.partnerOne.firstName}
                        onChange={(e) =>
                          handleChange(e, "partnerOne", "firstName")
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.partnerOne.lastName}
                        onChange={(e) =>
                          handleChange(e, "partnerOne", "lastName")
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    {formData.type === "certificate" ? (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={formData.partnerOne.dateOfBirth}
                          onChange={(e) =>
                            handleChange(e, "partnerOne", "dateOfBirth")
                          }
                          max={new Date().toISOString().split("T")[0]} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={formData.partnerOne.phone}
                            onChange={(e) =>
                              handleChange(e, "partnerOne", "phone")
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={formData.partnerOne.email}
                            onChange={(e) =>
                              handleChange(e, "partnerOne", "email")
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                          </label>
                          <input
                            type="text"
                            value={formData.partnerOne.address}
                            onChange={(e) =>
                              handleChange(e, "partnerOne", "address")
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h5 className="font-medium text-gray-700 mb-3 pb-2 border-b">
                    Partner 2
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.partnerTwo.firstName}
                        onChange={(e) =>
                          handleChange(e, "partnerTwo", "firstName")
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.partnerTwo.lastName}
                        onChange={(e) =>
                          handleChange(e, "partnerTwo", "lastName")
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    {formData.type === "certificate" ? (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={formData.partnerTwo.dateOfBirth}
                          onChange={(e) =>
                            handleChange(e, "partnerTwo", "dateOfBirth")
                          }
                          max={new Date().toISOString().split("T")[0]} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={formData.partnerTwo.phone}
                            onChange={(e) =>
                              handleChange(e, "partnerTwo", "phone")
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={formData.partnerTwo.email}
                            onChange={(e) =>
                              handleChange(e, "partnerTwo", "email")
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                          </label>
                          <input
                            type="text"
                            value={formData.partnerTwo.address}
                            onChange={(e) =>
                              handleChange(e, "partnerTwo", "address")
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Additional Details */}
            {step === 3 && (
              <div>
                <h4 className="text-lg font-medium mb-4">
                  {formData.type === "reservation"
                    ? "Reservation Details"
                    : "Certificate Details"}
                </h4>

                {formData.type === "reservation" ? (
                  <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split("T")[0]}  
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Time
                        </label>
                        <input
                          type="time"
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Location
                      </label>
                      <input
                        type="text"
                        name="preferredLocation"
                        value={formData.preferredLocation}
                        onChange={handleChange}
                        placeholder="e.g., Local Masjid, Home address, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Marriage Date
                        </label>
                        <input
                          type="date"
                          name="marriageDate"
                          value={formData.marriageDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split("T")[0]} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Marriage Place
                        </label>
                        <input
                          type="text"
                          name="marriagePlace"
                          value={formData.marriagePlace}
                          onChange={handleChange}
                          placeholder="e.g., Melbourne, Victoria"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Witnesses
                      </label>
                      {formData.witnesses.map((witness, index) => (
                        <div
                          key={index}
                          className="flex items-center mb-2 gap-2"
                        >
                          <input
                            type="text"
                            value={witness.name}
                            onChange={(e) =>
                              handleWitnessChange(index, "name", e.target.value)
                            }
                            placeholder="Witness Name"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                          <input
                            type="text"
                            value={witness.contact}
                            onChange={(e) =>
                              handleWitnessChange(
                                index,
                                "contact",
                                e.target.value
                              )
                            }
                            placeholder="Contact Info"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                          {formData.witnesses.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeWitness(index)}
                              className="p-2 text-red-600 hover:text-red-800"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addWitness}
                        className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add Witness
                      </button>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information
                  </label>
                  <textarea
                    name="additionalInformation"
                    value={formData.additionalInformation}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Any additional details or special requirements..."
                  ></textarea>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={goToPreviousStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
  );
};

export default AddMarriageModal;
