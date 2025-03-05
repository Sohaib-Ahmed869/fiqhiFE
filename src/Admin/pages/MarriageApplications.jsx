// src/pages/admin/AdminMarriageList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import marriageService from "../../User/services/marriageServices";
import shaykhService from "../services/shaykhService";
import { format } from "date-fns";
import {
  FaUsers,
  FaClipboardList,
  FaCalendarAlt,
  FaFileAlt,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaUserTie,
} from "react-icons/fa";

const KPICard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 flex items-center border-l-4 border-primary-500">
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

const AssignShaykhModal = ({ marriage, shaykhs, onClose, onAssign }) => {
  const [selectedShaykhId, setSelectedShaykhId] = useState("");
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
          <h3 className="text-lg font-medium text-gray-900">Assign Shaykh</h3>
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
              Assign this {marriage.type} request to a shaykh:
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
              {loading ? "Assigning..." : "Assign Shaykh"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminMarriageList = () => {
  const navigate = useNavigate();
  const [marriages, setMarriages] = useState([]);
  const [filteredMarriages, setFilteredMarriages] = useState([]);
  const [shaykhs, setShaykhs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedMarriage, setSelectedMarriage] = useState(null);

  // KPI data
  const [kpiData, setKpiData] = useState({
    totalMarriages: 0,
    pendingMarriages: 0,
    reservations: 0,
    certificates: 0,
  });

  useEffect(() => {
    fetchMarriages();
    fetchShaykhs();
  }, []);

  const fetchMarriages = async () => {
    try {
      setLoading(true);
      const response = await marriageService.getAllMarriages();
      setMarriages(response.data.marriages);
      setFilteredMarriages(response.data.marriages);

      // Calculate KPIs
      const total = response.data.marriages.length;
      const pending = response.data.marriages.filter((m) =>
        ["pending", "assigned"].includes(m.status)
      ).length;
      const reservations = response.data.marriages.filter(
        (m) => m.type === "reservation"
      ).length;
      const certificates = response.data.marriages.filter(
        (m) => m.type === "certificate"
      ).length;

      setKpiData({
        totalMarriages: total,
        pendingMarriages: pending,
        reservations,
        certificates,
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to load marriages. Please try again.");
      console.error("Error fetching marriages:", err);
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
      } else if (sortField === "assignedShaykhName") {
        aValue = a.assignedShaykh
          ? `${a.assignedShaykh.firstName} ${a.assignedShaykh.lastName}`
          : "";
        bValue = b.assignedShaykh
          ? `${b.assignedShaykh.firstName} ${b.assignedShaykh.lastName}`
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
    navigate(`/admin/marriage-applications/${marriage._id}`);
  };

  const handleAssignMarriage = (marriageId, shaykhId) => {
    return marriageService
      .assignMarriage(marriageId, shaykhId)
      .then((response) => {
        // Update the marriage in the list
        setMarriages(
          marriages.map((m) =>
            m._id === marriageId ? response.data.marriage : m
          )
        );
        return response;
      });
  };

  const openAssignModal = (marriage) => {
    setSelectedMarriage(marriage);
    setIsAssignModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
          <p className="mt-2 text-lg text-gray-700">Loading marriages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className=" shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Marriage Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage marriage reservations and certificates
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Marriages"
            value={kpiData.totalMarriages}
            icon={<FaUsers className="h-6 w-6 text-indigo-500" />}
            color="bg-indigo-100"
          />
          <KPICard
            title="Pending Marriages"
            value={kpiData.pendingMarriages}
            icon={<FaClipboardList className="h-6 w-6 text-yellow-500" />}
            color="bg-yellow-100"
          />
          <KPICard
            title="Reservations"
            value={kpiData.reservations}
            icon={<FaCalendarAlt className="h-6 w-6 text-blue-500" />}
            color="bg-blue-100"
          />
          <KPICard
            title="Certificates"
            value={kpiData.certificates}
            icon={<FaFileAlt className="h-6 w-6 text-green-500" />}
            color="bg-green-100"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
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
              No marriages found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "No marriage requests have been submitted yet"}
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
                        <span>Date</span>
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
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("assignedShaykhName")}
                    >
                      <div className="flex items-center">
                        <span>Assigned To</span>
                        {sortField === "assignedShaykhName" && (
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
                        {marriage.assignedShaykh ? (
                          <div className="flex items-center">
                           
                            {marriage.assignedShaykh.firstName}{" "}
                            {marriage.assignedShaykh.lastName}
                          </div>
                        ) : (
                          <span className="text-gray-500">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {marriage.status === "pending" && (
                            <button
                              onClick={() => openAssignModal(marriage)}
                              className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md"
                            >
                              Assign
                            </button>
                          )}
                          <button
                            onClick={() => handleViewMarriage(marriage)}
                            className="text-primary-600 hover:text-primary-900 bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-md"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Assign Shaykh Modal */}
      {isAssignModalOpen && selectedMarriage && (
        <AssignShaykhModal
          marriage={selectedMarriage}
          shaykhs={shaykhs}
          onClose={() => setIsAssignModalOpen(false)}
          onAssign={handleAssignMarriage}
        />
      )}
    </div>
  );
};

export default AdminMarriageList;
