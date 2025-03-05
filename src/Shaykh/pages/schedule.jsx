import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  AlertCircle,
} from "lucide-react";
import api from "../../utils/api";
const ScheduleHeader = ({ date, onPrevMonth, onNextMonth }) => (
  <div className="flex justify-between items-center mb-8">
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
      <p className="text-gray-500">Manage your appointments and meetings</p>
    </div>
    <div className="flex items-center gap-4">
      <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
        <Download className="w-4 h-4" />
        Export Schedule
      </button>
    </div>
  </div>
);

const meetingTypeStyles = {
  "marriage-reservation": {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
    icon: "💍",
  },
  "marriage-meeting": {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200",
    icon: "👥",
  },
  reconciliation: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-200",
    icon: "🤝",
  },
  "fatwa-consultation": {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
    icon: "📚",
  },
};

const Event = ({ event, onClick }) => {
  const style = meetingTypeStyles[event.type] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
    icon: "📅",
  };

  return (
    <div
      className={`p-2 rounded-lg ${style.bg} ${style.text} ${style.border} border mb-2 cursor-pointer hover:opacity-90`}
      onClick={() => onClick(event)}
    >
      <div className="flex items-center gap-2">
        <span>{style.icon}</span>
        <span className="font-medium truncate">{event.title}</span>
      </div>
      <div className="text-sm mt-1 truncate">
        {event.time} • {event.location}
      </div>
    </div>
  );
};

const DayCell = ({ date, events, isCurrentMonth, onEventClick }) => (
  <div
    className={`border border-gray-200 p-2 min-h-32 ${
      isCurrentMonth ? "" : "bg-gray-50"
    }`}
  >
    <div
      className={`text-sm ${
        isCurrentMonth ? "text-gray-600" : "text-gray-400"
      } mb-2`}
    >
      {date.getDate()}
    </div>
    <div className="space-y-1 overflow-y-auto max-h-28">
      {events.map((event, idx) => (
        <Event key={idx} event={event} onClick={onEventClick} />
      ))}
    </div>
  </div>
);

const WeekDayHeader = ({ day }) => (
  <div className="text-center p-2 font-medium text-gray-600 bg-gray-50 border-b">
    {day}
  </div>
);

const getCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];

  // Add days from previous month
  const firstDayOfWeek = firstDay.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Add days from next month
  const remainingDays = 42 - days.length; // Always show 6 weeks
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
};

