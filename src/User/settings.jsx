import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Globe,
  Moon,
  Sun,
  ChevronRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import api from "../utils/api";
import { toast } from "react-toastify";

const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4 mb-6">
    <div className="p-2 rounded-lg bg-green-100">
      <Icon className="w-5 h-5 text-green-700" />
    </div>
    <div>
      <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  </div>
);

const SettingRow = ({
  icon: Icon,
  title,
  description,
  children,
  onClick,
  hasAction = true,
}) => (
  <div
    className={`p-4 border border-gray-200 rounded-lg mb-3 ${
      hasAction ? "hover:bg-gray-50 cursor-pointer" : ""
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg bg-gray-100">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      {children ||
        (hasAction && <ChevronRight className="w-5 h-5 text-gray-400" />)}
    </div>
  </div>
);

const Switch = ({ checked, onChange }) => (
  <button
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? "bg-green-700" : "bg-gray-300"
    }`}
    onClick={() => onChange(!checked)}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const Alert = ({ type, message }) => (
  <div
    className={`p-3 rounded-md mb-4 flex items-center gap-2 ${
      type === "success"
        ? "bg-green-50 text-green-700"
        : "bg-red-50 text-red-700"
    }`}
  >
    {type === "success" ? (
      <CheckCircle className="w-5 h-5" />
    ) : (
      <AlertCircle className="w-5 h-5" />
    )}
    <span className="text-sm">{message}</span>
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      {children}
    </div>
  </div>
);

const ProfileModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put("/users/profile", formData);
      setAlert({ type: "success", message: "Profile updated successfully" });
      onUpdate(res.data.user);

      // Close modal after 1 second
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.error || "Error updating profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Edit Profile" onClose={onClose}>
      {alert && <Alert type={alert.type} message={alert.message} />}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-700 text-white rounded-md text-sm disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const PasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setAlert({ type: "error", message: "New passwords do not match" });
      return;
    }

    setLoading(true);

    try {
      await api.put("/users/password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setAlert({ type: "success", message: "Password changed successfully" });

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Close modal after 1 second
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.error || "Error changing password",
      });
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({ label, name, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword[name] ? "text" : "password"}
          name={name}
          className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={() =>
            setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }))
          }
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        >
          {showPassword[name] ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <Modal title="Change Password" onClose={onClose}>
      {alert && <Alert type={alert.type} message={alert.message} />}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <PasswordInput
            label="Current Password"
            name="currentPassword"
            placeholder="Enter your current password"
          />
          <PasswordInput
            label="New Password"
            name="newPassword"
            placeholder="Create a new password"
          />
          <PasswordInput
            label="Confirm New Password"
            name="confirmPassword"
            placeholder="Confirm your new password"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-700 text-white rounded-md text-sm disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const LanguageModal = ({ user, onClose, onUpdate }) => {
  const languages = [
    { code: "en-US", name: "English (US)", flag: "🇺🇸" },
    { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(
    user?.settings?.language || "en-US"
  );
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await api.put("/users/settings", {
        language: selectedLanguage,
      });

      setAlert({ type: "success", message: "Language updated successfully" });
      onUpdate({ ...user, settings: res.data.settings });

      // Close modal after 1 second
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.error || "Error updating language",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Select Language" onClose={onClose}>
      {alert && <Alert type={alert.type} message={alert.message} />}

      <div className="space-y-2">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => setSelectedLanguage(language.code)}
            className={`w-full p-3 flex items-center gap-3 rounded-lg ${
              selectedLanguage === language.code
                ? "bg-green-50 border border-green-200"
                : "hover:bg-gray-50 border border-gray-200"
            }`}
            disabled={loading}
          >
            <span className="text-xl">{language.flag}</span>
            <span
              className={`flex-1 text-left ${
                selectedLanguage === language.code
                  ? "text-green-700"
                  : "text-gray-700"
              }`}
            >
              {language.name}
            </span>
            {selectedLanguage === language.code && (
              <div className="w-2 h-2 rounded-full bg-green-500" />
            )}
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-700 text-white rounded-md text-sm disabled:opacity-70"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </Modal>
  );
};

const UserSettings = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/profile");
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching user profile");
      toast.error(err.response?.data?.error || "Error fetching user profile");
    } finally {
      setLoading(false);
    }
  };

  const updateUserSettings = async (setting, value) => {
    try {
      const res = await api.put("/users/settings", {
        [setting]: value,
      });

      setUser((prevUser) => ({
        ...prevUser,
        settings: {
          ...prevUser.settings,
          ...res.data.settings,
        },
      }));

      toast.success(`${setting} setting updated`);
    } catch (err) {
      toast.error(err.response?.data?.error || `Error updating ${setting}`);
    }
  };

  const renderModal = () => {
    switch (activeModal) {
      case "profile":
        return (
          <ProfileModal
            user={user}
            onClose={() => setActiveModal(null)}
            onUpdate={setUser}
          />
        );
      case "password":
        return <PasswordModal onClose={() => setActiveModal(null)} />;
      case "language":
        return (
          <LanguageModal
            user={user}
            onClose={() => setActiveModal(null)}
            onUpdate={setUser}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Error loading settings</h2>
          <p>{error}</p>
          <button
            onClick={fetchUserProfile}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Section */}
          <div>
            <SectionHeader
              icon={User}
              title="Profile Settings"
              description="Manage your personal information"
            />
            <SettingRow
              icon={User}
              title="Personal Information"
              description="Update your name and contact details"
              onClick={() => setActiveModal("profile")}
            />
            <SettingRow
              icon={Mail}
              title="Email Address"
              description={user.email}
              onClick={() => setActiveModal("profile")}
            />
            <SettingRow
              icon={Phone}
              title="Phone Number"
              description={user.phoneNumber || "Not set"}
              onClick={() => setActiveModal("profile")}
            />
          </div>

          {/* Account Section */}
          <div>
            <SectionHeader
              icon={Lock}
              title="Account Settings"
              description="Manage your account security"
            />
            <SettingRow
              icon={Lock}
              title="Password"
              description="Change your password"
              onClick={() => setActiveModal("password")}
            />
           
          </div>

         
        </div>

        {renderModal()}
      </div>
    </div>
  );
};

// Language mapping for display
const languages = [
  { code: "en-US", name: "English (US)", flag: "🇺🇸" },
  { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

export default UserSettings;
