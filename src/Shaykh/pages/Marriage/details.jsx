import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import marriageService from "../../../User/services/marriageServices";
import { format } from "date-fns";
import {
  FaCalendarAlt,
  FaFileUpload,
  FaArrowLeft,
  FaEdit,
  FaCheck,
  FaPlus,
  FaUserAlt,
  FaComments,
} from "react-icons/fa";
import ConvertIDtoSmallID from "../../../utils/IDconversion";

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
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Any additional details..."
              ></textarea>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
              className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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

const UploadCertificateModal = ({ marriage, onClose, onUploadCertificate }) => {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !certificateNumber) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("certificate", file);
    formData.append("certificateNumber", certificateNumber);

    try {
      await onUploadCertificate(formData);
      onClose();
    } catch (error) {
      alert("Failed to upload certificate. Please try again.");
      console.error("Error uploading certificate:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Upload Certificate
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certificate File
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <FaFileUpload className="w-8 h-8 text-gray-400" />
                    <p className="pt-1 text-sm text-gray-600">
                      {file ? file.name : "Upload a certificate file"}
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, or PNG up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={!file || !certificateNumber || loading}
            >
              {loading ? "Uploading..." : "Upload Certificate"}
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
                Completion Notes (Required)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Add your final notes about this application..."
                required
              ></textarea>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading || !notes.trim()}
            >
              {loading ? "Completing..." : "Complete Application"}
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
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                      Shaykh
                    </span>
                  )}
                  {feedback.user.role === "admin" && (
                    <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                  {feedback.user.role === "user" && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                      User
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
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          placeholder="Add a message or note for the couple or admin..."
          rows={3}
          required
        ></textarea>
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="text-green-600 hover:text-green-900"
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

const CertificateView = ({ marriage }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900">Certificate</h3>
      </div>

      {marriage.certificateFile ? (
        <div className="mt-4">
          <div className="p-4 border border-green-200 rounded-lg bg-green-50 text-green-800 flex justify-between items-center">
            <div>
              <p className="font-medium">Certificate has been uploaded</p>
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
            <a
              href={`/uploads/certificates/${marriage.certificateFile}`}
              download
              className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              Download
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-4 border border-yellow-200 rounded-lg bg-yellow-50 text-yellow-800">
          <p className="font-medium">No certificate has been uploaded yet</p>
          <p className="text-sm mt-1">
            A certificate needs to be uploaded to complete this application.
          </p>
        </div>
      )}
    </div>
  );
};

const TimelineEntry = ({ date, title, icon }) => (
  <div className="flex items-start mb-6">
    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
      {icon}
    </div>
    <div className="ml-4">
      <div className="text-sm text-gray-500">{date}</div>
      <div className="text-gray-700">{title}</div>
    </div>
  </div>
);

const ShaykhMarriageView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [marriage, setMarriage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isAddMeetingModalOpen, setIsAddMeetingModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  useEffect(() => {
    fetchMarriage();
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
          <div className="inline-block animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full" />
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
              onClick={() => navigate("/shaykh/marriages")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Back to Marriage List
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canAddMeeting =
    marriage.type === "reservation" &&
    ["assigned", "in-progress"].includes(marriage.status);
  const canUploadCertificate =
    marriage.type === "certificate" &&
    ["assigned", "in-progress"].includes(marriage.status) &&
    !marriage.certificateFile;
  const canComplete = ["assigned", "in-progress"].includes(marriage.status);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/shaykh/marriages")}
            className="mr-4 p-2 text-gray-600 hover:text-green-600 transition-colors"
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
                    Assigned on{" "}
                    {format(new Date(marriage.createdAt), "MMMM d, yyyy")}
                  </p>
                </div>

                <div className="flex space-x-2">
                  {canAddMeeting && (
                    <button
                      onClick={() => setIsAddMeetingModalOpen(true)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <FaCalendarAlt className="mr-1.5 h-4 w-4" />
                      Schedule Meeting
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
                    Requested By
                  </h3>
                  <p className="mt-1 text-base">
                    <span className="flex items-center">
                      <FaUserAlt className="mr-2 h-4 w-4 text-green-600" />
                      {marriage.user.username} ({marriage.user.email})
                    </span>
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
                  icon={<FaFileUpload className="h-5 w-5 text-green-600" />}
                />

                <TimelineEntry
                  date={format(new Date(marriage.updatedAt), "MMMM d, yyyy")}
                  title="Assigned to You"
                  icon={<FaUserAlt className="h-5 w-5 text-green-600" />}
                />

                {marriage.type === "reservation" &&
                  marriage.meetings &&
                  marriage.meetings.length > 0 &&
                  marriage.meetings[0] && (
                    <TimelineEntry
                      date={format(
                        new Date(marriage.meetings[0].date),
                        "MMMM d, yyyy"
                      )}
                      title="First Meeting Scheduled"
                      icon={
                        <FaCalendarAlt className="h-5 w-5 text-green-600" />
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
                      icon={<FaFileUpload className="h-5 w-5 text-green-600" />}
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
                    icon={<FaCheck className="h-5 w-5 text-red-600" />}
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

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Shaykh Actions Guide
                </h4>
                {marriage.type === "reservation" ? (
                  <ul className="text-sm text-blue-800 list-disc pl-5 space-y-2">
                    <li>
                      Schedule a meeting with the couple using the "Schedule
                      Meeting" button
                    </li>
                    <li>
                      Update meeting status after conducting or rescheduling
                    </li>
                    <li>Add detailed notes for meeting outcomes</li>
                    <li>
                      Use the Communication section to share information with
                      the couple
                    </li>
                    <li>
                      Complete the application when all requirements are
                      fulfilled
                    </li>
                  </ul>
                ) : (
                  <ul className="text-sm text-blue-800 list-disc pl-5 space-y-2">
                    <li>Review the marriage certificate application details</li>
                    <li>
                      Upload the completed certificate using the "Upload
                      Certificate" button
                    </li>
                    <li>Ensure you provide a valid certificate number</li>
                    <li>
                      Use the Communication section to request any missing
                      information
                    </li>
                    <li>
                      Complete the application when the certificate is uploaded
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAddMeetingModalOpen && (
        <AddMeetingModal
          marriage={marriage}
          onClose={() => setIsAddMeetingModalOpen(false)}
          onAddMeeting={handleAddMeeting}
        />
      )}

      {isUploadModalOpen && (
        <UploadCertificateModal
          marriage={marriage}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadCertificate={handleUploadCertificate}
        />
      )}

      {isCompleteModalOpen && (
        <CompleteApplicationModal
          marriage={marriage}
          onClose={() => setIsCompleteModalOpen(false)}
          onComplete={handleCompleteApplication}
        />
      )}
    </div>
  );
};

export default ShaykhMarriageView;
