// src/pages/MarriageQueries.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import marriageService from "../../services/marriageServices";
import { format } from "date-fns";
import AddMarriageModal from "./AddMarriageModal";
import ConvertIDtoSmallID from "../../../utils/IDconversion";

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
  let bgColor = "bg-gray-50";
  let textColor = "text-gray-700";

  switch (status) {
    case "completed":
      bgColor = "bg-green-50";
      textColor = "text-green-700";
      break;
    case "assigned":
      bgColor = "bg-blue-50";
      textColor = "text-blue-700";
      break;
    case "in-progress":
      bgColor = "bg-purple-50";
      textColor = "text-purple-700";
      break;
    case "pending":
      bgColor = "bg-orange-50";
      textColor = "text-orange-700";
      break;
    case "cancelled":
      bgColor = "bg-red-50";
      textColor = "text-red-700";
      break;
  }

  return (
    <span className={`px-2 py-1 text-sm rounded-md ${bgColor} ${textColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const MarriageQueries = () => {
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [marriages, setMarriages] = useState([]);
  const [filteredMarriages, setFilteredMarriages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMarriages();
  }, []);

  const fetchMarriages = async () => {
    try {
      setLoading(true);
      const response = await marriageService.getUserMarriages();
      setMarriages(response.data.marriages);
      setFilteredMarriages(response.data.marriages);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch marriage queries. Please try again.");
      console.error("Error fetching marriages:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filter marriages based on tab selection and search query
    let filtered = [...marriages];

    // Apply tab filters
    if (selectedTab === "Answered") {
      filtered = filtered.filter((marriage) => marriage.status === "completed");
    } else if (selectedTab === "Waiting") {
      filtered = filtered.filter((marriage) =>
        ["pending", "assigned", "in-progress"].includes(marriage.status)
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

    setFilteredMarriages(filtered);
  }, [marriages, selectedTab, searchQuery]);

  const handleViewQuery = (marriage) => {
    navigate(`/user/marriage-queries/${marriage._id}`);
  };

  const handleAddMarriage = (newMarriage) => {
    setMarriages([newMarriage, ...marriages]);
    setIsAddModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
          <p className="mt-2 text-lg text-gray-700">
            Loading marriage queries...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Marriage Queries
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage your marriage queries
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-primary-700 text-white text-sm font-medium rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <div className="flex">
            <TabButton
              active={selectedTab === "All"}
              onClick={() => setSelectedTab("All")}
            >
              All
            </TabButton>
            <TabButton
              active={selectedTab === "Answered"}
              onClick={() => setSelectedTab("Answered")}
            >
              Answered
            </TabButton>
            <TabButton
              active={selectedTab === "Waiting"}
              onClick={() => setSelectedTab("Waiting")}
            >
              Waiting for response
            </TabButton>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg mb-6 flex justify-between items-center shadow-sm">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Name or ID"
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

        {/* No results */}
        {filteredMarriages.length === 0 && !loading && (
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
              No marriage queries found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? `No results match "${searchQuery}"`
                : "Get started by creating a new marriage query."}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Create new query
              </button>
            </div>
          </div>
        )}

        {/* Responsive Table/Cards */}
        {filteredMarriages.length > 0 && (
          <>
            {/* Mobile Cards View */}
            <div className="sm:hidden space-y-4">
              {filteredMarriages.map((marriage) => (
                <div
                  key={marriage._id}
                  className="bg-white rounded-lg shadow p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-medium text-gray-500">
                      ID: {marriage._id.substring(0, 8)}...
                    </span>
                    <StatusBadge status={marriage.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="text-sm font-medium">
                        {marriage.type === "reservation"
                          ? "Reservation"
                          : "Certificate"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-sm font-medium">
                        {format(new Date(marriage.createdAt), "MM/dd/yy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Assigned Shaykh</p>
                      <p className="text-sm font-medium">
                        {marriage.assignedShaykh
                          ? `${marriage.assignedShaykh.firstName} ${marriage.assignedShaykh.lastName}`
                          : "Not assigned"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewQuery(marriage)}
                    className="w-full px-4 py-2 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-800"
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
                        Type
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
                    {filteredMarriages.map((marriage) => (
                      <tr key={marriage._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary-700 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ConvertIDtoSmallID(marriage._id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {marriage.type === "reservation"
                            ? "Reservation"
                            : "Certificate"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(marriage.createdAt), "MM/dd/yy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={marriage.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {marriage.assignedShaykh
                            ? `${marriage.assignedShaykh.firstName} ${marriage.assignedShaykh.lastName}`
                            : "Not assigned"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewQuery(marriage)}
                            className="px-4 py-2 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-800"
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
      </div>

      {isAddModalOpen && (
        <AddMarriageModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddMarriage}
        />
      )}
    </div>
  );
};

export default MarriageQueries;
