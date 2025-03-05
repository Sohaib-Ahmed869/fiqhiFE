// src/pages/shaykh/ShaykhMarriageList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import marriageService from "../../../User/services/marriageServices";
import { format } from "date-fns";
import {
  FaUsers,
  FaCalendarAlt,
  FaFileAlt,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaClipboardCheck,
} from "react-icons/fa";

const KPICard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 flex items-center border-l-4 border-green-500">
    <div className={`flex-shrink-0 p-3 rounded-full ${color}`}>{icon}</div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

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
      className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ShaykhMarriageList = () => {
  const navigate = useNavigate();
  const [marriages, setMarriages] = useState([]);
  const [filteredMarriages, setFilteredMarriages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  // KPI data
  const [kpiData, setKpiData] = useState({
    totalAssignments: 0,
    pendingMeetings: 0,
    reservations: 0,
    certificates: 0,
  });

  useEffect(() => {
    fetchMarriages();
  }, []);

  const fetchMarriages = async () => {
    try {
      setLoading(true);
      const response = await marriageService.getShaykhAssignments();
      setMarriages(response.data.marriages);
      setFilteredMarriages(response.data.marriages);

      // Calculate KPIs
      const total = response.data.marriages.length;
      const pendingMeetings = response.data.marriages.filter((m) =>
        m.meetings
          ? m.meetings.some((meeting) => meeting.status === "scheduled")
          : false
      ).length;
      const reservations = response.data.marriages.filter(
        (m) => m.type === "reservation"
      ).length;
      const certificates = response.data.marriages.filter(
        (m) => m.type === "certificate"
      ).length;

      setKpiData({
        totalAssignments: total,
        pendingMeetings,
        reservations,
        certificates,
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to load marriage assignments. Please try again.");
      console.error("Error fetching marriages:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filter and sort marriages
    let filtered = [...marriages];

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((marriage) => marriage.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (marriage) => marriage.status === statusFilter
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (marriage) =>
          marriage.partnerOne?.firstName?.toLowerCase().includes(query) ||
          marriage.partnerOne?.lastName?.toLowerCase().includes(query) ||
          marriage.partnerTwo?.firstName?.toLowerCase().includes(query) ||
          marriage.partnerTwo?.lastName?.toLowerCase().includes(query) ||
          marriage._id?.toLowerCase().includes(query)
      );
    }

    // Sort marriages
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle special cases for nested fields
      if (sortField === "partnerOneName") {
        aValue = a.partnerOne
          ? `${a.partnerOne.firstName} ${a.partnerOne.lastName}`
          : "";
        bValue = b.partnerOne
          ? `${b.partnerOne.firstName} ${b.partnerOne.lastName}`
          : "";
      }

      // Convert dates to timestamps for comparison
      if (sortField === "createdAt" || sortField === "updatedAt") {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredMarriages(filtered);
  }, [
    marriages,
    searchQuery,
    typeFilter,
    statusFilter,
    sortField,
    sortDirection,
  ]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewMarriage = (marriage) => {
    navigate(`/shaykh/marriages/${marriage._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full" />
          <p className="mt-2 text-lg text-gray-700">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              My Marriage Assignments
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage your assigned marriage applications
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Assignments"
            value={kpiData.totalAssignments}
            icon={<FaUsers className="h-6 w-6 text-green-500" />}
            color="bg-green-100"
          />
          <KPICard
            title="Pending Meetings"
            value={kpiData.pendingMeetings}
            icon={<FaCalendarAlt className="h-6 w-6 text-yellow-500" />}
            color="bg-yellow-100"
          />
          <KPICard
            title="Reservations"
            value={kpiData.reservations}
            icon={<FaClipboardCheck className="h-6 w-6 text-blue-500" />}
            color="bg-blue-100"
          />
          <KPICard
            title="Certificates"
            value={kpiData.certificates}
            icon={<FaFileAlt className="h-6 w-6 text-purple-500" />}
            color="bg-purple-100"
          />
        </div>

        {/* Action Bar */}
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 gap-4">
              {/* Search */}
              <div className="relative md:w-1/3">
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <div>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="reservation">Reservations</option>
                    <option value="certificate">Certificates</option>
                  </select>
                </div>
                <div>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Marriage List */}
        {filteredMarriages.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No assignments found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "You don't have any marriage assignments yet"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        <span>Assigned Date</span>
                        {sortField === "createdAt" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? (
                              <FaSortAmountUp className="h-3 w-3" />
                            ) : (
                              <FaSortAmountDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center">
                        <span>Type</span>
                        {sortField === "type" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? (
                              <FaSortAmountUp className="h-3 w-3" />
                            ) : (
                              <FaSortAmountDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("partnerOneName")}
                    >
                      <div className="flex items-center">
                        <span>Couple</span>
                        {sortField === "partnerOneName" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? (
                              <FaSortAmountUp className="h-3 w-3" />
                            ) : (
                              <FaSortAmountDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        <span>Status</span>
                        {sortField === "status" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? (
                              <FaSortAmountUp className="h-3 w-3" />
                            ) : (
                              <FaSortAmountDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Action
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMarriages.map((marriage) => (
                    <tr key={marriage._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(marriage.createdAt), "dd MMM yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {marriage.type === "reservation"
                          ? "Reservation"
                          : "Certificate"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {marriage.partnerOne.firstName}{" "}
                        {marriage.partnerOne.lastName} &{" "}
                        {marriage.partnerTwo.firstName}{" "}
                        {marriage.partnerTwo.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={marriage.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {marriage.type === "reservation" &&
                        marriage.status === "assigned"
                          ? "Schedule Meeting"
                          : marriage.type === "certificate" &&
                            marriage.status === "assigned"
                          ? "Upload Certificate"
                          : marriage.meetings &&
                            marriage.meetings.some(
                              (m) => m.status === "scheduled"
                            )
                          ? "Complete Meeting"
                          : "Review Application"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewMarriage(marriage)}
                          className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md"
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
        )}
      </div>
    </div>
  );
};

export default ShaykhMarriageList;
