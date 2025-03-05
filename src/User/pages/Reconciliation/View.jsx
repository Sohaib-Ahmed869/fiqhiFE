import React, { useState, useEffect } from "react";
import { Search, X, Menu, RefreshCw, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import ConvertIDtoSmallID from "../../../utils/IDconversion";

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 text-sm whitespace-nowrap ${
      active
        ? "text-gray-900 border-b-2 border-green-700 font-medium"
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {children}
  </button>
);

const CreateReconciliationModal = ({ isOpen, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    husband: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    },
    wife: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    },
    issueDescription: "",
    additionalInformation: "",
  });

  const handleChange = (e, person, field) => {
    if (person) {
      setFormData({
        ...formData,
        [person]: {
          ...formData[person],
          [field]: e.target.value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/reconciliations", formData);
      toast.success("Reconciliation request submitted successfully!");
      onSubmit(res.data.reconciliation);
      onClose();
      // Reset form data
      setFormData({
        husband: { firstName: "", lastName: "", phone: "", email: "" },
        wife: { firstName: "", lastName: "", phone: "", email: "" },
        issueDescription: "",
        additionalInformation: "",
      });
    } catch (err) {
      console.error(
        "Error submitting reconciliation request:",
        err.response?.data?.error || err.message
      );
      toast.error(
        err.response?.data?.error || "Failed to submit reconciliation request"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Request Reconciliation
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="text-md sm:text-lg font-medium text-gray-800 mb-3">
                Husband Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="husbandFirstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="husbandFirstName"
                    value={formData.husband.firstName}
                    onChange={(e) => handleChange(e, "husband", "firstName")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="husbandLastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="husbandLastName"
                    value={formData.husband.lastName}
                    onChange={(e) => handleChange(e, "husband", "lastName")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="husbandPhone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="husbandPhone"
                    value={formData.husband.phone}
                    onChange={(e) => handleChange(e, "husband", "phone")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="husbandEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email*
                  </label>
                  <input
                    type="email"
                    id="husbandEmail"
                    value={formData.husband.email}
                    onChange={(e) => handleChange(e, "husband", "email")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-md sm:text-lg font-medium text-gray-800 mb-3">
                Wife Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="wifeFirstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="wifeFirstName"
                    value={formData.wife.firstName}
                    onChange={(e) => handleChange(e, "wife", "firstName")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="wifeLastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="wifeLastName"
                    value={formData.wife.lastName}
                    onChange={(e) => handleChange(e, "wife", "lastName")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="wifePhone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="wifePhone"
                    value={formData.wife.phone}
                    onChange={(e) => handleChange(e, "wife", "phone")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="wifeEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email*
                  </label>
                  <input
                    type="email"
                    id="wifeEmail"
                    value={formData.wife.email}
                    onChange={(e) => handleChange(e, "wife", "email")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="issueDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description of Issues*
              </label>
              <textarea
                id="issueDescription"
                name="issueDescription"
                value={formData.issueDescription}
                onChange={(e) => handleChange(e)}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Please provide a brief description of the issues requiring reconciliation"
                required
              ></textarea>
            </div>

            <div className="mb-6">
              <label
                htmlFor="additionalInformation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Additional Information
              </label>
              <textarea
                id="additionalInformation"
                name="additionalInformation"
                value={formData.additionalInformation}
                onChange={(e) => handleChange(e)}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Any other details that might be helpful"
              ></textarea>
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
                disabled={loading}
                className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ReconciliationCard = ({
  reconciliation,
  navigate,
  getStatusColor,
  formatDate,
}) => (
  <div className="bg-white p-4 rounded-md shadow mb-4 border border-gray-100">
    <div className="flex justify-between items-center mb-2">
      <span className="font-medium">
        Case #{ConvertIDtoSmallID(reconciliation._id)}
      </span>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
          reconciliation.status
        )}`}
      >
        {reconciliation.status.charAt(0).toUpperCase() +
          reconciliation.status.slice(1)}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
      <div>
        <p className="text-gray-500">Husband</p>
        <p>
          {reconciliation.husband.firstName} {reconciliation.husband.lastName}
        </p>
      </div>
      <div>
        <p className="text-gray-500">Wife</p>
        <p>
          {reconciliation.wife.firstName} {reconciliation.wife.lastName}
        </p>
      </div>
      <div>
        <p className="text-gray-500">Submitted</p>
        <p>{formatDate(reconciliation.createdAt)}</p>
      </div>
      <div>
        <p className="text-gray-500">Assigned Shaykh</p>
        <p>
          {reconciliation.assignedShaykh
            ? `${reconciliation.assignedShaykh.firstName || ""} ${
                reconciliation.assignedShaykh.lastName || ""
              }`
            : "Not Assigned"}
        </p>
      </div>
    </div>
    <button
      className="w-full px-4 py-2 text-sm text-white bg-green-700 rounded-md hover:bg-green-800 flex items-center justify-center gap-2"
      onClick={() =>
        navigate(`/user/reconciliation-queries/${reconciliation._id}`)
      }
    >
      View Details <ChevronRight className="h-4 w-4" />
    </button>
  </div>
);

const ReconciliationQueries = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reconciliations, setReconciliations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReconciliations();

    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchReconciliations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reconciliations/my-cases");
      setReconciliations(res.data.reconciliations);
    } catch (err) {
      console.error("Error fetching reconciliations:", err);
      toast.error("Failed to load reconciliation cases");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredQueries = () => {
    let filtered = reconciliations;

    // Filter by tab
    if (activeTab === "Resolved") {
      filtered = filtered.filter((query) => query.status === "resolved");
    } else if (activeTab === "Unresolved") {
      filtered = filtered.filter((query) => query.status === "unresolved");
    } else if (activeTab === "InProgress") {
      filtered = filtered.filter(
        (query) => query.status === "in-progress" || query.status === "assigned"
      );
    } else if (activeTab === "Pending") {
      filtered = filtered.filter((query) => query.status === "pending");
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (query) =>
          query._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (query.husband.firstName + " " + query.husband.lastName)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (query.wife.firstName + " " + query.wife.lastName)
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "unresolved":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleAddNewReconciliation = (newReconciliation) => {
    setReconciliations([newReconciliation, ...reconciliations]);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Reconciliation Queries
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View and add your reconciliation queries
            </p>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <button
              className="flex-1 sm:flex-none px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800"
              onClick={() => setIsModalOpen(true)}
            >
              + Add New Request
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {mobileView ? (
            <div className="border-b border-gray-200 relative">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="font-medium">
                  {activeTab === "All" ? "All Cases" : activeTab}
                </span>
                <button onClick={toggleMenu} className="text-gray-500">
                  <Menu className="h-5 w-5" />
                </button>
              </div>
              {menuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white z-10 shadow-md border-t border-gray-200">
                  <button
                    className={`w-full text-left px-6 py-3 text-sm ${
                      activeTab === "All" ? "bg-gray-100 font-medium" : ""
                    }`}
                    onClick={() => {
                      setActiveTab("All");
                      setMenuOpen(false);
                    }}
                  >
                    All
                  </button>
                  <button
                    className={`w-full text-left px-6 py-3 text-sm ${
                      activeTab === "Pending" ? "bg-gray-100 font-medium" : ""
                    }`}
                    onClick={() => {
                      setActiveTab("Pending");
                      setMenuOpen(false);
                    }}
                  >
                    Pending
                  </button>
                  <button
                    className={`w-full text-left px-6 py-3 text-sm ${
                      activeTab === "InProgress"
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveTab("InProgress");
                      setMenuOpen(false);
                    }}
                  >
                    In Progress
                  </button>
                  <button
                    className={`w-full text-left px-6 py-3 text-sm ${
                      activeTab === "Resolved" ? "bg-gray-100 font-medium" : ""
                    }`}
                    onClick={() => {
                      setActiveTab("Resolved");
                      setMenuOpen(false);
                    }}
                  >
                    Resolved
                  </button>
                  <button
                    className={`w-full text-left px-6 py-3 text-sm ${
                      activeTab === "Unresolved"
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveTab("Unresolved");
                      setMenuOpen(false);
                    }}
                  >
                    Unresolved
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="border-b border-gray-200 overflow-x-auto">
              <div className="flex">
                <TabButton
                  active={activeTab === "All"}
                  onClick={() => setActiveTab("All")}
                >
                  All
                </TabButton>
                <TabButton
                  active={activeTab === "Pending"}
                  onClick={() => setActiveTab("Pending")}
                >
                  Pending
                </TabButton>
                <TabButton
                  active={activeTab === "InProgress"}
                  onClick={() => setActiveTab("InProgress")}
                >
                  In Progress
                </TabButton>
                <TabButton
                  active={activeTab === "Resolved"}
                  onClick={() => setActiveTab("Resolved")}
                >
                  Resolved
                </TabButton>
                <TabButton
                  active={activeTab === "Unresolved"}
                  onClick={() => setActiveTab("Unresolved")}
                >
                  Unresolved
                </TabButton>
              </div>
            </div>
          )}

          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-3">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search by Case # or Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <button
                className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-md"
                onClick={fetchReconciliations}
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
                <p className="mt-2 text-gray-500">
                  Loading reconciliation cases...
                </p>
              </div>
            ) : getFilteredQueries().length === 0 ? (
              <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No reconciliation cases found.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800"
                >
                  Create New Request
                </button>
              </div>
            ) : (
              <>
                {/* Mobile view: Cards */}
                {mobileView && (
                  <div className="sm:hidden">
                    {getFilteredQueries().map((reconciliation) => (
                      <ReconciliationCard
                        key={reconciliation._id}
                        reconciliation={reconciliation}
                        navigate={navigate}
                        getStatusColor={getStatusColor}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                )}

                {/* Desktop view: Table */}
                {!mobileView && (
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                          <th className="pb-4 font-medium">
                            <input type="checkbox" className="mr-3" />
                            CASE NUMBER
                          </th>
                          <th className="pb-4 font-medium">HUSBAND</th>
                          <th className="pb-4 font-medium">WIFE</th>
                          <th className="pb-4 font-medium">SUBMITTED DATE</th>
                          <th className="pb-4 font-medium">STATUS</th>
                          <th className="pb-4 font-medium">ASSIGNED SHAYKH</th>
                          <th className="pb-4 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredQueries().map((reconciliation) => (
                          <tr
                            key={reconciliation._id}
                            className="border-b border-gray-100"
                          >
                            <td className="py-4">
                              <input type="checkbox" className="mr-3" />
                              {reconciliation._id.substring(0, 8)}...
                            </td>
                            <td className="py-4">
                              {reconciliation.husband.firstName}{" "}
                              {reconciliation.husband.lastName}
                            </td>
                            <td className="py-4">
                              {reconciliation.wife.firstName}{" "}
                              {reconciliation.wife.lastName}
                            </td>
                            <td className="py-4">
                              {formatDate(reconciliation.createdAt)}
                            </td>
                            <td className="py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  reconciliation.status
                                )}`}
                              >
                                {reconciliation.status.charAt(0).toUpperCase() +
                                  reconciliation.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-4">
                              {reconciliation.assignedShaykh
                                ? `${
                                    reconciliation.assignedShaykh.firstName ||
                                    ""
                                  } ${
                                    reconciliation.assignedShaykh.lastName || ""
                                  }`
                                : "Not Assigned"}
                            </td>
                            <td className="py-4">
                              <button
                                className="px-6 py-1.5 text-sm text-white bg-green-700 rounded-md hover:bg-green-800"
                                onClick={() =>
                                  navigate(
                                    `/user/reconciliation-queries/${reconciliation._id}`
                                  )
                                }
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <CreateReconciliationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddNewReconciliation}
      />
    </div>
  );
};

export default ReconciliationQueries;
