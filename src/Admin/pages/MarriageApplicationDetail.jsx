// src/pages/admin/AdminMarriageView.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import marriageService from "../../User/services/marriageServices";
import shaykhService from "../services/shaykhService";
import { format } from "date-fns";
import {
  FaUserTie,
  FaCalendarAlt,
  FaFileUpload,
  FaArrowLeft,
  FaEdit,
  FaCheck,
  FaBan,
  FaPlus,
} from "react-icons/fa";
import ConvertIDtoSmallID from "../../utils/IDconversion";

const StatusBadge = ({ status }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";

  switch (status) {
    case "completed":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      break;
    case "assigned":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      break;
    case "in-progress":
      bgColor = "bg-purple-100";
      textColor = "text-purple-800";
      break;
    case "pending":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;
    case "cancelled":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;
  }

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full ${bgColor} ${textColor}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const FieldGroup = ({ label, value }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="bg-gray-50 px-4 py-2 rounded-md border border-gray-200 text-gray-900">
      {value || "-"}
    </div>
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
    {children}
  </h3>
);

const AssignShaykhModal = ({ marriage, shaykhs, onClose, onAssign }) => {
  const [selectedShaykhId, setSelectedShaykhId] = useState(
    marriage.assignedShaykh?._id || ""
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedShaykhId) return;

    setLoading(true);
    try {
      await onAssign(marriage._id, selectedShaykhId);
      onClose();
    } catch (error) {
      alert("Failed to assign shaykh. Please try again.");
      console.error("Error assigning shaykh:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {marriage.assignedShaykh ? "Reassign Shaykh" : "Assign Shaykh"}
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

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            <p className="mb-4 text-sm text-gray-600">
              {marriage.assignedShaykh
                ? "Change the assigned shaykh for this request:"
                : "Assign this request to a shaykh:"}
            </p>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Request From:
              </p>
              <p className="text-sm text-gray-900">
                {marriage.partnerOne.firstName} {marriage.partnerOne.lastName} &{" "}
                {marriage.partnerTwo.firstName} {marriage.partnerTwo.lastName}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Shaykh
              </label>
              <select
                value={selectedShaykhId}
                onChange={(e) => setSelectedShaykhId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">-- Select a Shaykh --</option>
                {shaykhs.map((shaykh) => (
                  <option key={shaykh._id} value={shaykh._id}>
                    {shaykh.firstName} {shaykh.lastName} (
                    {shaykh.yearsOfExperience} years exp.)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={!selectedShaykhId || loading}
            >
              {loading ? "Saving..." : "Save Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddMeetingModal = ({ marriage, onClose, onAddMeeting }) => {
  const [meetingData, setMeetingData] = useState({
    date: "",
    time: "",
    location: marriage?.preferredLocation || "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setMeetingData({
      ...meetingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onAddMeeting(meetingData);
      onClose();
    } catch (error) {
      alert("Failed to add meeting. Please try again.");
      console.error("Error adding meeting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Schedule Meeting
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

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={meetingData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={meetingData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={meetingData.location}
                onChange={handleChange}
                placeholder="e.g., Local Masjid, Home address, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={meetingData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Any additional details..."
              ></textarea>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={loading}
            >
              {loading ? "Scheduling..." : "Schedule Meeting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UpdateMeetingModal = ({ meeting, onClose, onUpdateMeeting }) => {
  const [meetingData, setMeetingData] = useState({
    date: format(new Date(meeting.date), "yyyy-MM-dd"),
    time: meeting.time,
    location: meeting.location,
    notes: meeting.notes,
    status: meeting.status,
    completedNotes: meeting.completedNotes || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setMeetingData({
      ...meetingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onUpdateMeeting(meeting._id, meetingData);
      onClose();
    } catch (error) {
      alert("Failed to update meeting. Please try again.");
      console.error("Error updating meeting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Update Meeting</h3>
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

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={meetingData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={meetingData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={meetingData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={meetingData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={meetingData.notes}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>

            {(meetingData.status === "completed" ||
              meetingData.status === "cancelled") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {meetingData.status === "completed"
                    ? "Completion Notes"
                    : "Cancellation Reason"}
                </label>
                <textarea
                  name="completedNotes"
                  value={meetingData.completedNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required={
                    meetingData.status === "completed" ||
                    meetingData.status === "cancelled"
                  }
                ></textarea>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Meeting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Replace the existing UploadCertificateModal with this
const GenerateCertificateModal = ({
  marriage,
  onClose,
  onGenerateCertificate,
}) => {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!certificateNumber) return;

    setLoading(true);
    setError(null);

    try {
      await onGenerateCertificate({ certificateNumber });
      onClose();
    } catch (error) {
      console.error("Error generating certificate:", error);
      setError(
        error.response?.data?.error ||
          "Failed to generate certificate. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Generate Certificate
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

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certificate Number
              </label>
              <input
                type="text"
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
                placeholder="e.g., MA-2025-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={!certificateNumber || loading}
            >
              {loading ? "Generating..." : "Generate Certificate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const CompleteApplicationModal = ({ marriage, onClose, onComplete }) => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onComplete({ notes });
      onClose();
    } catch (error) {
      alert("Failed to complete application. Please try again.");
      console.error("Error completing application:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Complete Application
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

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to mark this application as completed?
              {marriage.type === "certificate" && !marriage.certificateFile && (
                <span className="text-red-600 font-medium block mt-2">
                  Warning: No certificate has been uploaded yet!
                </span>
              )}
              {marriage.type === "reservation" &&
                marriage.meetings.some((m) => m.status === "scheduled") && (
                  <span className="text-yellow-600 font-medium block mt-2">
                    Warning: There are still scheduled meetings that haven't
                    been completed!
                  </span>
                )}
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Completion Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Add any final notes about this application..."
              ></textarea>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? "Completing..." : "Complete Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CancelApplicationModal = ({ marriage, onClose, onCancel }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return;

    setLoading(true);

    try {
      await onCancel({ reason });
      onClose();
    } catch (error) {
      alert("Failed to cancel application. Please try again.");
      console.error("Error cancelling application:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Cancel Application
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

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            <p className="text-sm text-red-600 font-medium">
              Warning: This action cannot be undone!
            </p>
            <p className="text-sm text-gray-600">
              Are you sure you want to cancel this application?
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cancellation Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Provide a reason for cancellation..."
                required
              ></textarea>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={loading}
            >
              {loading ? "Cancelling..." : "Cancel Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FeedbackSection = ({ feedbacks, onAddFeedback }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddFeedback(comment);
    setComment("");
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Communication</h3>

      <div className="space-y-4 mb-6">
        {feedbacks && feedbacks.length > 0 ? (
          feedbacks.map((feedback, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm flex items-center">
                  {feedback.user.firstName || feedback.user.username}
                  {feedback.user.role === "shaykh" && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Shaykh
                    </span>
                  )}
                  {feedback.user.role === "admin" && (
                    <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </span>
                <span className="text-xs text-gray-500">
                  {format(new Date(feedback.date), "MMM d, yyyy h:mm a")}
                </span>
              </div>
              <p className="text-sm">{feedback.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No messages yet.</p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          placeholder="Add a message or note..."
          rows={3}
          required
        ></textarea>
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={!comment.trim()}
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

const MeetingsList = ({ meetings, onUpdateMeeting }) => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleOpenUpdateModal = (meeting) => {
    setSelectedMeeting(meeting);
    setIsUpdateModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Meetings</h3>
        </div>

        {meetings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No meetings scheduled yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {meetings.map((meeting) => (
              <div key={meeting._id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`p-2 rounded-full 
                        ${
                          meeting.status === "completed"
                            ? "bg-green-100"
                            : meeting.status === "cancelled"
                            ? "bg-red-100"
                            : meeting.status === "rescheduled"
                            ? "bg-yellow-100"
                            : "bg-blue-100"
                        }`}
                      >
                        <FaCalendarAlt
                          className={`h-5 w-5 
                          ${
                            meeting.status === "completed"
                              ? "text-green-600"
                              : meeting.status === "cancelled"
                              ? "text-red-600"
                              : meeting.status === "rescheduled"
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="text-lg font-medium text-gray-900">
                          {format(new Date(meeting.date), "MMMM d, yyyy")} at{" "}
                          {meeting.time}
                        </h4>
                        <span
                          className={`ml-3 px-2.5 py-0.5 text-xs font-medium rounded-full 
                          ${
                            meeting.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : meeting.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : meeting.status === "rescheduled"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {meeting.status.charAt(0).toUpperCase() +
                            meeting.status.slice(1)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Location: {meeting.location}
                      </p>
                      {meeting.notes && (
                        <p className="mt-1 text-sm text-gray-600">
                          Notes: {meeting.notes}
                        </p>
                      )}
                      {meeting.completedNotes && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">
                              {meeting.status === "completed"
                                ? "Completion Notes"
                                : "Cancellation Reason"}
                              :
                            </span>{" "}
                            {meeting.completedNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenUpdateModal(meeting)}
                    className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isUpdateModalOpen && selectedMeeting && (
        <UpdateMeetingModal
          meeting={selectedMeeting}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdateMeeting={onUpdateMeeting}
        />
      )}
    </>
  );
};

// Modify CertificateView component
const CertificateView = ({ marriage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateAndDownloadCertificate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Import libraries dynamically
      const { jsPDF } = await import("jspdf");

      // Initialize the PDF document (landscape)
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Set page background color (slight cream)
      doc.setFillColor(252, 252, 250);
      doc.rect(
        0,
        0,
        doc.internal.pageSize.width,
        doc.internal.pageSize.height,
        "F"
      );

      // Add border
      doc.setDrawColor(44, 62, 80);
      doc.setLineWidth(1);
      doc.rect(
        10,
        10,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 20,
        "S"
      );

      // Add title with proper styling
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(44, 62, 80);
      doc.text(
        "ISLAMIC MARRIAGE CERTIFICATE",
        doc.internal.pageSize.width / 2,
        30,
        { align: "center" }
      );

      // Add certificate number and date
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Certificate No: ${marriage.certificateNumber}`,
        doc.internal.pageSize.width / 2,
        40,
        { align: "center" }
      );
      doc.text(
        `Issue Date: ${format(
          new Date(marriage.certificateIssuedDate || new Date()),
          "MMMM d, yyyy"
        )}`,
        doc.internal.pageSize.width / 2,
        47,
        { align: "center" }
      );

      // Add decorative line
      doc.setDrawColor(44, 62, 80);
      doc.setLineWidth(0.5);
      doc.line(50, 70, doc.internal.pageSize.width - 50, 70);

      // Certificate content
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.text("This is to certify that", doc.internal.pageSize.width / 2, 85, {
        align: "center",
      });

      // Partner names
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(
        `${marriage.partnerOne.firstName} ${marriage.partnerOne.lastName}`,
        doc.internal.pageSize.width / 2,
        100,
        { align: "center" }
      );

      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("and", doc.internal.pageSize.width / 2, 110, {
        align: "center",
      });

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(
        `${marriage.partnerTwo.firstName} ${marriage.partnerTwo.lastName}`,
        doc.internal.pageSize.width / 2,
        120,
        { align: "center" }
      );

      // Marriage details
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text(
        "have been lawfully married according to Islamic Law (Shariah)",
        doc.internal.pageSize.width / 2,
        135,
        { align: "center" }
      );
      doc.text(
        `on ${format(new Date(marriage.marriageDate), "MMMM d, yyyy")}`,
        doc.internal.pageSize.width / 2,
        145,
        { align: "center" }
      );
      doc.text(
        `at ${marriage.marriagePlace}`,
        doc.internal.pageSize.width / 2,
        155,
        { align: "center" }
      );

      // Officiant (Shaykh) section
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("OFFICIATED BY", doc.internal.pageSize.width / 2, 165, {
        align: "center",
      });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(
        `${marriage.assignedShaykh.firstName} ${marriage.assignedShaykh.lastName}`,
        doc.internal.pageSize.width / 2,
        175,
        { align: "center" }
      );

      // Add another decorative line
      doc.setLineWidth(0.5);
      doc.line(50, 215, doc.internal.pageSize.width - 50, 215);

      // Add signature lines
      const signatureY = 230;

      // Shaykh signature
      doc.line(70, signatureY, 120, signatureY);
      doc.text("Shaykh Signature", 95, signatureY + 7, { align: "center" });

      // Official seal
      doc.line(
        doc.internal.pageSize.width - 120,
        signatureY,
        doc.internal.pageSize.width - 70,
        signatureY
      );
      doc.text(
        "Official Seal",
        doc.internal.pageSize.width - 95,
        signatureY + 7,
        { align: "center" }
      );

      // Add footer
      const footerY = doc.internal.pageSize.height - 20;

      doc.setFontSize(10);
      doc.text(
        "This certificate is an official document recognized by our Islamic institution.",
        doc.internal.pageSize.width / 2,
        footerY,
        { align: "center" }
      );
      doc.text(
        "May Allah bless this union and grant the couple happiness and prosperity.",
        doc.internal.pageSize.width / 2,
        footerY + 5,
        { align: "center" }
      );

      // Save the PDF with a specific name
      doc.save(`marriage-certificate-${marriage.certificateNumber}.pdf`);
    } catch (err) {
      console.error("Error generating certificate:", err);
      setError("Failed to generate certificate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900">Certificate</h3>
      </div>

      {marriage.certificate_generated ? (
        <div className="mt-4">
          <div className="p-4 border border-green-200 rounded-lg bg-green-50 text-green-800 flex justify-between items-center">
            <div>
              <p className="font-medium">Certificate has been generated</p>
              <p className="text-sm mt-1">
                Certificate Number: {marriage.certificateNumber}
              </p>
              <p className="text-sm">
                Issued on:{" "}
                {format(
                  new Date(marriage.certificateIssuedDate),
                  "MMMM d, yyyy"
                )}
              </p>
            </div>
            <button
              onClick={generateAndDownloadCertificate}
              disabled={isLoading}
              className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Download"}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      ) : (
        <div className="mt-4 p-4 border border-yellow-200 rounded-lg bg-yellow-50 text-yellow-800">
          <p className="font-medium">No certificate has been generated yet</p>
          <p className="text-sm mt-1">
            A certificate needs to be generated to complete this application.
          </p>
        </div>
      )}
    </div>
  );
};

const TimelineEntry = ({ date, title, icon }) => (
  <div className="flex items-start mb-6">
    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
      {icon}
    </div>
    <div className="ml-4">
      <div className="text-sm text-gray-500">{date}</div>
      <div className="text-gray-700">{title}</div>
    </div>
  </div>
);

const AdminMarriageView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [marriage, setMarriage] = useState(null);
  const [shaykhs, setShaykhs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddMeetingModalOpen, setIsAddMeetingModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    fetchMarriage();
    fetchShaykhs();
  }, [id]);

  const fetchMarriage = async () => {
    try {
      setLoading(true);
      const response = await marriageService.getMarriage(id);
      setMarriage(response.data.marriage);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch marriage details. Please try again.");
      console.error("Error fetching marriage:", err);
      setLoading(false);
    }
  };

  const fetchShaykhs = async () => {
    try {
      const response = await shaykhService.getAllShaykhs();
      setShaykhs(response.data.shaykhs);
    } catch (err) {
      console.error("Error fetching shaykhs:", err);
    }
  };

  const handleAssignShaykh = async (marriageId, shaykhId) => {
    try {
      const response = await marriageService.assignMarriage(
        marriageId,
        shaykhId
      );
      setMarriage(response.data.marriage);
      return response;
    } catch (error) {
      console.error("Error assigning shaykh:", error);
      throw error;
    }
  };

  const handleAddMeeting = async (meetingData) => {
    try {
      const response = await marriageService.addMeeting(
        marriage._id,
        meetingData
      );
      setMarriage(response.data.marriage);
      return response;
    } catch (error) {
      console.error("Error adding meeting:", error);
      throw error;
    }
  };

  const handleUpdateMeeting = async (meetingId, meetingData) => {
    try {
      const response = await marriageService.updateMeeting(
        marriage._id,
        meetingId,
        meetingData
      );
      setMarriage(response.data.marriage);
      return response;
    } catch (error) {
      console.error("Error updating meeting:", error);
      throw error;
    }
  };

  const handleUploadCertificate = async (formData) => {
    try {
      const response = await marriageService.uploadCertificate(
        marriage._id,
        formData
      );
      setMarriage(response.data.marriage);
      return response;
    } catch (error) {
      console.error("Error uploading certificate:", error);
      throw error;
    }
  };

  // Add this function to the AdminMarriageView component
  const handleGenerateCertificate = async (data) => {
    try {
      // Call the backend to update the certificate information only
      const response = await marriageService.generateCertificate(
        marriage._id,
        data
      );
      setMarriage(response.data.marriage);
      return response;
    } catch (error) {
      console.error("Error generating certificate:", error);
      throw error;
    }
  };

  // Replace canUploadCertificate check with canGenerateCertificate
  const canGenerateCertificate =
    marriage?.type === "certificate" &&
    marriage.assignedShaykh &&
    ["assigned", "in-progress"].includes(marriage.status) &&
    !marriage.certificate_generated;

  {
    canGenerateCertificate && (
      <button
        onClick={() => setIsUploadModalOpen(true)}
        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
      >
        <FaFileUpload className="mr-1.5 h-4 w-4" />
        Generate Certificate
      </button>
    );
  }
  {
    isUploadModalOpen && (
      <GenerateCertificateModal
        marriage={marriage}
        onClose={() => setIsUploadModalOpen(false)}
        onGenerateCertificate={handleGenerateCertificate} // Change from onUpload to onGenerateCertificate
      />
    );
  }

  const handleCompleteApplication = async (data) => {
    try {
      const response = await marriageService.completeMarriage(
        marriage._id,
        data
      );
      setMarriage(response.data.marriage);
      return response;
    } catch (error) {
      console.error("Error completing application:", error);
      throw error;
    }
  };

  const handleCancelApplication = async (data) => {
    try {
      const response = await marriageService.cancelMarriage(marriage._id, data);
      setMarriage(response.data.marriage);
      return response;
    } catch (error) {
      console.error("Error cancelling application:", error);
      throw error;
    }
  };

  const handleAddFeedback = async (comment) => {
    try {
      const response = await marriageService.addFeedback(marriage._id, comment);
      setMarriage(response.data.marriage);
      return response;
    } catch (error) {
      console.error("Error adding feedback:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
          <p className="mt-2 text-lg text-gray-700">
            Loading application details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !marriage) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Error Loading Application
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {error || "Application not found or unable to load details."}
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/admin/marriages")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Marriage List
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canAssign = marriage.status === "pending";
  const canAddMeeting =
    marriage.type === "reservation" &&
    marriage.assignedShaykh &&
    ["assigned", "in-progress"].includes(marriage.status);
  const canUploadCertificate =
    marriage.type === "certificate" &&
    marriage.assignedShaykh &&
    ["assigned", "in-progress"].includes(marriage.status) &&
    !marriage.certificateFile;
  const canComplete =
    marriage.assignedShaykh &&
    ["assigned", "in-progress"].includes(marriage.status);
  const canCancel =
    marriage.status !== "completed" && marriage.status !== "cancelled";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/admin/marriages")}
            className="mr-4 p-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {marriage.type === "reservation"
                ? "Marriage Reservation"
                : "Marriage Certificate"}{" "}
              Application
            </h1>
            <p className="text-sm text-gray-500">
              Application ID: {ConvertIDtoSmallID(marriage._id)}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="lg:w-2/3 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-medium text-gray-900">
                      Application Status
                    </h2>
                    <StatusBadge status={marriage.status} />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Submitted on{" "}
                    {format(new Date(marriage.createdAt), "MMMM d, yyyy")}
                  </p>
                </div>

                <div className="flex space-x-2">
                  {canAssign && (
                    <button
                      onClick={() => setIsAssignModalOpen(true)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <FaUserTie className="mr-1.5 h-4 w-4" />
                      Assign Shaykh
                    </button>
                  )}

                  {marriage.assignedShaykh &&
                    marriage.status !== "completed" &&
                    marriage.status !== "cancelled" && (
                      <button
                        onClick={() => setIsAssignModalOpen(true)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FaEdit className="mr-1.5 h-4 w-4" />
                        Reassign
                      </button>
                    )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Couple</h3>
                  <p className="mt-1 text-base">
                    {marriage.partnerOne.firstName}{" "}
                    {marriage.partnerOne.lastName} &{" "}
                    {marriage.partnerTwo.firstName}{" "}
                    {marriage.partnerTwo.lastName}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Assigned Shaykh
                  </h3>
                  <p className="mt-1 text-base">
                    {marriage.assignedShaykh ? (
                      <span className="flex items-center">
                        <FaUserTie className="mr-2 h-4 w-4 text-primary-600" />
                        {marriage.assignedShaykh.firstName}{" "}
                        {marriage.assignedShaykh.lastName}
                      </span>
                    ) : (
                      <span className="text-gray-400">Not assigned yet</span>
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <p className="mt-1 text-base capitalize">{marriage.type}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {marriage.type === "reservation"
                      ? "Preferred Date"
                      : "Marriage Date"}
                  </h3>
                  <p className="mt-1 text-base">
                    {marriage.type === "reservation" && marriage.preferredDate
                      ? format(new Date(marriage.preferredDate), "MMMM d, yyyy")
                      : marriage.type === "certificate" && marriage.marriageDate
                      ? format(new Date(marriage.marriageDate), "MMMM d, yyyy")
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {canAddMeeting && (
                  <button
                    onClick={() => setIsAddMeetingModalOpen(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <FaCalendarAlt className="mr-1.5 h-4 w-4" />
                    Schedule Meeting
                  </button>
                )}

                {canUploadCertificate && (
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <FaFileUpload className="mr-1.5 h-4 w-4" />
                    Upload Certificate
                  </button>
                )}

                {canComplete && (
                  <button
                    onClick={() => setIsCompleteModalOpen(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <FaCheck className="mr-1.5 h-4 w-4" />
                    Complete
                  </button>
                )}

                {canCancel && (
                  <button
                    onClick={() => setIsCancelModalOpen(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <FaBan className="mr-1.5 h-4 w-4" />
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Application Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <SectionTitle>Application Details</SectionTitle>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-base font-medium text-gray-700 mb-4">
                    Partner 1
                  </h4>
                  <div className="space-y-4">
                    <FieldGroup
                      label="First Name"
                      value={marriage.partnerOne.firstName}
                    />
                    <FieldGroup
                      label="Last Name"
                      value={marriage.partnerOne.lastName}
                    />
                    {marriage.type === "reservation" ? (
                      <>
                        <FieldGroup
                          label="Phone"
                          value={marriage.partnerOne.phone}
                        />
                        <FieldGroup
                          label="Email"
                          value={marriage.partnerOne.email}
                        />
                        <FieldGroup
                          label="Address"
                          value={marriage.partnerOne.address}
                        />
                      </>
                    ) : (
                      <FieldGroup
                        label="Date of Birth"
                        value={
                          marriage.partnerOne.dateOfBirth
                            ? format(
                                new Date(marriage.partnerOne.dateOfBirth),
                                "MMMM d, yyyy"
                              )
                            : "-"
                        }
                      />
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium text-gray-700 mb-4">
                    Partner 2
                  </h4>
                  <div className="space-y-4">
                    <FieldGroup
                      label="First Name"
                      value={marriage.partnerTwo.firstName}
                    />
                    <FieldGroup
                      label="Last Name"
                      value={marriage.partnerTwo.lastName}
                    />
                    {marriage.type === "reservation" ? (
                      <>
                        <FieldGroup
                          label="Phone"
                          value={marriage.partnerTwo.phone}
                        />
                        <FieldGroup
                          label="Email"
                          value={marriage.partnerTwo.email}
                        />
                        <FieldGroup
                          label="Address"
                          value={marriage.partnerTwo.address}
                        />
                      </>
                    ) : (
                      <FieldGroup
                        label="Date of Birth"
                        value={
                          marriage.partnerTwo.dateOfBirth
                            ? format(
                                new Date(marriage.partnerTwo.dateOfBirth),
                                "MMMM d, yyyy"
                              )
                            : "-"
                        }
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-base font-medium text-gray-700 mb-4">
                  {marriage.type === "reservation"
                    ? "Reservation Details"
                    : "Marriage Details"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {marriage.type === "reservation" ? (
                    <>
                      <FieldGroup
                        label="Preferred Date"
                        value={
                          marriage.preferredDate
                            ? format(
                                new Date(marriage.preferredDate),
                                "MMMM d, yyyy"
                              )
                            : "-"
                        }
                      />
                      <FieldGroup
                        label="Preferred Time"
                        value={marriage.preferredTime}
                      />
                      <FieldGroup
                        label="Preferred Location"
                        value={marriage.preferredLocation}
                      />
                    </>
                  ) : (
                    <>
                      <FieldGroup
                        label="Marriage Date"
                        value={
                          marriage.marriageDate
                            ? format(
                                new Date(marriage.marriageDate),
                                "MMMM d, yyyy"
                              )
                            : "-"
                        }
                      />
                      <FieldGroup
                        label="Marriage Place"
                        value={marriage.marriagePlace}
                      />
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Witnesses
                        </h4>
                        {marriage.witnesses && marriage.witnesses.length > 0 ? (
                          <div className="space-y-2">
                            {marriage.witnesses.map((witness, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 px-4 py-2 rounded-md border border-gray-200 text-gray-900"
                              >
                                {witness.name}{" "}
                                {witness.contact && `- ${witness.contact}`}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No witnesses provided</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {marriage.additionalInformation && (
                <div className="mt-6">
                  <h4 className="text-base font-medium text-gray-700 mb-2">
                    Additional Information
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <p className="text-gray-900">
                      {marriage.additionalInformation}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Meetings List - Only for reservation type */}
            {marriage.type === "reservation" && (
              <div className="space-y-6">
                <MeetingsList
                  meetings={marriage.meetings || []}
                  onUpdateMeeting={handleUpdateMeeting}
                />
              </div>
            )}

            {/* Certificate View - Only for certificate type */}
            {marriage.type === "certificate" && (
              <CertificateView marriage={marriage} />
            )}

            {/* Feedback Section */}
            <FeedbackSection
              feedbacks={marriage.feedback || []}
              onAddFeedback={handleAddFeedback}
            />
          </div>

          {/* Right Column */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Application Timeline
              </h3>

              <div className="space-y-6">
                <TimelineEntry
                  date={format(new Date(marriage.createdAt), "MMMM d, yyyy")}
                  title="Application Submitted"
                  icon={<FaFileUpload className="h-5 w-5 text-primary-600" />}
                />

                {marriage.assignedShaykh && (
                  <TimelineEntry
                    date={format(new Date(marriage.updatedAt), "MMMM d, yyyy")}
                    title={`Assigned to ${marriage.assignedShaykh.firstName} ${marriage.assignedShaykh.lastName}`}
                    icon={<FaUserTie className="h-5 w-5 text-primary-600" />}
                  />
                )}

                {marriage.type === "reservation" &&
                  marriage.meetings &&
                  marriage.meetings?.meetings?.length > 0 &&
                  marriage.meetings[0] && (
                    <TimelineEntry
                      date={format(
                        new Date(marriage.meetings[0].date),
                        "MMMM d, yyyy"
                      )}
                      title="First Meeting Scheduled"
                      icon={
                        <FaCalendarAlt className="h-5 w-5 text-primary-600" />
                      }
                    />
                  )}

                {marriage.type === "certificate" &&
                  marriage.certificateFile && (
                    <TimelineEntry
                      date={format(
                        new Date(marriage.certificateIssuedDate),
                        "MMMM d, yyyy"
                      )}
                      title="Certificate Issued"
                      icon={
                        <FaFileUpload className="h-5 w-5 text-primary-600" />
                      }
                    />
                  )}

                {marriage.status === "completed" && (
                  <TimelineEntry
                    date={format(new Date(marriage.updatedAt), "MMMM d, yyyy")}
                    title="Application Completed"
                    icon={<FaCheck className="h-5 w-5 text-green-600" />}
                  />
                )}

                {marriage.status === "cancelled" && (
                  <TimelineEntry
                    date={format(new Date(marriage.updatedAt), "MMMM d, yyyy")}
                    title="Application Cancelled"
                    icon={<FaBan className="h-5 w-5 text-red-600" />}
                  />
                )}
              </div>

              {marriage.adminNotes && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">
                    Admin Notes
                  </h4>
                  <p className="text-sm text-yellow-800">
                    {marriage.adminNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAssignModalOpen && (
        <AssignShaykhModal
          marriage={marriage}
          shaykhs={shaykhs}
          onClose={() => setIsAssignModalOpen(false)}
          onAssign={handleAssignShaykh}
        />
      )}

      {isAddMeetingModalOpen && (
        <AddMeetingModal
          marriage={marriage}
          onClose={() => setIsAddMeetingModalOpen(false)}
          onAddMeeting={handleAddMeeting}
        />
      )}

      {isUploadModalOpen && (
        <GenerateCertificateModal
          marriage={marriage}
          onClose={() => setIsUploadModalOpen(false)}
          onGenerateCertificate={handleGenerateCertificate} // This is correct
        />
      )}

      {isCompleteModalOpen && (
        <CompleteApplicationModal
          marriage={marriage}
          onClose={() => setIsCompleteModalOpen(false)}
          onComplete={handleCompleteApplication}
        />
      )}

      {isCancelModalOpen && (
        <CancelApplicationModal
          marriage={marriage}
          onClose={() => setIsCancelModalOpen(false)}
          onCancel={handleCancelApplication}
        />
      )}
    </div>
  );
};

export default AdminMarriageView;
