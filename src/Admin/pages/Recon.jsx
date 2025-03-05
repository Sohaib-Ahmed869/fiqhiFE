import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  UserPlus,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Tag,
  MoreHorizontal,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";
import ConvertIDtoSmallID from "../../utils/IDconversion";
// Custom styled components
const StatusBadge = ({ status }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "resolved":
        return "text-green-700 bg-green-50";
      case "unresolved":
        return "text-red-700 bg-red-50";
      case "in-progress":
        return "text-yellow-700 bg-yellow-50";
      case "assigned":
        return "text-blue-700 bg-blue-50";
      case "pending":
        return "text-purple-700 bg-purple-50";
      case "cancelled":
        return "text-gray-700 bg-gray-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  return (
    <span className={`px-2 py-1 text-sm rounded-md ${getStatusStyle(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const TabButton = ({ active, children, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium ${
      active
        ? "text-primary-700 border-b-2 border-primary-700"
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {children}
    {count !== undefined && (
      <span
        className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
          active ? "bg-primary-700 text-white" : "bg-gray-200 text-gray-700"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

const AssignShaykhModal = ({
  isOpen,
  onClose,
  onSubmit,
  reconciliationId,
  shaykhsList,
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
      onClose();
      setSelectedShaykh("");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Assign to Shaykh
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedShaykh}
              className="px-4 py-2 bg-primary-700 text-white rounded-md text-sm font-medium hover:bg-primary-800 disabled:opacity-50"
            >
              {loading ? "Assigning..." : "Assign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminReconciliationList = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [reconciliations, setReconciliations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shaykhsList, setShaykhsList] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedReconciliationId, setSelectedReconciliationId] =
    useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [dateRangeFilter, setDateRangeFilter] = useState({
    start: "",
    end: "",
  });
  const [statusCounts, setStatusCounts] = useState({});
  const navigate = useNavigate();

  // Filter states
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assignmentFilter, setAssignmentFilter] = useState("all");

  useEffect(() => {
    fetchReconciliations();
    fetchShaykhs();
  }, []);

  useEffect(() => {
    calculateStatusCounts();
  }, [reconciliations]);

  const fetchReconciliations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reconciliations");
      setReconciliations(res.data.reconciliations);
    } catch (err) {
      console.error("Error fetching reconciliations:", err);
      toast.error("Failed to load reconciliation cases");
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

  const calculateStatusCounts = () => {
    const counts = {
      pending: 0,
      assigned: 0,
      "in-progress": 0,
      resolved: 0,
      unresolved: 0,
      cancelled: 0,
    };

    reconciliations.forEach((reconciliation) => {
      if (counts[reconciliation.status] !== undefined) {
        counts[reconciliation.status]++;
      }
    });

    setStatusCounts(counts);
  };

  const getFilteredReconciliations = () => {
    let filtered = reconciliations;

    // Filter by tab
    if (activeTab !== "All") {
      filtered = filtered.filter(
        (item) => item.status === activeTab.toLowerCase()
      );
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter((item) => item.priority === priorityFilter);
    }

    // Filter by assignment
    if (assignmentFilter === "assigned") {
      filtered = filtered.filter((item) => item.assignedShaykh);
    } else if (assignmentFilter === "unassigned") {
      filtered = filtered.filter((item) => !item.assignedShaykh);
    }

    // Filter by date range
    if (dateRangeFilter.start && dateRangeFilter.end) {
      const startDate = new Date(dateRangeFilter.start);
      const endDate = new Date(dateRangeFilter.end);
      endDate.setHours(23, 59, 59); // Set to end of day

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.husband.firstName + " " + item.husband.lastName)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (item.wife.firstName + " " + item.wife.lastName)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (item.assignedShaykh &&
            (item.assignedShaykh.firstName + " " + item.assignedShaykh.lastName)
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (item.issueDescription &&
            item.issueDescription
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  const handleAssignClick = (reconciliationId) => {
    setSelectedReconciliationId(reconciliationId);
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = () => {
    fetchReconciliations();
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredReconciliations = getFilteredReconciliations();

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
        {/* Header - Stack on mobile, row on desktop */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Reconciliation Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all reconciliation cases
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide" : "Filters"}
            </button>
            <button className="inline-flex items-center px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Download</span> Report
            </button>
            <button
              onClick={() => navigate("/admin/reconciliations/new")}
              className="inline-flex items-center px-3 py-2 bg-primary-700 text-white text-sm font-medium rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              New Case
            </button>
          </div>
        </div>

        {/* Tabs - Scrollable on mobile */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <div className="flex whitespace-nowrap pb-1">
            <TabButton
              active={activeTab === "All"}
              onClick={() => setActiveTab("All")}
              count={reconciliations.length}
            >
              All
            </TabButton>
            <TabButton
              active={activeTab === "Pending"}
              onClick={() => setActiveTab("Pending")}
              count={statusCounts.pending}
            >
              <Clock size={16} className="mr-1.5 inline" />
              <span className="hidden sm:inline">Pending</span>
              <span className="sm:hidden">Pend.</span>
            </TabButton>
            <TabButton
              active={activeTab === "Assigned"}
              onClick={() => setActiveTab("Assigned")}
              count={statusCounts.assigned}
            >
              <UserPlus size={16} className="mr-1.5 inline" />
              <span className="hidden sm:inline">Assigned</span>
              <span className="sm:hidden">Asgn.</span>
            </TabButton>
            <TabButton
              active={activeTab === "In-progress"}
              onClick={() => setActiveTab("In-progress")}
              count={statusCounts["in-progress"]}
            >
              <Calendar size={16} className="mr-1.5 inline" />
              <span className="hidden sm:inline">In Progress</span>
              <span className="sm:hidden">In Prog.</span>
            </TabButton>
            <TabButton
              active={activeTab === "Resolved"}
              onClick={() => setActiveTab("Resolved")}
              count={statusCounts.resolved}
            >
              <CheckCircle size={16} className="mr-1.5 inline" />
              <span className="hidden sm:inline">Resolved</span>
              <span className="sm:hidden">Rslv.</span>
            </TabButton>
            <TabButton
              active={activeTab === "Unresolved"}
              onClick={() => setActiveTab("Unresolved")}
              count={statusCounts.unresolved}
            >
              <AlertCircle size={16} className="mr-1.5 inline" />
              <span className="hidden sm:inline">Unresolved</span>
              <span className="sm:hidden">Unrslv.</span>
            </TabButton>
          </div>
        </div>

        {/* Search and Filter - Full width on mobile */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <button
            className="flex items-center px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={fetchReconciliations}
          >
            Refresh
          </button>
        </div>

        {/* Filter panel - Responsive grid */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Advanced Filters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Priority
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Assignment
                </label>
                <select
                  value={assignmentFilter}
                  onChange={(e) => setAssignmentFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Cases</option>
                  <option value="assigned">Assigned Only</option>
                  <option value="unassigned">Unassigned Only</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateRangeFilter.start}
                  onChange={(e) =>
                    setDateRangeFilter({
                      ...dateRangeFilter,
                      start: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateRangeFilter.end}
                  onChange={(e) =>
                    setDateRangeFilter({
                      ...dateRangeFilter,
                      end: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setPriorityFilter("all");
                  setAssignmentFilter("all");
                  setDateRangeFilter({ start: "", end: "" });
                }}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded mr-2"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Table/Card View */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredReconciliations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No reconciliation cases found matching your criteria.{" "}
              {activeTab !== "All" && "Try changing your filter."}
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on mobile */}
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
                        Query
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Husband
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wife
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Shaykh
                      </th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReconciliations.map((reconciliation) => (
                      <tr key={reconciliation._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary-700 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <p className="text-sm text-gray-500">
                            {ConvertIDtoSmallID(reconciliation._id)}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                {reconciliation.husband.firstName}{" "}
                                {reconciliation.husband.lastName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                {reconciliation.wife.firstName}{" "}
                                {reconciliation.wife.lastName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(reconciliation.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={reconciliation.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {reconciliation.assignedShaykh ? (
                            <div className="flex items-center">
                              <span className="text-sm">
                                {reconciliation.assignedShaykh.firstName}{" "}
                                {reconciliation.assignedShaykh.lastName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center gap-2">
                            {!reconciliation.assignedShaykh && (
                              <button
                                onClick={() =>
                                  handleAssignClick(reconciliation._id)
                                }
                                className="px-4 py-2 text-xs text-primary-700 border border-primary-700 rounded hover:bg-primary-50"
                              >
                                Assign
                              </button>
                            )}
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/reconciliations/${reconciliation._id}`
                                )
                              }
                              className="px-4 py-2 rounded-md text-sm font-medium bg-primary-700 text-white hover:bg-primary-800"
                            >
                              View
                            </button>
                            <div className="relative group">
                              <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                                <MoreHorizontal size={16} />
                              </button>
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-50">
                                <div className="py-1">
                                  {!reconciliation.assignedShaykh && (
                                    <button
                                      onClick={() =>
                                        handleAssignClick(reconciliation._id)
                                      }
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      Assign to Shaykh
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/admin/reconciliations/${reconciliation._id}`
                                      )
                                    }
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    View Details
                                  </button>
                                  {reconciliation.status !== "resolved" &&
                                    reconciliation.status !== "unresolved" &&
                                    reconciliation.status !== "cancelled" && (
                                      <button
                                        onClick={() =>
                                          navigate(
                                            `/admin/reconciliations/${reconciliation._id}/complete`
                                          )
                                        }
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        Complete
                                      </button>
                                    )}
                                  {reconciliation.status !== "resolved" &&
                                    reconciliation.status !== "unresolved" &&
                                    reconciliation.status !== "cancelled" && (
                                      <button
                                        onClick={() =>
                                          navigate(
                                            `/admin/reconciliations/${reconciliation._id}/cancel`
                                          )
                                        }
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                      >
                                        Cancel Case
                                      </button>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {filteredReconciliations.map((reconciliation) => (
                  <div key={reconciliation._id} className="p-4">
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-xs text-gray-500">
                          ID: {reconciliation._id.substring(0, 10)}
                        </p>
                        <p className="text-sm font-medium">
                          {reconciliation.husband.firstName}{" "}
                          {reconciliation.husband.lastName} &{" "}
                          {reconciliation.wife.firstName}{" "}
                          {reconciliation.wife.lastName}
                        </p>
                      </div>
                      <StatusBadge status={reconciliation.status} />
                    </div>

                    {/* Card Content */}
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p>{formatDate(reconciliation.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Assigned To</p>
                        <p>
                          {reconciliation.assignedShaykh
                            ? `${reconciliation.assignedShaykh.firstName} ${reconciliation.assignedShaykh.lastName}`
                            : "Unassigned"}
                        </p>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex justify-end items-center gap-2 pt-2">
                      {!reconciliation.assignedShaykh && (
                        <button
                          onClick={() => handleAssignClick(reconciliation._id)}
                          className="px-3 py-1.5 text-xs text-primary-700 border border-primary-700 rounded hover:bg-primary-50"
                        >
                          Assign
                        </button>
                      )}
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/reconciliations/${reconciliation._id}`
                          )
                        }
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary-700 text-white hover:bg-primary-800"
                      >
                        View
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => {
                            // Toggle dropdown for this specific item
                            document
                              .getElementById(`dropdown-${reconciliation._id}`)
                              .classList.toggle("hidden");
                          }}
                          className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        <div
                          id={`dropdown-${reconciliation._id}`}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden z-50"
                        >
                          <div className="py-1">
                            {!reconciliation.assignedShaykh && (
                              <button
                                onClick={() =>
                                  handleAssignClick(reconciliation._id)
                                }
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Assign to Shaykh
                              </button>
                            )}
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/reconciliations/${reconciliation._id}`
                                )
                              }
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              View Details
                            </button>
                            {reconciliation.status !== "resolved" &&
                              reconciliation.status !== "unresolved" &&
                              reconciliation.status !== "cancelled" && (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/admin/reconciliations/${reconciliation._id}/complete`
                                    )
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Complete
                                </button>
                              )}
                            {reconciliation.status !== "resolved" &&
                              reconciliation.status !== "unresolved" &&
                              reconciliation.status !== "cancelled" && (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/admin/reconciliations/${reconciliation._id}/cancel`
                                    )
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                  Cancel Case
                                </button>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal - Already responsive */}
      <AssignShaykhModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSubmit={handleAssignSubmit}
        reconciliationId={selectedReconciliationId}
        shaykhsList={shaykhsList}
      />
    </div>
  );
};

export default AdminReconciliationList;
