import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../../Contexts/AuthContext";
import api from "../../utils/api";
import ConvertIDtoSmallID from "../../utils/IDconversion";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stats state
  const [stats, setStats] = useState({
    totalFatwas: 0,
    answeredFatwas: 0,
    pendingFatwas: 0,
    totalMarriages: 0,
    certificateRequests: 0,
    reservationRequests: 0,
    totalReconciliations: 0,
    totalShaykhs: 0,
  });

  // Dashboard data state
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [availableShaykhs, setAvailableShaykhs] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activityDistribution, setActivityDistribution] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all dashboard data from the new endpoint
        const response = await api.get("/admin-dashboard/dashboard");
        const dashboardData = response.data.data;

        // Update all the state variables from the unified response
        setStats(dashboardData.stats);
        setUpcomingMeetings(dashboardData.upcomingMeetings);
        setAvailableShaykhs(dashboardData.availableShaykhs);
        setRecentActivities(dashboardData.recentActivities);
        setActivityDistribution(dashboardData.activityDistribution);
        setMonthlyStats(dashboardData.monthlyStats);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (date) => {
    date = new Date(date);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${months[date.getMonth()]} ${date.getDate()}`;
    }
  };

  const formatTime = (timeString) => {
    // Convert 24h time to 12h time with AM/PM if needed
    return timeString;
  };

  const formatActivityDate = (date) => {
    date = new Date(date);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} ${month} ${year}`;
  };

  // Colors for pie chart
  const COLORS = ["#D97706", "#1E3A8A", "#0EA5E9", "#6B7280", "#F59E0B"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow p-6 max-w-md">
          <h2 className="text-lg font-medium text-red-600 mb-4">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Fatwa Stats */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-sm text-gray-600 mb-1">Total Fatwa's</h3>
            <p className="text-2xl font-semibold">{stats.totalFatwas}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex justify-between">
              <h3 className="text-sm text-gray-600 mb-1">Fatwa's Answered</h3>
              <span className="text-xs text-green-600 font-medium">New</span>
            </div>
            <p className="text-2xl font-semibold">{stats.answeredFatwas}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-sm text-gray-600 mb-1">Fatwa's Pending</h3>
            <p className="text-2xl font-semibold">{stats.pendingFatwas}</p>
          </div>

          {/* Marriage Stats */}
          <div className="bg-green-100 rounded-lg p-4">
            <h3 className="text-sm text-gray-600 mb-1">
              Total Marriage Applications
            </h3>
            <p className="text-2xl font-semibold">{stats.totalMarriages}</p>
          </div>

          <div className="bg-green-100 rounded-lg p-4">
            <div className="flex justify-between">
              <h3 className="text-sm text-gray-600 mb-1">
                Requests for Certificates
              </h3>
              <span className="text-xs text-green-600 font-medium">New</span>
            </div>
            <p className="text-2xl font-semibold">
              {stats.certificateRequests}
            </p>
          </div>

          <div className="bg-green-100 rounded-lg p-4">
            <h3 className="text-sm text-gray-600 mb-1">
              Requests for Reservation
            </h3>
            <p className="text-2xl font-semibold">
              {stats.reservationRequests}
            </p>
          </div>

          {/* Reconciliation Stats (Added) */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm text-gray-600 mb-1">
              Family Reconciliations
            </h3>
            <p className="text-2xl font-semibold">
              {stats.totalReconciliations}
            </p>
          </div>

          {/* Shaykh Stats (Added) */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm text-gray-600 mb-1">Available Shaykhs</h3>
            <p className="text-2xl font-semibold">{stats.totalShaykhs}</p>
          </div>
        </div>

        {/* Upcoming Meetings Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Upcoming Meetings
              </h2>
              <p className="text-sm text-gray-500">Shaykh's Schedule</p>
            </div>
            <a href="#" className="text-green-500 text-sm flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              All On Schedule
            </a>
          </div>

          <div className="space-y-6">
            {upcomingMeetings.length > 0 ? (
              upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex">
                  {/* Colored bar */}
                  <div
                    className={`w-1.5 rounded-full mr-4 ${
                      meeting.type.includes("Nikah")
                        ? "bg-blue-500"
                        : meeting.type.includes("Certificate")
                        ? "bg-green-500"
                        : "bg-pink-500"
                    }`}
                  ></div>

                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{meeting.type}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Client: {meeting.client}
                    </p>
                    <p className="text-xs text-gray-500">
                      Case ID: {ConvertIDtoSmallID(meeting?.caseID)}
                    </p>
                  </div>

                  <div className="w-40 text-center">
                    <div className="inline-block bg-blue-50 px-3 py-1 rounded text-xs text-gray-600">
                      {formatDate(meeting.date)} {", "}
                      {formatTime(meeting.time)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {meeting.location}
                    </p>
                  </div>

                  <div className="w-40">
                    <div className="text-xs text-gray-600 mb-1">
                      Progress ({meeting.progress.current} of{" "}
                      {meeting.progress.total})
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{
                          width: `${
                            (meeting.progress.current /
                              meeting.progress.total) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No upcoming meetings scheduled
              </p>
            )}
          </div>
        </div>

        {/* Available Shaykhs and Recent Activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Available Shaykhs */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Available Shaykhs
                </h2>
                <p className="text-sm text-gray-500">
                  Current on-call scholars
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {availableShaykhs.slice(0, 4).map((shaykh) => (
                <div
                  key={shaykh.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                      <img
                        src={`https://ui-avatars.com/api/?name=${shaykh.name
                          .split(" ")
                          .join("+")}&background=059669&color=fff`}
                        alt={shaykh.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Shaykh {shaykh.name.split(" ")[0]}
                      </p>
                      <p className="text-xs text-gray-500">{shaykh.email}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex flex-col items-end">
                    <span>{shaykh.location || "Sydney"}</span>
                    <span className="mt-1">
                      {shaykh.assignedCases} active cases
                    </span>
                  </div>
                </div>
              ))}

              {availableShaykhs.length === 0 && (
                <p className="text-center text-gray-500">
                  No shaykhs available
                </p>
              )}

              {availableShaykhs.length > 4 && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => navigate("/admin/shaykhs")}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    SEE ALL SHAYKHS
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Recent Activities
              </h2>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                See All Activities →
              </a>
            </div>

            <div className="text-sm text-gray-500 mb-4">
              Latest updates and system notifications
            </div>

            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex">
                  <div className="mr-4 mt-1">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        activity.type === "fatwa"
                          ? "bg-blue-100"
                          : activity.type === "marriage"
                          ? "bg-green-100"
                          : activity.type === "reconciliation"
                          ? "bg-pink-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          activity.type === "fatwa"
                            ? "bg-blue-500"
                            : activity.type === "marriage"
                            ? "bg-green-500"
                            : activity.type === "reconciliation"
                            ? "bg-pink-500"
                            : "bg-yellow-500"
                        }`}
                      ></div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">
                      {formatActivityDate(activity.date)}
                    </p>
                    <p className="text-sm">{activity.message}</p>
                  </div>
                </div>
              ))}

              {recentActivities.length === 0 && (
                <p className="text-center text-gray-500">
                  No recent activities
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Activity Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Activity Distribution
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={55}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {activityDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyStats}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="MarriageQueries" fill="#D97706" />
                  <Bar dataKey="Nikahs" fill="#1E3A8A" />
                  <Bar dataKey="FamilyCounseling" fill="#0EA5E9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-amber-500 rounded-sm mr-2"></div>
              <span className="text-xs text-gray-600">
                Marriage Queries ({activityDistribution[0]?.value || 0}%)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-800 rounded-sm mr-2"></div>
              <span className="text-xs text-gray-600">
                Nikahs ({activityDistribution[1]?.value || 0}%)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-cyan-500 rounded-sm mr-2"></div>
              <span className="text-xs text-gray-600">
                Family Counseling ({activityDistribution[2]?.value || 0}%)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-400 rounded-sm mr-2"></div>
              <span className="text-xs text-gray-600">
                Fatwa Queries ({activityDistribution[3]?.value || 0}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
