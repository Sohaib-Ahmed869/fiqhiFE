import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Check,
  Calendar,
  MessageCircle,
  User,
  Clock,
  MapPin,
  X,
  FileText,
  ArrowLeft,
  Mail,
  Phone,
  AlertCircle,
  Edit,
  PlusCircle,
} from "lucide-react";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import shaykh from "../../../assets/shaykh.png";
import googleCalendar from "../../../assets/googleCalendar.png";
import { useAuth } from "../../../Contexts/AuthContext";
import ConvertIDtoSmallID from "../../../utils/IDconversion";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 md:p-0">
      <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

const ScheduleMeetingModal = ({
  isOpen,
  onClose,
  onSubmit,
  reconciliationId,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.time || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        `/reconciliations/meetings/${reconciliationId}`,
        formData
      );
      toast.success("Meeting scheduled successfully!");
      onSubmit(res.data.reconciliation);
      onClose();
    } catch (err) {
      console.error(
        "Error scheduling meeting:",
        err.response?.data?.error || err.message
      );
      toast.error(err.response?.data?.error || "Failed to schedule meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mb-8 pt-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Schedule Meeting
        </h2>
        <p className="text-sm text-gray-500">
          Arrange a meeting with all parties involved
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5 mb-6">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              required
            />

          </div>

          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Time<span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              required
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Physical address or online meeting link"
              required
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Meeting Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Any additional information about the meeting"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              "Scheduling..."
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                Schedule Meeting
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const AddFeedbackModal = ({ isOpen, onClose, onSubmit, reconciliationId }) => {
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        `/reconciliations/feedback/${reconciliationId}`,
        { comment }
      );
      toast.success("Feedback submitted successfully!");
      onSubmit(res.data.reconciliation);
      setComment("");
      onClose();
    } catch (err) {
      console.error(
        "Error submitting feedback:",
        err.response?.data?.error || err.message
      );
      toast.error(err.response?.data?.error || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mb-6 pt-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Add Feedback
        </h2>
        <p className="text-sm text-gray-500">
          Share your thoughts or questions about this case
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Feedback<span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="5"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Enter your comments or questions here"
            required
          ></textarea>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              "Submitting..."
            ) : (
              <>
                <MessageCircle className="w-4 h-4" />
                Submit Feedback
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const CompleteReconciliationModal = ({
  isOpen,
  onClose,
  onSubmit,
  reconciliationId,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    outcome: "",
    outcomeDetails: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.outcome) {
      toast.error("Please select an outcome");
      return;
    }

    setLoading(true);
    try {
      const res = await api.put(
        `/reconciliations/complete/${reconciliationId}`,
        formData
      );
      toast.success("Reconciliation completed successfully!");
      onSubmit(res.data.reconciliation);
      onClose();
    } catch (err) {
      console.error(
        "Error completing reconciliation:",
        err.response?.data?.error || err.message
      );
      toast.error(
        err.response?.data?.error || "Failed to complete reconciliation"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mb-6 pt-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Complete Reconciliation
        </h2>
        <p className="text-sm text-gray-500">
          Mark this case as resolved or unresolved
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Outcome<span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <div className="flex items-center p-3 border rounded-md border-gray-200 hover:border-green-500 cursor-pointer transition-colors">
                <input
                  type="radio"
                  id="resolved"
                  name="outcome"
                  value="resolved"
                  checked={formData.outcome === "resolved"}
                  onChange={handleChange}
                  className="mr-3 h-4 w-4 text-green-600"
                  required
                />
                <label htmlFor="resolved" className="flex-1 cursor-pointer">
                  <span className="text-sm font-medium text-gray-900 block">
                    Resolved
                  </span>
                  <span className="text-xs text-gray-500 block mt-1">
                    Reconciliation was successful
                  </span>
                </label>
                <Check
                  className={`h-5 w-5 ${
                    formData.outcome === "resolved"
                      ? "text-green-600"
                      : "text-gray-300"
                  }`}
                />
              </div>

              <div className="flex items-center p-3 border rounded-md border-gray-200 hover:border-red-500 cursor-pointer transition-colors">
                <input
                  type="radio"
                  id="unresolved"
                  name="outcome"
                  value="unresolved"
                  checked={formData.outcome === "unresolved"}
                  onChange={handleChange}
                  className="mr-3 h-4 w-4 text-red-600"
                />
                <label htmlFor="unresolved" className="flex-1 cursor-pointer">
                  <span className="text-sm font-medium text-gray-900 block">
                    Unresolved
                  </span>
                  <span className="text-xs text-gray-500 block mt-1">
                    Reconciliation was unsuccessful
                  </span>
                </label>
                <X
                  className={`h-5 w-5 ${
                    formData.outcome === "unresolved"
                      ? "text-red-600"
                      : "text-gray-300"
                  }`}
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="outcomeDetails"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Outcome Details
            </label>
            <textarea
              id="outcomeDetails"
              name="outcomeDetails"
              value={formData.outcomeDetails}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Provide details about the outcome of the reconciliation"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <Check className="w-4 h-4" />
                Complete Reconciliation
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const AddShaykhNotesModal = ({
  isOpen,
  onClose,
  onSubmit,
  reconciliationId,
  currentNotes,
}) => {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(currentNotes || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!notes.trim()) {
      toast.error("Please enter your notes");
      return;
    }

    setLoading(true);
    try {
      const res = await api.put(`/reconciliations/notes/${reconciliationId}`, {
        notes,
      });
      toast.success("Notes updated successfully!");
      onSubmit(res.data.reconciliation);
      onClose();
    } catch (err) {
      console.error(
        "Error updating notes:",
        err.response?.data?.error || err.message
      );
      toast.error(err.response?.data?.error || "Failed to update notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mb-6 pt-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Shaykh Notes
        </h2>
        <p className="text-sm text-gray-500">
          Private notes for this case that only shayks and admins can view
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Case Notes<span className="text-red-500">*</span>
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="8"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Enter your detailed notes about this reconciliation case"
            required
          ></textarea>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Save Notes
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const CancelReconciliationModal = ({
  isOpen,
  onClose,
  onSubmit,
  reconciliationId,
}) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !window.confirm(
        "Are you sure you want to cancel this reconciliation case?"
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await api.put(`/reconciliations/cancel/${reconciliationId}`, {
        reason,
      });
      toast.success("Reconciliation cancelled successfully!");
      onSubmit(res.data.reconciliation);
      onClose();
    } catch (err) {
      console.error(
        "Error cancelling reconciliation:",
        err.response?.data?.error || err.message
      );
      toast.error(
        err.response?.data?.error || "Failed to cancel reconciliation"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mb-6 pt-4">
        <h2 className="text-xl font-semibold text-red-600 mb-1">
          Cancel Reconciliation
        </h2>
        <p className="text-sm text-gray-500">This action cannot be undone</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <p className="text-sm text-red-700">
                Are you sure you want to cancel this reconciliation case? This
                action cannot be undone.
              </p>
            </div>
          </div>

          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Reason for Cancellation<span className="text-red-500">*</span>
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            placeholder="Please provide a reason for cancellation"
            required
          ></textarea>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              "Cancelling..."
            ) : (
              <>
                <X className="w-4 h-4" />
                Cancel Reconciliation
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const StatusBadge = ({ status }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "assigned":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "unresolved":
        return "bg-red-100 text-red-800 border-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(
        status
      )}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const MeetingCard = ({
  meeting,
  formatDate,
  formatTime,
  handleAddToCalendar,
  shaykh,
  isUpcoming,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getMeetingStatusBadgeClass = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "rescheduled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      className={`rounded-lg p-4 mb-3 border ${
        isUpcoming ? "border-green-100 bg-green-50" : "border-gray-200"
      }`}
    >
      <div className="flex items-start gap-2">
        <div
          className={`p-2 rounded-full ${
            isUpcoming ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          <Calendar
            className={`h-5 w-5 ${
              isUpcoming ? "text-green-700" : "text-gray-500"
            }`}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-900">
              {formatDate(meeting.date)} at {formatTime(meeting.time)}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getMeetingStatusBadgeClass(
                meeting.status
              )}`}
            >
              {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            {meeting.location}
          </div>

          {meeting.notes && (
            <>
              <button
                className="text-xs text-green-700 font-medium mb-2 flex items-center"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Hide details" : "View details"}
                <ChevronDown
                  className={`h-3 w-3 ml-1 transition-transform ${
                    isExpanded ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="text-sm text-gray-600 mb-2 p-2 bg-white rounded border border-gray-100">
                  {meeting.notes}
                </div>
              )}
            </>
          )}

          {isUpcoming && (
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => handleAddToCalendar(meeting)}
                className="text-xs px-3 py-1 bg-white border border-green-600 text-green-700 rounded hover:bg-green-50 transition-colors flex items-center gap-1"
              >
                <Calendar className="h-3 w-3" />
                Add to Calendar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const IntegratedReconciliationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reconciliation, setReconciliation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Modal states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    fetchReconciliation();
  }, [id]);

  const fetchReconciliation = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/reconciliations/${id}`);
      setReconciliation(res.data.reconciliation);
      return res.data.reconciliation;
    } catch (err) {
      console.error("Error fetching reconciliation:", err);
      toast.error("Failed to load reconciliation details");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const handleModalSubmit = async () => {
    const updatedReconciliation = await fetchReconciliation();
    setReconciliation(updatedReconciliation);
  };

  const handleAddToCalendar = (meeting) => {
    // In a real implementation, this would generate a Google Calendar event link
    // For now, we'll just show a success message
    toast.success("Added to Google Calendar!");
  };

  // Determine if user can complete the reconciliation
  const canCompleteReconciliation = () => {
    if (!reconciliation || !currentUser) return false;

    // Only admin or assigned shaykh can complete
    if (
      currentUser.role !== "admin" &&
      (!reconciliation.assignedShaykh ||
        reconciliation.assignedShaykh._id !== currentUser._id)
    ) {
      return false;
    }

    // Can't complete if already resolved, unresolved or cancelled
    if (
      reconciliation.status === "resolved" ||
      reconciliation.status === "unresolved" ||
      reconciliation.status === "cancelled"
    ) {
      return false;
    }

    return true;
  };

  // Determine if user can schedule a meeting
  const canScheduleMeeting = () => {
    if (!reconciliation || !currentUser) return false;

    // Now both regular users, admin, or assigned shaykh can schedule meetings
    if (
      reconciliation.status === "resolved" ||
      reconciliation.status === "unresolved" ||
      reconciliation.status === "cancelled"
    ) {
      return false;
    }

    return true;
  };

  // Determine if user can cancel the reconciliation
  const canCancelReconciliation = () => {
    if (!reconciliation || !currentUser) return false;
  
    // Only admin or the user who created it can cancel
    if (currentUser.role !== "admin" && reconciliation.user._id !== currentUser._id) {
      return false;
    }
  
    // Cannot cancel if already completed or cancelled
    if (
      reconciliation.status === "resolved" ||
      reconciliation.status === "unresolved" ||
      reconciliation.status === "cancelled"
    ) {
      return false;
    }
  
    return true;
  };
  

  // Determine if user can add shaykh notes
  const canAddShaykhNotes = () => {
    if (!reconciliation || !currentUser) return false;

    // Only admin or assigned shaykh can add notes
    if (
      currentUser.role !== "admin" &&
      (!reconciliation.assignedShaykh ||
        reconciliation.assignedShaykh._id !== currentUser._id)
    ) {
      return false;
    }

    return true;
  };

  // Get upcoming meetings
  const getUpcomingMeetings = () => {
    if (!reconciliation || !reconciliation.meetings) return [];

    const now = new Date();
    return reconciliation.meetings
      .filter((m) => {
        const meetingDate = new Date(m.date);
        return m.status === "scheduled" && meetingDate >= now;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Get past meetings
  const getPastMeetings = () => {
    if (!reconciliation || !reconciliation.meetings) return [];

    const now = new Date();
    return reconciliation.meetings
      .filter((m) => {
        const meetingDate = new Date(m.date);
        return meetingDate < now || m.status !== "scheduled";
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
  };

  const upcomingMeetings = reconciliation ? getUpcomingMeetings() : [];
  const pastMeetings = reconciliation ? getPastMeetings() : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          <p className="mt-2 text-gray-600">
            Loading reconciliation details...
          </p>
        </div>
      </div>
    );
  }

  if (!reconciliation) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto text-center bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            Reconciliation Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The requested reconciliation could not be found or you don't have
            permission to view it.
          </p>
          <button
            onClick={() => navigate("/user/reconciliation-queries")}
            className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reconciliation Queries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/user/reconciliation-queries")}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Reconciliation Case
                </h1>
                <StatusBadge status={reconciliation.status} />
              </div>
              <p className="text-sm text-gray-500 mt-1 pl-7">
                Case ID: {ConvertIDtoSmallID(reconciliation._id)}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              {canScheduleMeeting() && (
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 transition-colors flex items-center gap-2 flex-1 md:flex-none justify-center"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Meeting
                </button>
              )}

              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 flex-1 md:flex-none justify-center"
              >
                <MessageCircle className="h-4 w-4" />
                Add Feedback
              </button>

              {canAddShaykhNotes() && (
                <button
                  onClick={() => setIsNotesModalOpen(true)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 flex-1 md:flex-none justify-center"
                >
                  <FileText className="h-4 w-4" />
                  Shaykh Notes
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Case details */}
          <div className="lg:col-span-2">
            {/* Case Overview */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Case Overview
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                      <User className="h-5 w-5 mr-2 text-gray-500" />
                      Husband Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Name</span>
                        <span className="text-sm font-medium">
                          {reconciliation.husband.firstName}{" "}
                          {reconciliation.husband.lastName}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Phone</span>
                        <span className="text-sm flex items-center">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {reconciliation.husband.phone}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Email</span>
                        <span className="text-sm flex items-center">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {reconciliation.husband.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                      <User className="h-5 w-5 mr-2 text-gray-500" />
                      Wife Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Name</span>
                        <span className="text-sm font-medium">
                          {reconciliation.wife.firstName}{" "}
                          {reconciliation.wife.lastName}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Phone</span>
                        <span className="text-sm flex items-center">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {reconciliation.wife.phone}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Email</span>
                        <span className="text-sm flex items-center">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {reconciliation.wife.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
                  <h3 className="text-md font-medium text-gray-800 mb-3">
                    Issue Description
                  </h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {reconciliation.issueDescription}
                  </p>
                </div>

                {reconciliation.additionalInformation && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
                    <h3 className="text-md font-medium text-gray-800 mb-3">
                      Additional Information
                    </h3>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {reconciliation.additionalInformation}
                    </p>
                  </div>
                )}

                {reconciliation.assignedShaykh && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
                    <h3 className="text-md font-medium text-gray-800 mb-3">
                      Assigned Shaykh
                    </h3>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-medium text-lg mr-3">
                        {reconciliation.assignedShaykh.firstName?.charAt(0) ||
                          "S"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {reconciliation.assignedShaykh.firstName}{" "}
                          {reconciliation.assignedShaykh.lastName}
                        </p>
                        {reconciliation.assignedShaykh.email && (
                          <p className="text-xs text-gray-500">
                            {reconciliation.assignedShaykh.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {reconciliation.shaykhNotes && canAddShaykhNotes() && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-md font-medium text-gray-800">
                        Shaykh Notes
                      </h3>
                      <button
                        onClick={() => setIsNotesModalOpen(true)}
                        className="text-xs text-green-700 flex items-center hover:text-green-800"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {reconciliation.shaykhNotes}
                    </p>
                  </div>
                )}

                {(reconciliation.status === "resolved" ||
                  reconciliation.status === "unresolved") &&
                  reconciliation.outcomeDetails && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <h3 className="text-md font-medium text-gray-800 mb-3">
                        Outcome Details
                      </h3>
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {reconciliation.outcomeDetails}
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Upcoming Meetings - Now showing this in main column for better visibility */}
            {upcomingMeetings.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="p-4 md:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-800">
                      Upcoming Meetings
                    </h2>
                    {canScheduleMeeting() && (
                      <button
                        onClick={() => setIsScheduleModalOpen(true)}
                        className="text-sm text-green-700 flex items-center hover:text-green-800"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Schedule New
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {upcomingMeetings.map((meeting) => (
                      <MeetingCard
                        key={meeting._id}
                        meeting={meeting}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        handleAddToCalendar={handleAddToCalendar}
                        shaykh={reconciliation.assignedShaykh}
                        isUpcoming={true}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Past Meetings */}
            {pastMeetings.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="p-4 md:p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">
                    Meeting History
                  </h2>

                  <div className="space-y-2">
                    {pastMeetings.map((meeting) => (
                      <MeetingCard
                        key={meeting._id}
                        meeting={meeting}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        handleAddToCalendar={handleAddToCalendar}
                        shaykh={reconciliation.assignedShaykh}
                        isUpcoming={false}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Section */}
            <div className="bg-white rounded-lg shadow-sm mb-6 lg:mb-0">
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-800">
                    Feedback
                  </h2>
                  <button
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="text-sm text-green-700 flex items-center hover:text-green-800"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Feedback
                  </button>
                </div>

                {reconciliation.feedback &&
                reconciliation.feedback.length > 0 ? (
                  <div className="space-y-4">
                    {reconciliation.feedback.map((item) => (
                      <div
                        key={item._id}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-medium text-sm mr-2">
                              {item.user.firstName?.charAt(0) ||
                                item.user.username?.charAt(0) ||
                                "U"}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {item.user.firstName || item.user.username}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.user.role.charAt(0).toUpperCase() +
                                  item.user.role.slice(1)}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            {formatDate(item.date)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 pl-10">
                          {item.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <MessageCircle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No feedback yet.</p>
                    <button
                      onClick={() => setIsFeedbackModalOpen(true)}
                      className="mt-2 text-sm text-green-700 hover:text-green-800"
                    >
                      Add the first feedback
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Actions and case info */}
          <div className="lg:col-span-1">
            {/* Action Buttons for smaller screens */}
            {(canCompleteReconciliation() ||
              canCancelReconciliation() ||
              (!upcomingMeetings.length && canScheduleMeeting())) && (
              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="p-4 md:p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">
                    Actions
                  </h2>
                  <div className="space-y-3">
                    {!upcomingMeetings.length && canScheduleMeeting() && (
                      <button
                        onClick={() => setIsScheduleModalOpen(true)}
                        className="w-full px-4 py-3 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Schedule Meeting
                      </button>
                    )}

                    {canCompleteReconciliation() && (
                      <button
                        onClick={() => setIsCompleteModalOpen(true)}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Complete Reconciliation
                      </button>
                    )}

                    {canCancelReconciliation() && (
                      <button
                        onClick={() => setIsCancelModalOpen(true)}
                        className="w-full px-4 py-3 border border-red-300 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel Reconciliation
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Case Information */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-4 md:p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Case Information
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <StatusBadge status={reconciliation.status} />
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Submitted by</span>
                    <span className="text-sm font-medium">
                      {reconciliation.user.firstName ||
                        reconciliation.user.username}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Submission date
                    </span>
                    <span className="text-sm font-medium">
                      {formatDate(reconciliation.createdAt)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Last updated</span>
                    <span className="text-sm font-medium">
                      {formatDate(
                        reconciliation.updatedAt || reconciliation.createdAt
                      )}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <span className="text-sm text-gray-500 block mb-1">
                      Case ID
                    </span>
                    <span className="text-sm font-mono bg-gray-50 p-2 rounded block overflow-x-auto">
                      {ConvertIDtoSmallID(reconciliation._id)}
                    </span>
                  </div>

                  {reconciliation.priority && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Priority</span>
                      <span className="text-sm font-medium capitalize">
                        {reconciliation.priority}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* If no upcoming meetings are scheduled */}
            {upcomingMeetings.length === 0 && canScheduleMeeting() && (
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 text-center border-2 border-dashed border-green-100">
                <Calendar className="h-10 w-10 text-green-600 mx-auto mb-2" />
                <h3 className="text-md font-medium text-gray-800 mb-1">
                  No Upcoming Meetings
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Schedule a meeting to facilitate the reconciliation process
                </p>
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Meeting
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSubmit={handleModalSubmit}
        reconciliationId={id}
      />

      <AddFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleModalSubmit}
        reconciliationId={id}
      />

      <CompleteReconciliationModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onSubmit={handleModalSubmit}
        reconciliationId={id}
      />

      <AddShaykhNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        onSubmit={handleModalSubmit}
        reconciliationId={id}
        currentNotes={reconciliation.shaykhNotes}
      />

      <CancelReconciliationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onSubmit={handleModalSubmit}
        reconciliationId={id}
      />
    </div>
  );
};

export default IntegratedReconciliationDetail;
