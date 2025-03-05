import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  Clock,
  Calendar,
  Save,
  LogOut,
} from "lucide-react";

const ProfileSection = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-6 mb-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
    {children}
  </div>
);

const Field = ({
  icon: Icon,
  label,
  value,
  editable = false,
  type = "text",
}) => (
  <div className="flex items-center gap-4 py-3 border-b last:border-0">
    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
      <Icon className="w-4 h-4 text-gray-600" />
    </div>
    <div className="flex-1">
      <div className="text-sm text-gray-600">{label}</div>
      {editable ? (
        <input
          type={type}
          defaultValue={value}
          className="w-full mt-1 text-gray-900 focus:outline-none"
        />
      ) : (
        <div className="text-gray-900 mt-1">{value}</div>
      )}
    </div>
  </div>
);

const ToggleSetting = ({
  icon: Icon,
  label,
  description,
  enabled,
  onToggle,
}) => (
  <div className="flex items-start justify-between py-4 border-b last:border-0">
    <div className="flex gap-3">
      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
        <Icon className="w-4 h-4 text-gray-600" />
      </div>
      <div>
        <div className="font-medium text-gray-900">{label}</div>
        <div className="text-sm text-gray-600 mt-1">{description}</div>
      </div>
    </div>
    <button
      className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
        enabled ? "bg-green-600" : "bg-gray-200"
      }`}
      onClick={onToggle}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ease-in-out ml-1 ${
          enabled ? "translate-x-6" : ""
        }`}
      />
    </button>
  </div>
);

const UserProfile = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    calendar: true,
    reminders: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <p className="text-gray-500 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <ProfileSection title="Personal Information">
            <Field
              icon={User}
              label="Full Name"
              value="Shaykh Asim Ahmad"
              editable
            />
            <Field
              icon={Mail}
              label="Email"
              value="shaykh.asim@example.com"
              editable
              type="email"
            />
            <Field
              icon={Phone}
              label="Phone"
              value="+1 (555) 123-4567"
              editable
            />
            <Field
              icon={MapPin}
              label="Location"
              value="Sydney, Australia"
              editable
            />
          </ProfileSection>

          <ProfileSection title="Account Settings">
            <ToggleSetting
              icon={Bell}
              label="Push Notifications"
              description="Receive notifications about new applications and meetings"
              enabled={settings.notifications}
              onToggle={() => toggleSetting("notifications")}
            />
            <ToggleSetting
              icon={Moon}
              label="Dark Mode"
              description="Use dark theme throughout the application"
              enabled={settings.darkMode}
              onToggle={() => toggleSetting("darkMode")}
            />
            <ToggleSetting
              icon={Calendar}
              label="Calendar Sync"
              description="Sync meetings with your Google Calendar"
              enabled={settings.calendar}
              onToggle={() => toggleSetting("calendar")}
            />
            <ToggleSetting
              icon={Clock}
              label="Meeting Reminders"
              description="Get reminders before scheduled meetings"
              enabled={settings.reminders}
              onToggle={() => toggleSetting("reminders")}
            />
          </ProfileSection>
        </div>

        <div className="space-y-6">
          <ProfileSection title="Account Status">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="font-medium text-green-700">Active</div>
                <div className="text-sm text-green-600 mt-1">
                  Your account is in good standing
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex justify-between py-2 border-b">
                  <span>Member Since</span>
                  <span className="font-medium">January 2024</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Last Active</span>
                  <span className="font-medium">Just now</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Role</span>
                  <span className="font-medium">Shaykh</span>
                </div>
              </div>
            </div>
          </ProfileSection>

          <ProfileSection title="Quick Actions">
            <div className="space-y-2">
              <button className="w-full py-2 px-4 text-left text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Change Password
              </button>
              <button className="w-full py-2 px-4 text-left text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Language Preferences
              </button>
              <button className="w-full py-2 px-4 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </ProfileSection>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
