import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  ChevronLeft,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Pencil,
  X,
  Plus,
  ArrowRight,
  FileText,
  MessageSquare,
  Tag,
  Activity,
  Flag,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import ConvertIDtoSmallID from "../../utils/IDconversion";

// Modal components
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {children.props.title || "Modal"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const AssignShaykhModal = ({
  title,
  reconciliationId,
  shaykhsList,
  onSubmit,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedShaykh, setSelectedShaykh] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedShaykh) {
      toast.error("Please select a Shaykh");
      return;
    }

    setLoading(true);
    try {
      const res = await api.put(`/reconciliations/assign/${reconciliationId}`, {
        shaykhId: selectedShaykh,
      });
      toast.success("Reconciliation case assigned successfully!");
      onSubmit(res.data.reconciliation);
    } catch (err) {
      console.error(
        "Error assigning case:",
        err.response?.data?.error || err.message
      );
      toast.error(err.response?.data?.error || "Failed to assign case");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} title={title}>
      <div className="mb-6">
        <label
          htmlFor="shaykhId"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Shaykh
        </label>
        <select
          id="shaykhId"
          value={selectedShaykh}
          onChange={(e) => setSelectedShaykh(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
          required
        >
          <option value="">-- Select a Shaykh --</option>
          {shaykhsList.map((shaykh) => (
            <option key={shaykh._id} value={shaykh._id}>
              {shaykh.firstName} {shaykh.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={loading || !selectedShaykh}
          className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Assigning..." : "Assign Shaykh"}
        </button>
      </div>
    </form>
  );
};

const ScheduleMeetingModal = ({ title, reconciliationId, onSubmit }) => {
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
    <form onSubmit={handleSubmit} title={title}>
      <div className="space-y-4 mb-6">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date*
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Time*
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location*
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Meeting location"
            required
          />
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Any additional notes about the meeting"
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Scheduling..." : "Schedule Meeting"}
        </button>
      </div>
    </form>
  );
};

const UpdateMeetingModal = ({ title, reconciliationId, meeting, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: meeting.date
      ? new Date(meeting.date).toISOString().split("T")[0]
      : "",
    time: meeting.time || "",
    location: meeting.location || "",
    notes: meeting.notes || "",
    status: meeting.status || "scheduled",
    completedNotes: meeting.completedNotes || "",
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
      const res = await api.put(
        `/reconciliations/meetings/${reconciliationId}/${meeting._id}`,
        formData
      );
      toast.success("Meeting updated successfully!");
      onSubmit(res.data.reconciliation);
    } catch (err) {
      console.error(
        "Error updating meeting:",
        err.response?.data?.error || err.message
      );
      toast.error(err.response?.data?.error || "Failed to update meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} title={title}>
      <div className="space-y-4 mb-6">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date*
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Time*
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location*
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Meeting location"
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
            rows="2"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Any additional notes about the meeting"
          ></textarea>
        </div>

        {formData.status === "completed" && (
          <div>
            <label
              htmlFor="completedNotes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Completion Notes
            </label>
            <textarea
              id="completedNotes"
              name="completedNotes"
              value={formData.completedNotes}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Notes about the meeting outcome"
            ></textarea>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Meeting"}
        </button>
      </div>
    </form>
  );
};

const AddShaykhNotesModal = ({
  title,
  reconciliationId,
  currentNotes,
  onSubmit,
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
    <form onSubmit={handleSubmit} title={title}>
      <div className="mb-6">
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Case Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="8"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter detailed notes about this reconciliation case"
          required
        ></textarea>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Notes"}
        </button>
      </div>
    </form>
  );
};

const CompleteReconciliationModal = ({ title, reconciliationId, onSubmit }) => {
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
    <form onSubmit={handleSubmit} title={title}>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Outcome*
          </label>
          <div className="space-y-3">
            <div className="flex items-start">
              <input
                type="radio"
                id="resolved"
                name="outcome"
                value="resolved"
                checked={formData.outcome === "resolved"}
                onChange={handleChange}
                className="mt-1 mr-2"
                required
              />
              <div>
                <label
                  htmlFor="resolved"
                  className="text-sm font-medium text-gray-700"
                >
                  Resolved - Reconciliation successful
                </label>
                <p className="text-xs text-gray-500">
                  The couple has reached a resolution and the case can be marked
                  as successfully resolved.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="radio"
                id="unresolved"
                name="outcome"
                value="unresolved"
                checked={formData.outcome === "unresolved"}
                onChange={handleChange}
                className="mt-1 mr-2"
              />
              <div>
                <label
                  htmlFor="unresolved"
                  className="text-sm font-medium text-gray-700"
                >
                  Unresolved - Reconciliation unsuccessful
                </label>
                <p className="text-xs text-gray-500">
                  The reconciliation attempts were not successful and the case
                  will be closed as unresolved.
                </p>
              </div>
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
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Provide detailed information about the outcome of the reconciliation"
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Complete Reconciliation"}
        </button>
      </div>
    </form>
  );
};

const CancelReconciliationModal = ({ title, reconciliationId, onSubmit }) => {
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
    <form onSubmit={handleSubmit} title={title}>
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Are you sure you want to cancel this reconciliation case? This action
          cannot be undone.
        </p>
        <label
          htmlFor="reason"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Reason for Cancellation
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows="3"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Please provide a reason for cancellation"
          required
        ></textarea>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Cancelling..." : "Cancel Reconciliation"}
        </button>
      </div>
    </form>
  );
};

const AddFeedbackModal = ({ title, reconciliationId, onSubmit }) => {
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
    <form onSubmit={handleSubmit} title={title}>
      <div className="mb-6">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Your Feedback
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="5"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter your comments, questions, or feedback about this case"
          required
        ></textarea>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </form>
  );
};

const EditPriorityModal = ({
  title,
  reconciliationId,
  currentPriority,
  onSubmit,
}) => {
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState(currentPriority || "medium");
  const [adminNotes, setAdminNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      // In a real implementation, you would have an API endpoint for updating priority
      // This is a mockup of how it might work
      const res = await api.put(`/reconciliations/${reconciliationId}`, {
        priority,
        adminNotes: adminNotes ? adminNotes : undefined,
      });
      toast.success("Priority updated successfully!");
      onSubmit(res.data.reconciliation);
    } catch (err) {
      console.error(
        "Error updating priority:",
        err.response?.data?.error || err.message
      );
      toast.error(err.response?.data?.error || "Failed to update priority");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} title={title}>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority Level
          </label>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="high"
                name="priority"
                value="high"
                checked={priority === "high"}
                onChange={(e) => setPriority(e.target.value)}
                className="mr-2"
              />
              <div className="flex items-center">
                <div className="h-4 w-4 bg-red-500 rounded-full mr-2"></div>
                <label
                  htmlFor="high"
                  className="text-sm font-medium text-gray-700"
                >
                  High Priority
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="medium"
                name="priority"
                value="medium"
                checked={priority === "medium"}
                onChange={(e) => setPriority(e.target.value)}
                className="mr-2"
              />
              <div className="flex items-center">
                <div className="h-4 w-4 bg-yellow-500 rounded-full mr-2"></div>
                <label
                  htmlFor="medium"
                  className="text-sm font-medium text-gray-700"
                >
                  Medium Priority
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="low"
                name="priority"
                value="low"
                checked={priority === "low"}
                onChange={(e) => setPriority(e.target.value)}
                className="mr-2"
              />
              <div className="flex items-center">
                <div className="h-4 w-4 bg-blue-500 rounded-full mr-2"></div>
                <label
                  htmlFor="low"
                  className="text-sm font-medium text-gray-700"
                >
                  Low Priority
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="adminNotes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Admin Notes (Optional)
          </label>
          <textarea
            id="adminNotes"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Add any administrative notes about this change"
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Priority"}
        </button>
      </div>
    </form>
  );
};

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 border border-green-300";
      case "unresolved":
        return "bg-red-100 text-red-800 border border-red-300";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "assigned":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "pending":
        return "bg-purple-100 text-purple-800 border border-purple-300";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(
        status
      )}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Priority badge component
const PriorityBadge = ({ priority }) => {
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${getPriorityStyle(
        priority
      )}`}
    >
      {priority}
    </span>
  );
};

const AdminReconciliationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reconciliation, setReconciliation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shaykhsList, setShaykhsList] = useState([]);

  // Modal states
  const [activeModal, setActiveModal] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  useEffect(() => {
    fetchReconciliation();
    fetchShaykhs();
  }, [id]);

  const fetchReconciliation = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reconciliations/${id}`);
      setReconciliation(res.data.reconciliation);
    } catch (err) {
      console.error("Error fetching reconciliation:", err);
      toast.error("Failed to load reconciliation details");
    } finally {
      setLoading(false);
    }
  };

  const fetchShaykhs = async () => {
    try {
      const res = await api.get("/admin/shaykhs");
      setShaykhsList(res.data.shaykhs || []);
    } catch (err) {
      console.error("Error fetching shaykhs:", err);
      toast.error("Failed to load shaykhs list");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const handleModalSubmit = () => {
    fetchReconciliation();
    setActiveModal(null);
    setSelectedMeeting(null);
  };

  const openModal = (modalName, meeting = null) => {
    setActiveModal(modalName);
    if (meeting) {
      setSelectedMeeting(meeting);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedMeeting(null);
  };

  const canAssignShaykh = () => {
    if (!reconciliation) return false;

    // Can only assign if status is pending or if there's no shaykh assigned
    if (reconciliation.status !== "pending" && reconciliation.assignedShaykh) {
      return false;
    }

    // Cannot assign if resolved, unresolved or cancelled
    if (
      reconciliation.status === "resolved" ||
      reconciliation.status === "unresolved" ||
      reconciliation.status === "cancelled"
    ) {
      return false;
    }

    return true;
  };

  // Determine if reconciliation can be completed
  const canCompleteReconciliation = () => {
    if (!reconciliation) return false;

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

  // Determine if reconciliation can be cancelled
  const canCancelReconciliation = () => {
    if (!reconciliation) return false;

    // Cannot cancel if already resolved, unresolved or cancelled
    if (
      reconciliation.status === "resolved" ||
      reconciliation.status === "unresolved" ||
      reconciliation.status === "cancelled"
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          <p className="mt-4 text-gray-600">
            Loading reconciliation details...
          </p>
        </div>
      </div>
    );
  }

  if (!reconciliation) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-lg p-8 text-center shadow">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Reconciliation Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The requested reconciliation case could not be found.
          </p>
          <button
            onClick={() => navigate("/admin/reconciliation")}
            className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800"
          >
            Back to Reconciliation List
          </button>
        </div>
      </div>
    );
  }

  const upcomingMeetings = getUpcomingMeetings();
  const pastMeetings = getPastMeetings();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigate("/admin/reconciliations")}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft size={20} className="mr-1" />
              Back to Reconciliation List
            </button>
            <div className="flex items-center space-x-3">
              <StatusBadge status={reconciliation.status} />
              <PriorityBadge priority={reconciliation.priority || "medium"} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reconciliation Case #{ConvertIDtoSmallID(reconciliation._id)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Submitted on {formatDate(reconciliation.createdAt)}
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Case details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Action buttons */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex flex-wrap gap-3">
                  {canAssignShaykh() && (
                    <button
                      onClick={() => openModal("assign")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
                    >
                      <UserPlus size={16} className="mr-2" />
                      Assign to Shaykh
                    </button>
                  )}

                  {reconciliation.status !== "pending" && (
                    <button
                      onClick={() => openModal("scheduleMeeting")}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 flex items-center"
                    >
                      <Calendar size={16} className="mr-2" />
                      Schedule Meeting
                    </button>
                  )}

                  {canCompleteReconciliation() && (
                    <button
                      onClick={() => openModal("complete")}
                      className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Complete Case
                    </button>
                  )}

                  {canCancelReconciliation() && (
                    <button
                      onClick={() => openModal("cancel")}
                      className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 flex items-center"
                    >
                      <X size={16} className="mr-2" />
                      Cancel Case
                    </button>
                  )}

                  {/* <button
                    onClick={() => openModal("editPriority")}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center"
                  >
                    <Flag size={16} className="mr-2" />
                    Set Priority
                  </button> */}

                  <button
                    onClick={() => openModal("feedback")}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center"
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Add Feedback
                  </button>
                </div>
              </div>
            </div>

            {/* Couple Information */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Couple Information
                  </h2>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Husband
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center mb-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3">
                        {reconciliation.husband.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {reconciliation.husband.firstName}{" "}
                          {reconciliation.husband.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center text-gray-700">
                        <span className="font-medium w-20">Phone:</span>
                        {reconciliation.husband.phone}
                      </p>
                      <p className="flex items-center text-gray-700">
                        <span className="font-medium w-20">Email:</span>
                        {reconciliation.husband.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Wife
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center mb-3">
                      <div className="h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-700 font-bold mr-3">
                        {reconciliation.wife.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {reconciliation.wife.firstName}{" "}
                          {reconciliation.wife.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center text-gray-700">
                        <span className="font-medium w-20">Phone:</span>
                        {reconciliation.wife.phone}
                      </p>
                      <p className="flex items-center text-gray-700">
                        <span className="font-medium w-20">Email:</span>
                        {reconciliation.wife.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case Details */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Case Details
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Issues Description
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {reconciliation.issueDescription}
                    </p>
                  </div>
                </div>

                {reconciliation.additionalInformation && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Additional Information
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {reconciliation.additionalInformation}
                      </p>
                    </div>
                  </div>
                )}

                {reconciliation.shaykhNotes && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-500">
                        Shaykh Notes
                      </h3>
                      <button
                        onClick={() => openModal("shaykhNotes")}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Pencil size={12} className="mr-1" />
                        Edit
                      </button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {reconciliation.shaykhNotes}
                      </p>
                    </div>
                  </div>
                )}

                {!reconciliation.shaykhNotes &&
                  reconciliation.assignedShaykh && (
                    <div className="mb-6">
                      <button
                        onClick={() => openModal("shaykhNotes")}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Plus size={16} className="mr-1" />
                        Add Shaykh Notes
                      </button>
                    </div>
                  )}

                {reconciliation.adminNotes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Admin Notes
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {reconciliation.adminNotes}
                      </p>
                    </div>
                  </div>
                )}

                {(reconciliation.status === "resolved" ||
                  reconciliation.status === "unresolved") &&
                  reconciliation.outcomeDetails && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Case Outcome
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            reconciliation.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {reconciliation.status === "resolved"
                            ? "Resolved"
                            : "Unresolved"}
                        </span>
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {reconciliation.outcomeDetails}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Meetings */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="px-6 py-4 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    Meetings
                  </h2>
                  {reconciliation.status !== "pending" && (
                    <button
                      onClick={() => openModal("scheduleMeeting")}
                      className="px-3 py-1.5 bg-green-700 text-white rounded-md text-xs font-medium hover:bg-green-800 flex items-center"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Meeting
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6">
                {upcomingMeetings.length === 0 && pastMeetings.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-2">
                      No meetings scheduled yet
                    </p>
                    {reconciliation.status !== "pending" && (
                      <button
                        onClick={() => openModal("scheduleMeeting")}
                        className="px-4 py-2 text-sm text-green-700 border border-green-700 rounded-md hover:bg-green-50"
                      >
                        Schedule a Meeting
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {upcomingMeetings.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">
                          Upcoming Meetings
                        </h3>
                        <div className="space-y-4">
                          {upcomingMeetings.map((meeting) => (
                            <div
                              key={meeting._id}
                              className="border border-gray-200 rounded-md p-4"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-start">
                                  <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">
                                      {formatDate(meeting.date)}
                                    </p>
                                    <div className="flex items-center mt-1">
                                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                      <span className="text-xs text-gray-500">
                                        {formatTime(meeting.time)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    Scheduled
                                  </span>
                                  <button
                                    onClick={() => {
                                      setSelectedMeeting(meeting);
                                      openModal("updateMeeting", meeting);
                                    }}
                                    className="ml-3 text-gray-500 hover:text-gray-700"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start">
                                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Location
                                    </p>
                                    <p className="text-sm">
                                      {meeting.location}
                                    </p>
                                  </div>
                                </div>

                                {meeting.notes && (
                                  <div className="flex items-start">
                                    <MessageCircle className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Notes
                                      </p>
                                      <p className="text-sm">{meeting.notes}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {pastMeetings.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">
                          Past Meetings
                        </h3>
                        <div className="space-y-4">
                          {pastMeetings.map((meeting) => (
                            <div
                              key={meeting._id}
                              className="border border-gray-200 rounded-md p-4"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-start">
                                  <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">
                                      {formatDate(meeting.date)}
                                    </p>
                                    <div className="flex items-center mt-1">
                                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                      <span className="text-xs text-gray-500">
                                        {formatTime(meeting.time)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  {meeting.status === "completed" ? (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                      Completed
                                    </span>
                                  ) : meeting.status === "cancelled" ? (
                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                      Cancelled
                                    </span>
                                  ) : meeting.status === "rescheduled" ? (
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                      Rescheduled
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                                      {meeting.status}
                                    </span>
                                  )}
                                  <button
                                    onClick={() => {
                                      setSelectedMeeting(meeting);
                                      openModal("updateMeeting", meeting);
                                    }}
                                    className="ml-3 text-gray-500 hover:text-gray-700"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start">
                                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Location
                                    </p>
                                    <p className="text-sm">
                                      {meeting.location}
                                    </p>
                                  </div>
                                </div>

                                {meeting.notes && (
                                  <div className="flex items-start">
                                    <MessageCircle className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Notes
                                      </p>
                                      <p className="text-sm">{meeting.notes}</p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {meeting.status === "completed" &&
                                meeting.completedNotes && (
                                  <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">
                                      Meeting Outcome
                                    </p>
                                    <p className="text-sm">
                                      {meeting.completedNotes}
                                    </p>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Feedback */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="px-6 py-4 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    Feedback & Comments
                  </h2>
                  <button
                    onClick={() => openModal("feedback")}
                    className="px-3 py-1.5 bg-green-700 text-white rounded-md text-xs font-medium hover:bg-green-800 flex items-center"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Feedback
                  </button>
                </div>
              </div>
              <div className="p-6">
                {reconciliation.feedback &&
                reconciliation.feedback.length > 0 ? (
                  <div className="space-y-4">
                    {reconciliation.feedback.map((item) => (
                      <div key={item._id} className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium mr-2">
                              {item.user.firstName
                                ? item.user.firstName.charAt(0)
                                : item.user.username.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {item.user.firstName || item.user.username}
                                {item.user.role && (
                                  <span className="text-xs text-gray-500 ml-2">
                                    ({item.user.role})
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(item.date)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{item.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-2">
                      No feedback or comments yet
                    </p>
                    <button
                      onClick={() => openModal("feedback")}
                      className="px-4 py-2 text-sm text-green-700 border border-green-700 rounded-md hover:bg-green-50"
                    >
                      Add Feedback
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Case info and actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Case Status Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Case Information
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500">CASE ID</p>
                    <p className="text-sm font-medium">
                      {ConvertIDtoSmallID(reconciliation._id)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">SUBMITTED BY</p>
                    <div className="flex items-center">
                      <p className="text-sm font-medium">
                        {reconciliation.user.firstName ||
                          reconciliation.user.username}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">SUBMISSION DATE</p>
                    <p className="text-sm font-medium">
                      {formatDate(reconciliation.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">STATUS</p>
                    <div className="mt-1">
                      <StatusBadge status={reconciliation.status} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Shaykh */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Assignment
                  </h2>
                </div>
              </div>
              <div className="p-6">
                {reconciliation.assignedShaykh ? (
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold mr-3">
                        {reconciliation.assignedShaykh.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {reconciliation.assignedShaykh.firstName}{" "}
                          {reconciliation.assignedShaykh.lastName}
                        </p>
                        <p className="text-xs text-gray-500">Assigned Shaykh</p>
                      </div>
                    </div>

                    {canAssignShaykh() && (
                      <button
                        onClick={() => openModal("assign")}
                        className="w-full px-4 py-2 mt-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center"
                      >
                        <UserPlus size={16} className="mr-2" />
                        Reassign
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserPlus
                      size={36}
                      className="mx-auto h-12 w-12 text-gray-400 mb-3"
                    />
                    <p className="text-gray-500 mb-4">No shaykh assigned yet</p>
                    {canAssignShaykh() && (
                      <button
                        onClick={() => openModal("assign")}
                        className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800"
                      >
                        Assign Shaykh
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Activity Timeline
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  <div className="space-y-6">
                    {/* Created activity */}
                    <div className="relative pl-10">
                      <div className="absolute left-0 top-1 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity size={16} className="text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Case Created</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(reconciliation.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Assigned activity */}
                    {reconciliation.assignedShaykh && (
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-1 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <UserPlus size={16} className="text-green-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Assigned to Shaykh
                          </p>
                          <p className="text-xs text-gray-700">
                            {reconciliation.assignedShaykh.firstName}{" "}
                            {reconciliation.assignedShaykh.lastName}
                          </p>
                          {reconciliation.status === "assigned" && (
                            <p className="text-xs text-gray-500">
                              Awaiting scheduling
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Meetings */}
                    {reconciliation.meetings &&
                      reconciliation.meetings.length > 0 && (
                        <>
                          {reconciliation.meetings
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((meeting, index) => (
                              <div key={meeting._id} className="relative pl-10">
                                <div className="absolute left-0 top-1 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                                  <Calendar
                                    size={16}
                                    className="text-purple-700"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    Meeting {index + 1}
                                    <span
                                      className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
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
                                  </p>
                                  <p className="text-xs text-gray-700">
                                    {formatDate(meeting.date)} at{" "}
                                    {formatTime(meeting.time)}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </>
                      )}

                    {/* Resolution */}
                    {(reconciliation.status === "resolved" ||
                      reconciliation.status === "unresolved") && (
                      <div className="relative pl-10">
                        <div
                          className="absolute left-0 top-1 h-8 w-8 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor:
                              reconciliation.status === "resolved"
                                ? "rgba(16, 185, 129, 0.1)"
                                : "rgba(239, 68, 68, 0.1)",
                            color:
                              reconciliation.status === "resolved"
                                ? "rgb(16, 185, 129)"
                                : "rgb(239, 68, 68)",
                          }}
                        >
                          {reconciliation.status === "resolved" ? (
                            <CheckCircle size={16} />
                          ) : (
                            <X size={16} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Case{" "}
                            {reconciliation.status === "resolved"
                              ? "Resolved"
                              : "Unresolved"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(reconciliation.updatedAt)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Cancelled */}
                    {reconciliation.status === "cancelled" && (
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-1 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <X size={16} className="text-gray-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Case Cancelled</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(reconciliation.updatedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={activeModal === "assign"} onClose={closeModal}>
        <AssignShaykhModal
          title="Assign to Shaykh"
          reconciliationId={reconciliation._id}
          shaykhsList={shaykhsList}
          onSubmit={handleModalSubmit}
        />
      </Modal>

      <Modal isOpen={activeModal === "scheduleMeeting"} onClose={closeModal}>
        <ScheduleMeetingModal
          title="Schedule Meeting"
          reconciliationId={reconciliation._id}
          onSubmit={handleModalSubmit}
        />
      </Modal>

      <Modal isOpen={activeModal === "updateMeeting"} onClose={closeModal}>
        <UpdateMeetingModal
          title="Update Meeting"
          reconciliationId={reconciliation._id}
          meeting={selectedMeeting}
          onSubmit={handleModalSubmit}
        />
      </Modal>

      <Modal isOpen={activeModal === "shaykhNotes"} onClose={closeModal}>
        <AddShaykhNotesModal
          title="Shaykh Notes"
          reconciliationId={reconciliation._id}
          currentNotes={reconciliation.shaykhNotes}
          onSubmit={handleModalSubmit}
        />
      </Modal>

      <Modal isOpen={activeModal === "complete"} onClose={closeModal}>
        <CompleteReconciliationModal
          title="Complete Reconciliation"
          reconciliationId={reconciliation._id}
          onSubmit={handleModalSubmit}
        />
      </Modal>

      <Modal isOpen={activeModal === "cancel"} onClose={closeModal}>
        <CancelReconciliationModal
          title="Cancel Reconciliation"
          reconciliationId={reconciliation._id}
          onSubmit={handleModalSubmit}
        />
      </Modal>

      <Modal isOpen={activeModal === "feedback"} onClose={closeModal}>
        <AddFeedbackModal
          title="Add Feedback"
          reconciliationId={reconciliation._id}
          onSubmit={handleModalSubmit}
        />
      </Modal>

      <Modal isOpen={activeModal === "editPriority"} onClose={closeModal}>
        <EditPriorityModal
          title="Set Priority"
          reconciliationId={reconciliation._id}
          currentPriority={reconciliation.priority}
          onSubmit={handleModalSubmit}
        />
      </Modal>
    </div>
  );
};

export default AdminReconciliationDetail;
