import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Tag,
  Download,
  ChevronDown,
  User,
  Phone,
  Mail,
  Home,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import ConvertIDtoSmallID from "../../../utils/IDconversion";

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

const TabButton = ({ active, children, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 text-sm flex items-center ${
      active
        ? "text-gray-900 border-b-2 border-green-700 font-medium"
        : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
    }`}
  >
    {children}
    {count !== undefined && (
      <span
        className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
          active ? "bg-green-700 text-white" : "bg-gray-200 text-gray-700"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

const CaseCard = ({ reconciliation, onClick }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getNextMeeting = () => {
    if (!reconciliation.meetings || reconciliation.meetings.length === 0) {
      return null;
    }

    const now = new Date();
    const upcomingMeetings = reconciliation.meetings
      .filter((m) => m.status === "scheduled" && new Date(m.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return upcomingMeetings.length > 0 ? upcomingMeetings[0] : null;
  };

  const nextMeeting = getNextMeeting();

  return (
    <div
      className="border border-gray-200 rounded-lg p-5 hover:shadow-md cursor-pointer transition-shadow"
      onClick={() => onClick(reconciliation._id)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {reconciliation.husband.firstName} & {reconciliation.wife.firstName}
          </h3>
          <p className="text-sm text-gray-500">
            Case #{ConvertIDtoSmallID(reconciliation._id)}
          </p>
        </div>
        <StatusBadge status={reconciliation.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <User className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">
            {reconciliation.husband.firstName} {reconciliation.husband.lastName}
          </span>
        </div>
        <div className="flex items-center">
          <User className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">
            {reconciliation.wife.firstName} {reconciliation.wife.lastName}
          </span>
        </div>
        <div className="flex items-center">
          <Phone className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">
            {reconciliation.husband.phone}
          </span>
        </div>
        <div className="flex items-center">
          <Phone className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">
            {reconciliation.wife.phone}
          </span>
        </div>
      </div>

      {nextMeeting && (
        <div className="bg-green-50 p-3 rounded-md border border-green-100 mb-4">
          <div className="flex items-center mb-1">
            <Calendar className="h-4 w-4 text-green-700 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Next Meeting
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {formatDate(nextMeeting.date)} at {nextMeeting.time} -{" "}
            {nextMeeting.location}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Assigned: {formatDate(reconciliation.createdAt)}
        </div>
        <button
          className="px-4 py-1.5 bg-green-700 text-white rounded-md text-sm hover:bg-green-800"
          onClick={(e) => {
            e.stopPropagation();
            onClick(reconciliation._id);
          }}
        >
          View Case
        </button>
      </div>
    </div>
  );
};

const ShaykhReconciliationList = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reconciliations, setReconciliations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRangeFilter, setDateRangeFilter] = useState({
    start: "",
    end: "",
  });
  const [statusCounts, setStatusCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchReconciliations();
  }, []);

  useEffect(() => {
    calculateStatusCounts();
  }, [reconciliations]);

  const fetchReconciliations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reconciliations/my-assignments");
      setReconciliations(res.data.reconciliations);
    } catch (err) {
      console.error("Error fetching reconciliations:", err);
      toast.error("Failed to load reconciliation cases");
    } finally {
      setLoading(false);
    }
  };

  const calculateStatusCounts = () => {
    const counts = {
      assigned: 0,
      "in-progress": 0,
      resolved: 0,
      unresolved: 0,
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
    if (activeTab !== "all") {
      filtered = filtered.filter((item) => item.status === activeTab);
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
          (item.issueDescription &&
            item.issueDescription
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  const handleViewCase = (id) => {
    navigate(`/shaykh/reconciliations/${id}`);
  };

  const filteredReconciliations = getFilteredReconciliations();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              My Reconciliation Cases
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your assigned reconciliation cases
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter size={16} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <TabButton
                active={activeTab === "all"}
                onClick={() => setActiveTab("all")}
                count={reconciliations.length}
              >
                All Cases
              </TabButton>
              <TabButton
                active={activeTab === "assigned"}
                onClick={() => setActiveTab("assigned")}
                count={statusCounts.assigned}
              >
                <Clock size={16} className="mr-1.5" />
                Newly Assigned
              </TabButton>
              <TabButton
                active={activeTab === "in-progress"}
                onClick={() => setActiveTab("in-progress")}
                count={statusCounts["in-progress"]}
              >
                <Calendar size={16} className="mr-1.5" />
                In Progress
              </TabButton>
              <TabButton
                active={activeTab === "resolved"}
                onClick={() => setActiveTab("resolved")}
                count={statusCounts.resolved}
              >
                <CheckCircle size={16} className="mr-1.5" />
                Resolved
              </TabButton>
              <TabButton
                active={activeTab === "unresolved"}
                onClick={() => setActiveTab("unresolved")}
                count={statusCounts.unresolved}
              >
                <AlertCircle size={16} className="mr-1.5" />
                Unresolved
              </TabButton>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search cases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                  onClick={fetchReconciliations}
                >
                  Refresh
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Date Filters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      setDateRangeFilter({ start: "", end: "" });
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded mr-2"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
              </div>
            ) : filteredReconciliations.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-3">
                  No reconciliation cases found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setActiveTab("all");
                    setSearchQuery("");
                    setDateRangeFilter({ start: "", end: "" });
                  }}
                  className="px-4 py-2 text-sm text-green-700 border border-green-700 rounded-md hover:bg-green-50"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredReconciliations.map((reconciliation) => (
                  <CaseCard
                    key={reconciliation._id}
                    reconciliation={reconciliation}
                    onClick={handleViewCase}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShaykhReconciliationList;
