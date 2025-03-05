// src/pages/FatwaQueries.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../Contexts/AuthContext";
import api from "../../utils/api";

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-4 text-sm transition-colors duration-200 ${
      active
        ? "text-primary-700 border-b-2 border-primary-700 font-medium"
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {children}
  </button>
);

const StatusBadge = ({ status }) => {
  let badgeClass = "";
  let displayText = status;

  switch (status) {
    case "answered":
      badgeClass = "text-green-700 bg-green-50";
      displayText = "Answered";
      break;
    case "assigned":
      badgeClass = "text-orange-700 bg-orange-50";
      displayText = "Waiting for response";
      break;
    case "pending":
      badgeClass = "text-red-700 bg-red-50";
      displayText = "Pending";
      break;
    default:
      badgeClass = "text-gray-700 bg-gray-50";
  }

  return (
    <span className={`px-2 py-1 text-sm rounded-md ${badgeClass}`}>
      {displayText}
    </span>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-lg w-full max-w-2xl mx-auto shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Logo" className="h-16" />
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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

          {/* Content */}

          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

const AddQueryForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    question: "",
    priority: "not-urgent",
    privacy: "not-confidential",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit query");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter a subject for your query"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter the details of your question here
        </label>
        <textarea
          name="question"
          value={formData.question}
          onChange={handleChange}
          rows={6}
          className="w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Add your query here"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="priority"
                value="urgent"
                checked={formData.priority === "urgent"}
                onChange={handleChange}
                className="text-primary-700 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Urgent</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="priority"
                value="not-urgent"
                checked={formData.priority === "not-urgent"}
                onChange={handleChange}
                className="text-primary-700 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Not Urgent</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Privacy
          </label>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="privacy"
                value="confidential"
                checked={formData.privacy === "confidential"}
                onChange={handleChange}
                className="text-primary-700 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Confidential</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="privacy"
                value="not-confidential"
                checked={formData.privacy === "not-confidential"}
                onChange={handleChange}
                className="text-primary-700 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Not Confidential
              </span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select Category</option>
          <option value="marriage">Marriage</option>
          <option value="family">Family</option>
          <option value="business">Business</option>
          <option value="worship">Worship</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Query"}
        </button>
      </div>
    </form>
  );
};

