import React, { useState } from "react";
import {
  Bell,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "meeting",
    title: "Meeting Reminder",
    message:
      "Your meeting with Shaykh Asim is scheduled for tomorrow at 10:00 AM",
    time: "1 hour ago",
    status: "unread",
    category: "upcoming",
  },
  {
    id: 2,
    type: "status",
    title: "Application Status Update",
    message: "Your marriage application has been reviewed and approved",
    time: "2 hours ago",
    status: "unread",
    category: "upcoming",
  },
  {
    id: 3,
    type: "alert",
    title: "Document Required",
    message:
      "Please upload your identification document to proceed with the application",
    time: "1 day ago",
    status: "read",
    category: "earlier",
  },
  {
    id: 4,
    type: "meeting",
    title: "Meeting Cancelled",
    message: "The meeting scheduled for 15th March has been cancelled",
    time: "2 days ago",
    status: "read",
    category: "earlier",
  },
];

const NotificationIcon = ({ type }) => {
  switch (type) {
    case "meeting":
      return <Calendar className="w-5 h-5 text-blue-600" />;
    case "status":
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case "alert":
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    default:
      return <Bell className="w-5 h-5 text-gray-600" />;
  }
};

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg ${
      active ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

const NotificationsView = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [notificationState, setNotificationState] = useState(notifications);

  const markAsRead = (id) => {
    setNotificationState((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, status: "read" }
          : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotificationState((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const getFilteredNotifications = () => {
    if (activeTab === "unread") {
      return notificationState.filter((n) => n.status === "unread");
    }
    return notificationState;
  };

  const NotificationCard = ({ notification }) => (
    <div
      className={`p-4 rounded-lg mb-3 ${
        notification.status === "unread" ? "bg-green-50" : "bg-white"
      } border border-gray-200`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-2 rounded-full ${
            notification.status === "unread" ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          <NotificationIcon type={notification.type} />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">
                {notification.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => deleteNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {notification.time}
            </div>
            {notification.status === "unread" && (
              <button
                onClick={() => markAsRead(notification.id)}
                className="text-sm text-green-700 hover:text-green-800"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Notifications
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Stay updated with your application status
            </p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-green-700 hover:text-green-800">
            Mark all as read
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <TabButton
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
          >
            All
          </TabButton>
          <TabButton
            active={activeTab === "unread"}
            onClick={() => setActiveTab("unread")}
          >
            Unread
          </TabButton>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-3">UPCOMING</h2>
            {getFilteredNotifications()
              .filter((n) => n.category === "upcoming")
              .map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))}
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-3">EARLIER</h2>
            {getFilteredNotifications()
              .filter((n) => n.category === "earlier")
              .map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsView;
