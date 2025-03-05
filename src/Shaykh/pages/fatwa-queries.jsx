// src/pages/ShaykhFatwaQueries.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Search, SlidersHorizontal, X } from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../Contexts/AuthContext";
import api from "../../utils/api";

const FatwaModal = ({ isOpen, onClose, query, onSubmitAnswer }) => {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query && query.answer) {
      setAnswer(query.answer);
    } else {
      setAnswer("");
    }
  }, [query]);

  if (!isOpen || !query) return null;

  const isAnswered = query.status === "answered";

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setLoading(true);
    setError("");

    try {
      await onSubmitAnswer(query._id, answer);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl text-gray-900">
              Query {query._id?.substring(0, 10)}
            </h2>
            <p className="text-gray-500 mt-1">{query.title}</p>
            <p className="text-gray-500 mt-1">
              From: {query.user?.username || "User"}
            </p>
          </div>
          <img src={logo} alt="Fiqh Council Logo" className="h-16" />
        </div>

        <div className="mb-6">
          <p className="text-gray-900 text-lg">"{query.question}"</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {isAnswered ? (
          <div className="mb-6">
            <h3 className="font-medium mb-2">Response:</h3>
            <p className="text-gray-700">{query.answer}</p>
            <div className="text-right mt-4 text-gray-600">
              - {query.answeredBy?.name || "You"}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitAnswer}>
            <div>
              <h3 className="font-medium mb-2">Add Response:</h3>
              <textarea
                className="w-full border rounded-lg p-3 min-h-[200px]"
                placeholder="Write your fatwa response here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 mr-2"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Response"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const ShaykhFatwaQueries = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check if user has shaykh permission
  const isShaykh = currentUser?.role === "shaykh";

  // Fetch assigned fatwas for shaykh
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        setError("");

        // Get all assigned fatwas for the logged-in shaykh
        const response = await api.get("/fatwas/assigned");
        setQueries(response.data.fatwas);
      } catch (err) {
        setError("Failed to load fatwa queries");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated() && isShaykh) {
      fetchQueries();
    }
  }, [isAuthenticated, isShaykh]);

  // Redirect if not authenticated or not shaykh
  useEffect(() => {
    if (!isAuthenticated() && !loading) {
      navigate("/login", { state: { from: "/shaykh-fatwa-queries" } });
    } else if (isAuthenticated() && !isShaykh && !loading) {
      navigate("/dashboard"); // Redirect to dashboard if not a shaykh
    }
  }, [isAuthenticated, isShaykh, loading, navigate]);

  const handleSubmitAnswer = async (queryId, answerText) => {
    try {
      await api.put(`/fatwas/${queryId}/answer`, { answer: answerText });

      // Refresh the query list
      const response = await api.get("/fatwas/assigned");
      setQueries(response.data.fatwas);
    } catch (err) {
      console.error("Failed to submit answer:", err);
      throw err;
    }
  };

  const handleQueryClick = (query) => {
    setSelectedQuery(query);
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredQueries = queries.filter((query) => {
    const matchesSearch =
      query.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      query._id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Answered" && query.status === "answered") ||
      (activeTab === "Waiting for response" && query.status === "assigned");

    return matchesSearch && matchesTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Assigned Fatwa Queries
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            View and respond to assigned fatwa queries
          </p>
        </div>
        {/* <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 mt-3 md:mt-0">
          <Download className="w-4 h-4" />
          Download PDF Report
        </button> */}
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 md:p-4 rounded-lg mb-4 md:mb-6 text-sm md:text-base">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-4 md:gap-8 border-b mb-4 md:mb-6 overflow-x-auto">
        {[
          { id: "All", label: "All" },
          { id: "Answered", label: "Answered" },
          { id: "Waiting for response", label: "Waiting for response" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`py-2 px-1 -mb-px text-sm md:text-base whitespace-nowrap ${
              activeTab === tab.id
                ? "border-b-2 border-green-600 text-green-600 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Subject or ID"
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm md:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm md:text-base">
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </button>
      </div>

      {filteredQueries.length === 0 ? (
        <div className="p-4 md:p-8 text-center text-gray-500 text-sm md:text-base">
          No fatwa queries found.{" "}
          {activeTab !== "All" && "Try changing your filter."}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="min-w-full px-4 md:px-0">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3 font-medium text-gray-500 text-xs md:text-sm">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="pb-3 font-medium text-gray-500 text-xs md:text-sm">
                    ID
                  </th>
                  <th className="pb-3 font-medium text-gray-500 text-xs md:text-sm">
                    SUBJECT
                  </th>
                  <th className="pb-3 font-medium text-gray-500 text-xs md:text-sm">
                    DATE
                  </th>
                  <th className="pb-3 font-medium text-gray-500 text-xs md:text-sm">
                    STATUS
                  </th>
                  <th className="pb-3 font-medium text-gray-500 text-xs md:text-sm hidden md:table-cell">
                    CATEGORY
                  </th>
                  <th className="pb-3 font-medium text-gray-500 text-xs md:text-sm"></th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.map((query) => (
                  <tr key={query._id} className="border-b last:border-b-0">
                    <td className="py-3 md:py-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="py-3 md:py-4 text-gray-600 text-xs md:text-sm">
                      {query._id.substring(0, 6)}
                    </td>
                    <td className="py-3 md:py-4 text-gray-900 text-xs md:text-sm max-w-[120px] md:max-w-none truncate">
                      {query.title}
                    </td>
                    <td className="py-3 md:py-4 text-gray-600 text-xs md:text-sm whitespace-nowrap">
                      {formatDate(query.createdAt)}
                    </td>
                    <td className="py-3 md:py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs ${
                          query.status === "answered"
                            ? "bg-green-50 text-green-700"
                            : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {query.status === "answered" ? "Answered" : "Waiting"}
                      </span>
                    </td>
                    <td className="py-3 md:py-4 text-gray-900 capitalize text-xs md:text-sm hidden md:table-cell">
                      {query.category || "General"}
                    </td>
                    <td className="py-3 md:py-4">
                      <button
                        className={`px-2 md:px-4 py-1 text-white text-xs md:text-sm rounded hover:bg-green-700 ${
                          query.status === "answered"
                            ? "bg-green-600"
                            : "bg-green-600"
                        }`}
                        onClick={() => handleQueryClick(query)}
                      >
                        {query.status === "answered" ? "View" : "Answer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <FatwaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        query={selectedQuery}
        onSubmitAnswer={handleSubmitAnswer}
      />
    </div>
  );
};

export default ShaykhFatwaQueries;