const ViewQueryModal = ({ query, onClose, onSubmitFeedback }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      await onSubmitFeedback(query._id, comment);
      onClose();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900">{query?.title}</h4>
        <p className="mt-2 text-gray-600">{query?.question}</p>

        {query?.answer && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900">Response:</h5>
            <p className="mt-2 text-gray-600">{query.answer}</p>
            <p className="mt-4 text-right text-sm text-gray-500">
              - {query.answeredBy?.name || "Shaykh"}
            </p>
          </div>
        )}
      </div>

      {/* Only show comment box if the user is the author of this query */}
      {currentUser &&
        (currentUser.id === query?.user || currentUser.role === "admin") &&
        query?.status === "answered" && (
          <form onSubmit={handleSubmitFeedback}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add feedback:
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Write your feedback..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={loading}
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={loading || !comment.trim()}
              >
                {loading ? "Submitting..." : "Submit feedback"}
              </button>
            </div>
          </form>
        )}

      {/* If not the author, just show close button */}
      {(!currentUser ||
        (currentUser.id !== query?.user && currentUser.role !== "admin") ||
        query?.status !== "answered") && (
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

const FatwaQueries = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Load queries based on user role and selected tab
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);

        let endpoint = "/fatwas";

        // If user is logged in, get appropriate queries
        if (isAuthenticated()) {
          if (currentUser.role === "user") {
            endpoint = "/fatwas/user"; // User's own queries
          } else if (currentUser.role === "shaykh") {
            if (selectedTab === "assigned") {
              endpoint = "/fatwas/assigned"; // Queries assigned to this shaykh
            }
          }
        }

        const response = await api.get(endpoint);

        // Filter based on selected tab
        let filteredQueries = response.data.fatwas;
        if (selectedTab !== "all") {
          filteredQueries = filteredQueries.filter(
            (q) => q.status === selectedTab
          );
        }

        // Filter based on search query if present
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredQueries = filteredQueries.filter(
            (q) =>
              q.title.toLowerCase().includes(query) ||
              q.question.toLowerCase().includes(query)
          );
        }

        setQueries(filteredQueries);
      } catch (err) {
        setError("Failed to load fatwa queries");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, [selectedTab, searchQuery, currentUser, isAuthenticated]);

  const handleCreateFatwa = async (formData) => {
    try {
      await api.post("/fatwas", {
        title: formData.title,
        question: formData.question,
        priority: formData.priority,
        privacy: formData.privacy,
        category: formData.category,
      });

      // Refresh the query list and close modal
      setIsAddModalOpen(false);
      // Refetch queries - simplified for this example
      const response = await api.get("/fatwas/user");
      setQueries(response.data.fatwas);
    } catch (err) {
      throw err;
    }
  };

  const handleViewQuery = (query) => {
    setSelectedQuery(query);
    setIsViewModalOpen(true);
  };

  const handleSubmitFeedback = async (queryId, comment) => {
    try {
      await api.post(`/fatwas/${queryId}/feedback`, { comment });
      // Would typically refresh data here
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      throw err;
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated() && !loading) {
      navigate("/login", { state: { from: "/fatwa-queries" } });
    }
  }, [isAuthenticated, loading, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Fatwa Queries
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage your fatwa queries
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-primary-700 text-white text-sm font-medium rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              + Add Query
            </button>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <div className="flex">
            <TabButton
              active={selectedTab === "all"}
              onClick={() => setSelectedTab("all")}
            >
              All
            </TabButton>
            <TabButton
              active={selectedTab === "answered"}
              onClick={() => setSelectedTab("answered")}
            >
              Answered
            </TabButton>
            <TabButton
              active={selectedTab === "assigned"}
              onClick={() => setSelectedTab("assigned")}
            >
              Waiting for response
            </TabButton>
            <TabButton
              active={selectedTab === "pending"}
              onClick={() => setSelectedTab("pending")}
            >
              Pending
            </TabButton>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg mb-6 flex justify-between items-center shadow-sm">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Subject or Question"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Responsive Table/Cards */}
        {queries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No fatwa queries found.{" "}
            {selectedTab !== "all" && "Try changing your filter."}
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4">
              {queries.map((query) => (
                <div key={query._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-medium text-gray-500">
                      ID: {query._id.substring(0, 8)}...
                    </span>
                    <StatusBadge status={query.status} />
                  </div>

                  <div className="mb-3">
                    <h3 className="font-medium text-gray-900">{query.title}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p>{formatDate(query.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Assigned To</p>
                      <p>
                        {query.assignedTo?.name ||
                          (query.status === "pending"
                            ? "Unassigned"
                            : "Shaykh")}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewQuery(query)}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${
                      query.status === "answered"
                        ? "bg-primary-700 text-white hover:bg-primary-800"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="w-12 px-6 py-3 bg-gray-50">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-700 focus:ring-primary-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Query Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Creation Date
                        <svg
                          className="inline-block ml-1 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Assigned Shaykh
                      </th>
                      <th className="px-6 py-3 bg-gray-50"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {queries.map((query) => (
                      <tr key={query._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary-700 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {query._id.substring(0, 10)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {query.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(query.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={query.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {query.assignedTo?.name ||
                            (query.status === "pending"
                              ? "Unassigned"
                              : "Shaykh")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewQuery(query)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                              query.status === "answered"
                                ? "bg-primary-700 text-white hover:bg-primary-800"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Add Query Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Ask a new query"
        >
          <AddQueryForm
            onSubmit={handleCreateFatwa}
            onClose={() => setIsAddModalOpen(false)}
          />
        </Modal>

        {/* View Query Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Query"
        >
          <ViewQueryModal
            query={selectedQuery}
            onClose={() => setIsViewModalOpen(false)}
            onSubmitFeedback={handleSubmitFeedback}
          />
        </Modal>
      </div>
    </div>
  );
};

export default FatwaQueries;
