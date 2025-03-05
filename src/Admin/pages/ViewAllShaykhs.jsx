// src/pages/ShaykhList.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import shaykhService from "../services/shaykhService";
import {
  FaUserPlus,
  FaTrash,
  FaGraduationCap,
  FaBuilding,
  FaUserTie,
  FaPhone,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";

const KPICard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
    <div className={`flex-shrink-0 p-3 rounded-full ${color}`}>{icon}</div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

const ShaykhList = () => {
  const navigate = useNavigate();
  const [shaykhs, setShaykhs] = useState([]);
  const [filteredShaykhs, setFilteredShaykhs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("firstName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [expandedShaykh, setExpandedShaykh] = useState(null);

  // KPI data
  const [kpiData, setKpiData] = useState({
    totalShaykhs: 0,
    averageExperience: 0,
    institutionCount: 0,
    maxExperience: 0,
  });

  const fetchShaykhs = async () => {
    try {
      setLoading(true);
      const response = await shaykhService.getAllShaykhs();
      setShaykhs(response.data.shaykhs);
      setFilteredShaykhs(response.data.shaykhs);

      // Calculate KPIs
      const totalShaykhs = response.data.shaykhs.length;

      // Average experience
      const totalExperience = response.data.shaykhs.reduce(
        (sum, shaykh) => sum + (parseInt(shaykh.yearsOfExperience) || 0),
        0
      );
      const averageExperience =
        totalShaykhs > 0 ? (totalExperience / totalShaykhs).toFixed(1) : 0;

      // Count unique institutions
      const uniqueInstitutions = new Set(
        response.data.shaykhs.map((shaykh) => shaykh.educationalInstitution)
      );

      // Find maximum experience
      const maxExperience = response.data.shaykhs.reduce(
        (max, shaykh) => Math.max(max, parseInt(shaykh.yearsOfExperience) || 0),
        0
      );

      setKpiData({
        totalShaykhs,
        averageExperience,
        institutionCount: uniqueInstitutions.size,
        maxExperience,
      });
    } catch (err) {
      setError("Failed to load shaykhs. Please try again.");
      console.error("Error fetching shaykhs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShaykhs();
  }, []);

  useEffect(() => {
    // Filter shaykhs based on search term
    const filtered = shaykhs.filter(
      (shaykh) =>
        shaykh.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shaykh.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shaykh.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shaykh.educationalInstitution
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    // Sort shaykhs
    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle numeric fields
      if (sortField === "yearsOfExperience") {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      }

      // Handle alphabetical comparisons
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredShaykhs(sorted);
  }, [shaykhs, searchTerm, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this shaykh?")) {
      try {
        await shaykhService.deleteShaykh(id);
        // Refresh the list after deletion
        fetchShaykhs();
      } catch (err) {
        setError("Failed to delete shaykh. Please try again.");
        console.error("Error deleting shaykh:", err);
      }
    }
  };

  const toggleExpandShaykh = (id) => {
    if (expandedShaykh === id) {
      setExpandedShaykh(null);
    } else {
      setExpandedShaykh(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
          <p className="mt-2 text-lg text-gray-700">Loading shaykhs...</p>
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
              Shaykh Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View, add, and manage shaykhs in the system
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Shaykhs"
            value={kpiData.totalShaykhs}
            icon={<FaUserTie className="h-6 w-6 text-blue-500" />}
            color="bg-blue-100"
          />
          <KPICard
            title="Avg. Experience (years)"
            value={kpiData.averageExperience}
            icon={<FaGraduationCap className="h-6 w-6 text-green-500" />}
            color="bg-green-100"
          />
          <KPICard
            title="Unique Institutions"
            value={kpiData.institutionCount}
            icon={<FaBuilding className="h-6 w-6 text-purple-500" />}
            color="bg-purple-100"
          />
          <KPICard
            title="Highest Experience"
            value={`${kpiData.maxExperience} years`}
            icon={<FaUserTie className="h-6 w-6 text-amber-500" />}
            color="bg-amber-100"
          />
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search shaykhs..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/add-shaykh")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FaUserPlus className="mr-2 -ml-1 h-4 w-4" />
            Add New Shaykh
          </button>
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

        {filteredShaykhs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FaUserTie className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No shaykhs found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? `No results match "${searchTerm}"`
                : "Get started by adding a new shaykh."}
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/admin/add-shaykh")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <FaUserPlus className="mr-2 -ml-1 h-4 w-4" />
                Add New Shaykh
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("firstName")}
                    >
                      <div className="flex items-center">
                        <span>Name</span>
                        {sortField === "firstName" && (
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
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center">
                        <span>Email</span>
                        {sortField === "email" && (
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
                      onClick={() => handleSort("yearsOfExperience")}
                    >
                      <div className="flex items-center">
                        <span>Experience</span>
                        {sortField === "yearsOfExperience" && (
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
                      onClick={() => handleSort("educationalInstitution")}
                    >
                      <div className="flex items-center">
                        <span>Institution</span>
                        {sortField === "educationalInstitution" && (
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredShaykhs.map((shaykh) => (
                    <React.Fragment key={shaykh._id}>
                      <tr
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleExpandShaykh(shaykh._id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <FaUserTie className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {shaykh.firstName} {shaykh.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                Username: {shaykh.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {shaykh.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {shaykh.yearsOfExperience} years
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {shaykh.educationalInstitution}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(shaykh._id);
                            }}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                          >
                            <FaTrash className="h-4 w-4 mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                      {expandedShaykh === shaykh._id && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Contact Information
                                </h4>
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-600 flex items-center">
                                    <FaPhone className="h-4 w-4 mr-2 text-gray-400" />
                                    {shaykh.phoneNumber}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">
                                      Address:
                                    </span>{" "}
                                    {shaykh.address}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Additional Details
                                </h4>
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Role:</span>{" "}
                                    {shaykh.role}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">ID:</span>{" "}
                                    {shaykh._id}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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

export default ShaykhList;
