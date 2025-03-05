import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronUp,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import api from "../../utils/api";

const StatCard = ({
  title,
  completed,
  pending,
  trend = 0,
  previousTotal = 0,
  isLoading = false,
}) => {
  const total = completed + pending;
  const percentageChange =
    previousTotal === 0
      ? 0
      : (((total - previousTotal) / previousTotal) * 100).toFixed(1);
  const isPositive = percentageChange >= 0;

  // Calculate completion percentage, ensure it doesn't divide by zero
  const completionPercentage =
    total === 0 ? 0 : ((completed / total) * 100).toFixed(1);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

          <div className="h-2 w-full bg-gray-200 rounded-full mb-4"></div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gray-200 rounded-lg h-9 w-9"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-12 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gray-200 rounded-lg h-9 w-9"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-12 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">Total cases: {total}</p>
        </div>
        {previousTotal > 0 && (
          <div
            className={`flex items-center px-2 py-1 rounded-full text-sm ${
              isPositive
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            <span>{Math.abs(percentageChange)}%</span>
            {isPositive ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{completed}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="p-2 bg-orange-50 rounded-lg">
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{pending}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
        </div>
      </div>

      {pending > 0 && (
        <div className="mt-4 p-3 bg-orange-50 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <p className="text-sm text-orange-700">
            {pending} cases need your attention
          </p>
        </div>
      )}
    </div>
  );
};

const WeeklyCalendar = () => {
  // Get current date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the Monday of the current week
  const getMonday = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(date.setDate(diff));
  };

  // Generate array of dates for the week
  const generateWeekDates = (monday) => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  };

  const fetchWeeklyEvents = useCallback(async () => {
    setLoading(true);
    try {
      const monday = getMonday(new Date(currentDate));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      // Format dates for API request
      const startDate = monday.toISOString().split("T")[0];
      const endDate = sunday.toISOString().split("T")[0];

      // Make API requests
      const [marriageRes, reconciliationRes] = await Promise.all([
        api
          .get("/marriages/my-assignments", {
            params: { startDate, endDate },
          })
          .catch((err) => {
            console.error("Error fetching marriage data:", err);
            return { data: { marriages: [] } };
          }),
        api
          .get("/reconciliations/my-assignments", {
            params: { startDate, endDate },
          })
          .catch((err) => {
            console.error("Error fetching reconciliation data:", err);
            return { data: { reconciliations: [] } };
          }),
      ]);

      // Process marriage meetings
      const marriageEvents = processMarriageEvents(
        marriageRes.data?.marriages || []
      );

      // Process reconciliation meetings
      const reconciliationEvents = processReconciliationEvents(
        reconciliationRes.data?.reconciliations || []
      );

      // Combine all events
      setEvents([...marriageEvents, ...reconciliationEvents]);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load calendar events");
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchWeeklyEvents();
  }, [fetchWeeklyEvents]);

  const processMarriageEvents = (marriages) => {
    const events = [];

    marriages.forEach((marriage) => {
      // Process meetings
      if (marriage.meetings && Array.isArray(marriage.meetings)) {
        marriage.meetings.forEach((meeting) => {
          if (!meeting.date) return;

          // Format for meeting times
          const meetingDate = new Date(meeting.date);
          const meetingHour = parseInt(meeting.time?.split(":")[0] || 9);
          const meetingMinute = parseInt(meeting.time?.split(":")[1] || 0);

          // Set hour and minute
          meetingDate.setHours(meetingHour, meetingMinute, 0);

          const partner1Name = marriage.partnerOne?.firstName || "Client";
          const partner2Name = marriage.partnerTwo?.firstName || "Client";

          events.push({
            id: meeting._id || `m-${Math.random().toString(36).substr(2, 9)}`,
            title: `Marriage Meeting${
              partner1Name ? ` - ${partner1Name} & ${partner2Name}` : ""
            }`,
            time: meeting.time || "9:00 - 10:00",
            location: meeting.location || "Office",
            date: meetingDate,
            duration: 1,
            type: "marriage-meeting",
          });
        });
      }

      // Add ceremony date for reservations
      if (marriage.type === "reservation" && marriage.preferredDate) {
        const ceremonyDate = new Date(marriage.preferredDate);
        // Set time (default to noon if not specified)
        const ceremonyHour = marriage.preferredTime
          ? parseInt(marriage.preferredTime.split(":")[0])
          : 12;
        const ceremonyMinute = marriage.preferredTime
          ? parseInt(marriage.preferredTime.split(":")[1])
          : 0;
        ceremonyDate.setHours(ceremonyHour, ceremonyMinute, 0);

        const partner1Name = marriage.partnerOne?.firstName || "Client";
        const partner2Name = marriage.partnerTwo?.firstName || "Client";

        events.push({
          id: marriage._id || `c-${Math.random().toString(36).substr(2, 9)}`,
          title: `Nikah Ceremony${
            partner1Name ? ` - ${partner1Name} & ${partner2Name}` : ""
          }`,
          time: marriage.preferredTime || "12:00 - 13:00",
          location: marriage.preferredLocation || "Main Hall",
          date: ceremonyDate,
          duration: 1.5,
          type: "nikkah",
        });
      }
    });

    return events;
  };

  const processReconciliationEvents = (reconciliations) => {
    const events = [];

    reconciliations.forEach((reconciliation) => {
      if (reconciliation.meetings && Array.isArray(reconciliation.meetings)) {
        reconciliation.meetings.forEach((meeting) => {
          if (!meeting.date) return;

          // Format for meeting times
          const meetingDate = new Date(meeting.date);
          const meetingHour = parseInt(meeting.time?.split(":")[0] || 10);
          const meetingMinute = parseInt(meeting.time?.split(":")[1] || 0);

          // Set hour and minute
          meetingDate.setHours(meetingHour, meetingMinute, 0);

          const husbandName = reconciliation.husband?.firstName || "Client";
          const wifeName = reconciliation.wife?.firstName || "Client";

          events.push({
            id: meeting._id || `r-${Math.random().toString(36).substr(2, 9)}`,
            title: `Reconciliation${
              husbandName ? ` - ${husbandName} & ${wifeName}` : ""
            }`,
            time: meeting.time || "10:00 - 11:30",
            location: meeting.location || "Office",
            date: meetingDate,
            duration: 1.5,
            type: "reconciliation",
          });
        });
      }
    });

    return events;
  };

  const monday = getMonday(currentDate);
  const weekDates = generateWeekDates(monday);
  const hours = Array.from({ length: 10 }, (_, i) => i + 8); // 8 AM to 5 PM

  // Format date for display
  const formatDate = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${days[date.getDay()]} ${date.getDate()}`;
  };

  const getEventStyle = (type) => {
    switch (type) {
      case "nikkah":
        return "bg-blue-500 text-white";
      case "marriage-meeting":
        return "bg-purple-600 text-white";
      case "reconciliation":
        return "bg-green-600 text-white";
      case "certificate":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const EventCard = ({ event }) => (
    <div
      className={`absolute w-full p-2 rounded-md ${getEventStyle(
        event.type
      )} shadow-sm cursor-pointer hover:brightness-95 transition-all`}
      style={{
        top: `${
          (event.date.getHours() - 8) * 60 + (event.date.getMinutes() || 0)
        }px`,
        height: `${event.duration * 60}px`,
        left: "4px",
        right: "4px",
      }}
      onClick={() =>
        alert(
          `Event: ${event.title}\nTime: ${event.time}\nLocation: ${event.location}`
        )
      }
    >
      <div className="text-sm font-medium">{event.title}</div>
      <div className="text-xs opacity-90">{event.time}</div>
      <div className="text-xs opacity-90">{event.location}</div>
    </div>
  );

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mt-8 p-6">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          {currentDate.toLocaleDateString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => navigateWeek(-1)}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            Previous
          </button>
          <button
            onClick={() => navigateWeek(1)}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600">Loading calendar...</span>
        </div>
      ) : (
        <div className="grid grid-cols-8 gap-px bg-gray-200 overflow-x-auto">
          {/* Time column */}
          <div className="bg-gray-50 pr-2">
            <div className="h-12"></div>
            {hours.map((hour) => (
              <div key={hour} className="h-[60px] text-right">
                <span className="text-sm text-gray-500">
                  {hour === 12
                    ? "12 PM"
                    : hour > 12
                    ? `${hour - 12} PM`
                    : `${hour} AM`}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDates.map((date, index) => (
            <div key={date.toString()} className="bg-white relative">
              <div className="h-12 text-sm font-medium text-gray-500 p-2">
                {formatDate(date)}
              </div>
              <div className="relative">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-[60px] border-t border-gray-100"
                  ></div>
                ))}

                {/* Current time indicator for today */}
                {date.toDateString() === new Date().toDateString() && (
                  <div
                    className="absolute left-0 right-0 border-t-2 border-red-400 z-10"
                    style={{
                      top: `${
                        (new Date().getHours() - 8) * 60 +
                        new Date().getMinutes()
                      }px`,
                    }}
                  >
                    <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-red-400"></div>
                  </div>
                )}

                {/* Events */}
                {events
                  .filter(
                    (event) => event.date.toDateString() === date.toDateString()
                  )
                  .map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Click on an event for more details
      </div>
    </div>
  );
};

const ShaykhDashboard = () => {
  const [stats, setStats] = useState({
    fatwa: { completed: 0, pending: 0, previousTotal: 0, isLoading: true },
    marriage: { completed: 0, pending: 0, previousTotal: 0, isLoading: true },
    reconciliation: {
      completed: 0,
      pending: 0,
      previousTotal: 0,
      isLoading: true,
    },
  });

  useEffect(() => {
    // Fetch fatwa data
    api
      .get("/fatwas/assigned")
      .then((response) => {
        const data = response.data?.fatwas || [];
        const completed = data.filter(
          (item) => item.status === "approved" || item.status === "answered"
        ).length;
        const pending = data.filter(
          (item) => item.status === "assigned"
        ).length;

        setStats((prevStats) => ({
          ...prevStats,
          fatwa: {
            completed,
            pending,
            previousTotal: 0, // This would normally come from historical data
            isLoading: false,
          },
        }));
      })
      .catch((error) => {
        console.error("Error fetching fatwa data:", error);
        setStats((prevStats) => ({
          ...prevStats,
          fatwa: {
            completed: 0,
            pending: 0,
            previousTotal: 0,
            isLoading: false,
          },
        }));
      });

    // Fetch marriage data
    api
      .get("/marriages/my-assignments")
      .then((response) => {
        const data = response.data?.marriages || [];
        const completed = data.filter(
          (item) => item.status === "completed"
        ).length;
        const pending = data.filter(
          (item) => item.status === "assigned" || item.status === "in-progress"
        ).length;

        setStats((prevStats) => ({
          ...prevStats,
          marriage: {
            completed,
            pending,
            previousTotal: 0, // This would normally come from historical data
            isLoading: false,
          },
        }));
      })
      .catch((error) => {
        console.error("Error fetching marriage data:", error);
        setStats((prevStats) => ({
          ...prevStats,
          marriage: {
            completed: 0,
            pending: 0,
            previousTotal: 0,
            isLoading: false,
          },
        }));
      });

    // Fetch reconciliation data
    api
      .get("/reconciliations/my-assignments")
      .then((response) => {
        const data = response.data?.reconciliations || [];
        const completed = data.filter(
          (item) => item.status === "resolved" || item.status === "unresolved"
        ).length;
        const pending = data.filter(
          (item) => item.status === "assigned" || item.status === "in-progress"
        ).length;

        setStats((prevStats) => ({
          ...prevStats,
          reconciliation: {
            completed,
            pending,
            previousTotal: 0, // This would normally come from historical data
            isLoading: false,
          },
        }));
      })
      .catch((error) => {
        console.error("Error fetching reconciliation data:", error);
        setStats((prevStats) => ({
          ...prevStats,
          reconciliation: {
            completed: 0,
            pending: 0,
            previousTotal: 0,
            isLoading: false,
          },
        }));
      });
  }, []);

  return (
    <div className="p-1">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, Shaykh</h1>
        <p className="text-gray-500 mt-2">
          Here's an overview of your assigned cases and upcoming schedule
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Fatwas"
          completed={stats.fatwa.completed}
          pending={stats.fatwa.pending}
          previousTotal={stats.fatwa.previousTotal}
          isLoading={stats.fatwa.isLoading}
        />

        <StatCard
          title="Marriage"
          completed={stats.marriage.completed}
          pending={stats.marriage.pending}
          previousTotal={stats.marriage.previousTotal}
          isLoading={stats.marriage.isLoading}
        />

        <StatCard
          title="Reconciliation"
          completed={stats.reconciliation.completed}
          pending={stats.reconciliation.pending}
          previousTotal={stats.reconciliation.previousTotal}
          isLoading={stats.reconciliation.isLoading}
        />
      </div>

      <WeeklyCalendar />
    </div>
  );
};

export default ShaykhDashboard;
