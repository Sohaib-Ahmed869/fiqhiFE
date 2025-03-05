import React, { useState } from "react";
import {
  Bell,
  Calendar,
  UserPlus,
  MessageSquare,
  AlertCircle,
  Check,
  Users,
  HeartHandshake,
} from "lucide-react";

const NotificationCard = ({ notification }) => {
  const getIcon = () => {
    switch (notification.type) {
      case "marriage":
        return <Users className="w-5 h-5 text-blue-500" />;
      case "reconciliation":
        return <HeartHandshake className="w-5 h-5 text-orange-500" />;
      case "meeting":
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case "request":
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActionButton = () => {
    if (!notification.action) return null;

    switch (notification.action.type) {
      case "approve":
        return (
          <button className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
            Approve
          </button>
        );
      case "review":
        return (
          <button className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            Review
          </button>
        );
      case "view":
        return (
          <button className="px-4 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
            View
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`p-4 border-b ${
        notification.unread ? "bg-blue-50" : "bg-white"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-white rounded-full shadow-sm">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-900 font-medium">{notification.title}</p>
              <p className="text-gray-600 mt-1">{notification.message}</p>
            </div>
            {notification.unread && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-500">{notification.time}</span>
            {getActionButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationsScreen = () => {
  const [filter, setFilter] = useState("all");

  const notifications = [
    {
      id: 1,
      type: "marriage",
      title: "New Marriage Application",
      message:
        "James Thompson and Sarah Chen have submitted a marriage application.",
      time: "2 minutes ago",
      unread: true,
      action: { type: "review" },
    },
    {
      id: 2,
      type: "meeting",
      title: "Meeting Reminder",
      message: "You have a marriage counseling session in 30 minutes.",
      time: "30 minutes ago",
      unread: true,
      action: { type: "view" },
    },
    {
      id: 3,
      type: "reconciliation",
      title: "Reconciliation Update",
      message: "The Ahmed couple have agreed to the proposed terms.",
      time: "1 hour ago",
      unread: false,
      action: { type: "approve" },
    },
    {
      id: 4,
      type: "request",
      title: "Meeting Request",
      message:
        "The Wilson family would like to schedule a pre-marriage meeting.",
      time: "2 hours ago",
      unread: true,
      action: { type: "approve" },
    },
    {
      id: 5,
      type: "alert",
      title: "Urgent: Schedule Conflict",
      message:
        "There is a scheduling conflict for the upcoming Nikah ceremony.",
      time: "3 hours ago",
      unread: false,
      action: { type: "view" },
    },
  ];

  const filterTabs = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "marriage", label: "Marriage" },
    { id: "reconciliation", label: "Reconciliation" },
    { id: "meetings", label: "Meetings" },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return notification.unread;
    return notification.type === filter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Notifications
          </h1>
          <p className="text-gray-500 mt-1">
            Stay updated with your latest activities
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Check className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b">
          <div className="flex gap-6 p-4">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                className={`py-2 px-1 -mb-4 ${
                  filter === tab.id
                    ? "border-b-2 border-green-600 text-green-600 font-medium"
                    : "text-gray-500"
                }`}
                onClick={() => setFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No notifications found
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
