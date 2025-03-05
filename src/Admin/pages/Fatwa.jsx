// src/pages/FatwaApplications.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"; // Adjust path as needed
import { useAuth } from "../../Contexts/AuthContext";
import api from "../../utils/api";
import ConvertIDtoSmallID from "../../utils/IDconversion";

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium ${
      active
        ? "text-primary-700 border-b-2 border-primary-700"
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
      displayText = "Resolved";
      break;
    case "assigned":
      badgeClass = "text-yellow-700 bg-yellow-50";
      displayText = "Assigned";
      break;
    case "pending":
      badgeClass = "text-red-700 bg-red-50";
      displayText = "Not Resolved";
      break;
    case "approved":
      badgeClass = "text-blue-700 bg-blue-50";
      displayText = "Approved";
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

const Modal = ({
  isOpen,
  onClose,
  query,
  onApprove,
  onUnapprove,
  onAssign,
  shaykhList,
}) => {
  const [comment, setComment] = useState("");
  const [shaykh, setShaykh] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query && query.assignedTo) {
      setShaykh(query.assignedTo);
    } else {
      setShaykh("");
    }
  }, [query]);

  if (!isOpen || !query) return null;

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(query._id, comment);
      onClose();
    } catch (error) {
      console.error("Error approving fatwa:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnapprove = async () => {
    setLoading(true);
    try {
      await onUnapprove(query._id, comment);
      onClose();
    } catch (error) {
      console.error("Error unapproving fatwa:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!shaykh) return;

    setLoading(true);
    try {
      await onAssign(query._id, shaykh);
      onClose();
    } catch (error) {
      console.error("Error assigning fatwa:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg w-full max-w-2xl mx-auto shadow-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-900">
                Query {ConvertIDtoSmallID(query._id)}
              </h3>
              <p className="text-sm text-gray-500">{query.title}</p>
              <p className="text-sm text-gray-500">
                By User: {query.user?.username || "User"}
              </p>
            </div>
          </div>
          <img src={logo} alt="Logo" className="h-20" />
        </div>

        {/* Content */}
        <div className="py-6 space-y-6">
          <div className="space-y-4">
            <p className="font-medium">{query.question}</p>

            {query.answer && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">{query.answer}</p>
                <p className="text-right">
                  - {query.answeredBy?.name || "Shaykh"}
                </p>
              </div>
            )}
          </div>

          {/* Assign to Shaykh (for admins) */}
          {query.status === "pending" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Assign to Shaykh:
              </label>
              <div className="flex">
                <select
                  className="w-full rounded-l-md border border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={shaykh}
                  onChange={(e) => setShaykh(e.target.value)}
                >
                  <option value="">Select Shaykh</option>
                  {shaykhList.map((shaykh) => (
                    <option key={shaykh._id} value={shaykh._id}>
                      {shaykh.name || shaykh.firstName || shaykh.username}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={!shaykh || loading}
                  className="px-4 py-2 bg-primary-700 text-white rounded-r-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300"
                >
                  Assign
                </button>
              </div>
            </div>
          )}

          {/* Add comments for approval/rejection */}
          {query.status === "answered" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Add comments:
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Write comments..."
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={loading}
          >
            Close
          </button>

          {query.status === "answered" && (
            <>
              <button
                onClick={handleUnapprove}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-300"
              >
                {loading ? "Processing..." : "Unapprove"}
              </button>
              <button
                onClick={handleApprove}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-700 rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300"
              >
                {loading ? "Processing..." : "Approve"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const FatwaApplications = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shaykhList, setShaykhList] = useState([]);

  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check if user has admin permission
  const isAdmin = currentUser?.role === "admin";

  // Fetch fatwa applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);

        // Determine the endpoint based on the selected tab
        let endpoint = "/fatwas";

        // Filter by status if a specific tab is selected
        if (selectedTab !== "all") {
          endpoint += `?status=${selectedTab}`;
        }

        const response = await api.get(endpoint);

        // Filter based on search query if present
        let filteredApplications = response.data.fatwas;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredApplications = filteredApplications.filter(
            (app) =>
              app.title?.toLowerCase().includes(query) ||
              app._id?.toLowerCase().includes(query)
          );
        }

        setApplications(filteredApplications);
        setError("");
      } catch (err) {
        setError("Failed to load fatwa applications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchApplications();
    }
  }, [selectedTab, searchQuery, isAuthenticated]);

  // Fetch Shaykh list for assigning
  useEffect(() => {
    const fetchShaykhs = async () => {
      try {
        if (isAdmin) {
          const response = await api.get("/admin/shaykhs");
          setShaykhList(response.data.shaykhs || []);
        }
      } catch (err) {
        console.error("Failed to fetch shaykhs:", err);
      }
    };

    if (isAuthenticated() && isAdmin) {
      fetchShaykhs();
    }
  }, [isAdmin, isAuthenticated]);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated() && !loading) {
      navigate("/login", { state: { from: "/fatwa-applications" } });
    } else if (isAuthenticated() && !isAdmin && !loading) {
      navigate("/dashboard"); // Redirect to dashboard if not admin
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  const handleViewQuery = (query) => {
    setSelectedQuery(query);
    setIsModalOpen(true);
  };

  const handleApprove = async (queryId, comment) => {
    try {
      await api.put(`/fatwas/approve/${queryId}`, { comment });
      // Refresh the application list
      const response = await api.get("/fatwas");
      setApplications(response.data.fatwas);
    } catch (err) {
      console.error("Failed to approve fatwa:", err);
      throw err;
    }
  };

  const handleUnapprove = async (queryId, comment) => {
    try {
      await api.put(`/fatwas/${queryId}/unapprove`, { comment });
      // Refresh the application list
      const response = await api.get("/fatwas");
      setApplications(response.data.fatwas);
    } catch (err) {
      console.error("Failed to unapprove fatwa:", err);
      throw err;
    }
  };

  const handleAssign = async (queryId, shaykhId) => {
    try {
      await api.put(`/fatwas/${queryId}/assign`, { shaykhId });
      // Refresh the application list
      const response = await api.get("/fatwas");
      setApplications(response.data.fatwas);
    } catch (err) {
      console.error("Failed to assign fatwa:", err);
      throw err;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Fatwa Applications
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage fatwa applications
            </p>
          </div>
          {/* Header button can be added back here if needed */}
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tabs - Scrollable on mobile */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <div className="flex whitespace-nowrap pb-1">
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
              active={selectedTab === "approved"}
              onClick={() => setSelectedTab("approved")}
            >
              Approved
            </TabButton>
            <TabButton
              active={selectedTab === "assigned"}
              onClick={() => setSelectedTab("assigned")}
            >
              Waiting
            </TabButton>
            <TabButton
              active={selectedTab === "pending"}
              onClick={() => setSelectedTab("pending")}
            >
              Unassigned
            </TabButton>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by Subject or ID"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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

        {/* Table/Card View */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {applications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No fatwa applications found.{" "}
              {selectedTab !== "all" && "Try changing your filter."}
            </div>
          ) : (
            <>
              {/* Desktop Table - Hidden on mobile */}
              <div className="hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="w-12 px-6 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-700 focus:ring-primary-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Query ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary-700 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ConvertIDtoSmallID(app._id)} 
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {app.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(app.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {app.assignedTo ? (
                            <div className="text-sm text-gray-900">
                              {app.assignedTo.firstName ||
                                app.assignedTo.email ||
                                "Shaykh"}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewQuery(app)}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${
                              app.status === "answered"
                                ? "bg-primary-700 text-white hover:bg-primary-800"
                                : app.assignedTo
                                ? "bg-primary-700 text-white hover:bg-primary-800"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {app.status === "answered" ? "Approve" : "View"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View - Shown only on mobile */}
              <div className="md:hidden divide-y divide-gray-200">
                {applications.map((app) => (
                  <div key={app._id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900 truncate max-w-xs">
                          {app.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          ID: {app._id.substring(0, 10)}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>

                    <div className="flex flex-wrap text-sm text-gray-500 mb-3 gap-x-4">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatDate(app.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {app.assignedTo
                          ? app.assignedTo.firstName ||
                            app.assignedTo.email ||
                            "Shaykh"
                          : "Unassigned"}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleViewQuery(app)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          app.status === "answered"
                            ? "bg-primary-700 text-white"
                            : app.assignedTo
                            ? "bg-primary-700 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {app.status === "answered" ? "Approve" : "View"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Modal - Already responsive */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          query={selectedQuery}
          onApprove={handleApprove}
          onUnapprove={handleUnapprove}
          onAssign={handleAssign}
          shaykhList={shaykhList}
        />
      </div>
    </div>
  );
};

export default FatwaApplications;
