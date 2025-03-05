// src/pages/CertificatesGenerated.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const CertificatesGenerated = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for certificates
  const certificates = [
    {
      id: "5146846548465",
      subject: "Reservation",
      creationDate: "2/19/21",
      assignedShaykh: "Shaykh Asim",
    },
    {
      id: "5467319467348",
      subject: "Reservation",
      creationDate: "5/7/16",
      assignedShaykh: "Shaykh Asim",
    },
    {
      id: "1346705945446",
      subject: "Reservation",
      creationDate: "9/18/16",
      assignedShaykh: "Shaykh Asim",
    },
    {
      id: "544075497...",
      subject: "Reservation",
      creationDate: "2/11/12",
      assignedShaykh: "Shaykh Asim",
    },
    {
      id: "1243467984543",
      subject: "Certificate",
      creationDate: "9/18/16",
      assignedShaykh: "Shaykh Asim",
    },
    {
      id: "8454134649707",
      subject: "Certificate",
      creationDate: "1/28/17",
      assignedShaykh: "Shaykh Asim",
    },
    {
      id: "2130164040451",
      subject: "Certificate",
      creationDate: "5/27/15",
      assignedShaykh: "Shaykh Asim",
    },
    {
      id: "0439104645404",
      subject: "Certificate",
      creationDate: "8/2/19",
      assignedShaykh: "Shaykh Asim",
    },
  ];

  const handleViewCertificate = (id) => {
    // This would navigate to view the certificate or open it in a new tab
    // For example:
    // window.open(`/certificates/${id}`, '_blank');
    console.log(`Viewing certificate for ID: ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Certificates Generated
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View the certificates that have been generated...
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
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
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search by Subject"
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
          <button className="flex items-center px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter by type
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  Query Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Shaykh
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-700 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cert.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cert.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cert.creationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cert.assignedShaykh}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewCertificate(cert.id)}
                      className="bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-800"
                    >
                      View Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CertificatesGenerated;