// Event details modal
const EventDetailsModal = ({ event, onClose }) => {
  if (!event) return null;

  const style = meetingTypeStyles[event.type] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
    icon: "📅",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div
          className={`p-4 ${style.bg} ${style.text} rounded-t-lg flex justify-between items-center`}
        >
          <h3 className="text-lg font-medium flex items-center gap-2">
            <span>{style.icon}</span> {event.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
        <div className="p-4 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="text-gray-700">
              {event.date} • {event.time}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="text-gray-700">{event.location}</p>
          </div>
          {event.description && (
            <div>
              <p className="text-sm text-gray-500">Details</p>
              <p className="text-gray-700">{event.description}</p>
            </div>
          )}
          {event.attendees && (
            <div>
              <p className="text-sm text-gray-500">Attendees</p>
              <p className="text-gray-700">{event.attendees}</p>
            </div>
          )}
          {event.queryId && (
            <div>
              <p className="text-sm text-gray-500">Reference ID</p>
              <p className="text-gray-700">{event.queryId}</p>
            </div>
          )}
          {event.status && (
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  event.status === "scheduled"
                    ? "bg-blue-100 text-blue-800"
                    : event.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : event.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </p>
            </div>
          )}
        </div>
        <div className="border-t p-4 flex justify-end space-x-3">
          {event.status !== "completed" && (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={() =>
                event.onMarkComplete && event.onMarkComplete(event)
              }
            >
              Mark as Complete
            </button>
          )}
          {event.status !== "cancelled" && (
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={() => event.onCancel && event.onCancel(event)}
            >
              Cancel Meeting
            </button>
          )}
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const formatDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ShaykhSchedule = () => {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch all meetings and events for the current month
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      // First day of month
      const startDate = new Date(year, month, 1).toISOString().split("T")[0];
      // Last day of month
      const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];

      // Fetch marriage meetings
      const marriageRes = await api.get("/marriages/my-assignments", {
        params: { startDate, endDate },
      });

      // Fetch reconciliation meetings
      const reconciliationRes = await api.get(
        "/reconciliations/my-assignments",
        {
          params: { startDate, endDate },
        }
      );

      // Process marriage meetings
      const marriageEvents = processMarriageMeetings(
        marriageRes.data.marriages
      );

      // Process reconciliation meetings
      const reconciliationEvents = processReconciliationMeetings(
        reconciliationRes.data.reconciliations
      );

      // Combine all events
      const allEvents = [...marriageEvents, ...reconciliationEvents];

      // Group events by date
      const groupedEvents = {};
      allEvents.forEach((event) => {
        if (!groupedEvents[event.dateString]) {
          groupedEvents[event.dateString] = [];
        }
        groupedEvents[event.dateString].push(event);
      });

      setEvents(groupedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load your schedule. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  // Process marriage data into calendar events
  const processMarriageMeetings = (marriages) => {
    const events = [];

    marriages.forEach((marriage) => {
      // Process regular meetings
      if (marriage.meetings && marriage.meetings.length > 0) {
        marriage.meetings.forEach((meeting) => {
          // Skip meetings not in current month to prevent duplication
          const meetingDate = new Date(meeting.date);
          if (
            meetingDate.getMonth() !== currentDate.getMonth() ||
            meetingDate.getFullYear() !== currentDate.getFullYear()
          ) {
            return;
          }

          const dateString = meeting.date.split("T")[0];
          const event = {
            id: meeting._id,
            parentId: marriage._id,
            type: "marriage-meeting",
            title: `Marriage Meeting - ${marriage.partnerOne.firstName} & ${marriage.partnerTwo.firstName}`,
            date: new Date(meeting.date).toLocaleDateString(),
            dateString,
            time: meeting.time,
            location: meeting.location || "Office",
            description: meeting.notes,
            status: meeting.status,
            queryId: `MQ-${new Date(
              marriage.createdAt
            ).getFullYear()}-${marriage._id.slice(-3)}`,
            attendees: `${marriage.partnerOne.firstName} ${marriage.partnerOne.lastName}, ${marriage.partnerTwo.firstName} ${marriage.partnerTwo.lastName}`,
            onMarkComplete: handleMarkMeetingComplete,
            onCancel: handleCancelMeeting,
          };
          events.push(event);
        });
      }

      // Add ceremony date for reservations
      if (marriage.type === "reservation" && marriage.preferredDate) {
        const ceremonyDate = new Date(marriage.preferredDate);
        // Skip if not in current month
        if (
          ceremonyDate.getMonth() !== currentDate.getMonth() ||
          ceremonyDate.getFullYear() !== currentDate.getFullYear()
        ) {
          return;
        }

        const dateString = formatDateString(ceremonyDate);
        const event = {
          id: marriage._id,
          type: "marriage-reservation",
          title: `Nikah Ceremony - ${marriage.partnerOne.firstName} & ${marriage.partnerTwo.firstName}`,
          date: ceremonyDate.toLocaleDateString(),
          dateString,
          time: marriage.preferredTime || "TBD",
          location: marriage.preferredLocation || "TBD",
          description: marriage.additionalInformation,
          status: marriage.status,
          queryId: `MQ-${new Date(
            marriage.createdAt
          ).getFullYear()}-${marriage._id.slice(-3)}`,
          attendees: `${marriage.partnerOne.firstName} ${marriage.partnerOne.lastName}, ${marriage.partnerTwo.firstName} ${marriage.partnerTwo.lastName}`,
        };
        events.push(event);
      }
    });

    return events;
  };

  // Process reconciliation data into calendar events
  const processReconciliationMeetings = (reconciliations) => {
    const events = [];

    reconciliations.forEach((reconciliation) => {
      if (reconciliation.meetings && reconciliation.meetings.length > 0) {
        reconciliation.meetings.forEach((meeting) => {
          // Skip meetings not in current month
          const meetingDate = new Date(meeting.date);
          if (
            meetingDate.getMonth() !== currentDate.getMonth() ||
            meetingDate.getFullYear() !== currentDate.getFullYear()
          ) {
            return;
          }

          const dateString = meeting.date.split("T")[0];
          const event = {
            id: meeting._id,
            parentId: reconciliation._id,
            type: "reconciliation",
            title: `Reconciliation - ${reconciliation.husband.firstName} & ${reconciliation.wife.firstName}`,
            date: new Date(meeting.date).toLocaleDateString(),
            dateString,
            time: meeting.time,
            location: meeting.location || "Office",
            description: meeting.notes,
            status: meeting.status,
            queryId: `RC-${new Date(
              reconciliation.createdAt
            ).getFullYear()}-${reconciliation._id.slice(-3)}`,
            attendees: `${reconciliation.husband.firstName} ${reconciliation.husband.lastName}, ${reconciliation.wife.firstName} ${reconciliation.wife.lastName}`,
            onMarkComplete: handleMarkMeetingComplete,
            onCancel: handleCancelMeeting,
          };
          events.push(event);
        });
      }
    });

    return events;
  };

  // Handle marking a meeting as complete
  const handleMarkMeetingComplete = async (event) => {
    try {
      // Determine the type of meeting and make the appropriate API call
      if (event.type === "marriage-meeting") {
        await api.put(`/marriages/meetings/${event.parentId}/${event.id}`, {
          status: "completed",
          completedNotes: "Meeting completed as scheduled.",
        });
      } else if (event.type === "reconciliation") {
        await api.put(
          `/reconciliations/meetings/${event.parentId}/${event.id}`,
          {
            status: "completed",
            completedNotes: "Meeting completed as scheduled.",
          }
        );
      }

      // Close modal and refresh data
      setSelectedEvent(null);
      fetchEvents();
    } catch (err) {
      console.error("Error marking meeting as complete:", err);
      alert("Failed to update meeting status. Please try again.");
    }
  };

  // Handle cancelling a meeting
  const handleCancelMeeting = async (event) => {
    try {
      if (window.confirm("Are you sure you want to cancel this meeting?")) {
        // Determine the type of meeting and make the appropriate API call
        if (event.type === "marriage-meeting") {
          await api.put(`/marriages/${event.parentId}/meetings/${event.id}`, {
            status: "cancelled",
            notes: "Meeting cancelled by shaykh.",
          });
        } else if (event.type === "reconciliation") {
          await api.put(
            `/reconciliations/${event.parentId}/meetings/${event.id}`,
            {
              status: "cancelled",
              notes: "Meeting cancelled by shaykh.",
            }
          );
        }

        // Close modal and refresh data
        setSelectedEvent(null);
        fetchEvents();
      }
    } catch (err) {
      console.error("Error cancelling meeting:", err);
      alert("Failed to cancel meeting. Please try again.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const getEventsForDate = (date) => {
    const dateString = formatDateString(date);
    return events[dateString] || [];
  };

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const calendarDays = getCalendarDays(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  return (
    <div className="p-6">
      <ScheduleHeader
        date={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">{monthYear}</h2>
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded"
              onClick={handleNextMonth}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600">Loading your schedule...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {weekDays.map((day) => (
              <WeekDayHeader key={day} day={day} />
            ))}
            {calendarDays.map((date, idx) => (
              <DayCell
                key={idx}
                date={date}
                events={getEventsForDate(date)}
                isCurrentMonth={date.getMonth() === currentDate.getMonth()}
                onEventClick={(event) => setSelectedEvent(event)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-4">Meeting Types</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(meetingTypeStyles).map(([type, style]) => (
            <div
              key={type}
              className={`p-3 rounded-lg ${style.bg} ${style.text} flex items-center gap-2`}
            >
              <span>{style.icon}</span>
              <span className="capitalize">{type.replace(/-/g, " ")}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default ShaykhSchedule;
