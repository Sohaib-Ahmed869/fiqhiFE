// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../Contexts/AuthContext";
import {
  ChevronDown,
  X,
  LogOut,
  FileText,
  Users,
  Heart,
  BookOpen,
  Bell,
  Settings,
  Plus,
} from "lucide-react";

const MenuItem = ({
  icon,
  label,
  isSubItem = false,
  active = false,
  count,
  onClick,
}) => {
  const baseClasses = `flex items-center w-full py-2 text-md transition-colors duration-150 ${
    isSubItem ? "pl-12" : "px-4"
  }`;
  const activeClasses = active
    ? "text-primary-700 font-medium"
    : "text-gray-500";

  return (
    <Link
      to={onClick}
      className={`${baseClasses} ${activeClasses} hover:text-primary-700`}
    >
      <span className="flex items-center">
        {icon}
        <span className={`ml-3 ${active ? "font-medium" : "font-normal"}`}>
          {label}
        </span>
      </span>
      {count && (
        <span className="ml-auto bg-primary-700 text-white text-xs px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
};

const Sidebar = ({ mobile = false, closeSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-gray-200 min-h-screen">
      {/* Close button for mobile */}
      {mobile && (
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            onClick={closeSidebar}
            className="text-gray-500 hover:text-gray-900 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Logo section */}
      <div className="px-4 py-5 flex items-center justify-center">
        <img src={logo} alt="The Fiqhi Council of Australia" className="h-24" />
      </div>

      {/* New Application Button */}
      <div className="px-4 mt-2">
        <Link
          to="/user/new-application"
          className="flex items-center justify-center w-full bg-[#047857] text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-[#036c4d] transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Application
        </Link>
      </div>

      {/* Menu Section */}
      <div className="mt-6 p-2 flex-1 overflow-y-auto">
        <nav className="mt-4 space-y-1">
          {/* User menu items */}
          <MenuItem
            icon={<FileText className="w-5 h-5" />}
            label="Submitted Applications"
            active={location.pathname.includes("/user/applications")}
          />

          <div className="mt-1">
            <MenuItem
              icon={<Users className="w-4 h-4" />}
              label="Family Reconciliation"
              isSubItem
              active={location.pathname.includes(
                "/user/reconciliation-queries"
              )}
              onClick="/user/reconciliation-queries"
            />

            <MenuItem
              icon={<Heart className="w-4 h-4" />}
              label="Marriage"
              isSubItem
              active={location.pathname.includes("/user/marriage-queries")}
              onClick="/user/marriage-queries"
            />

            <MenuItem
              icon={<BookOpen className="w-4 h-4" />}
              label="Fatwa"
              isSubItem
              active={location.pathname.includes("/user/fatwa-queries")}
              onClick="/user/fatwa-queries"
            />
          </div>

          <MenuItem
            icon={<Bell className="w-5 h-5" />}
            label="Notifications"
            active={location.pathname.includes("/user/notifications")}
            onClick="/user/notifications"
          />

          <MenuItem
            icon={<Settings className="w-5 h-5" />}
            label="Settings"
            active={location.pathname.includes("/settings")}
            onClick="/user/settings"
          />
        </nav>
      </div>

      {/* Logout Section */}
      <div className="border-t border-gray-200 mt-auto">
        <div className="px-6 py-4">
          <div className="text-md text-gray-500">Profile</div>
          <div className="mt-4 flex items-center">
            <div className="">
              <p className="text-md font-medium text-gray-900">
                {currentUser?.username || "User"}
              </p>
              <p className="text-md text-gray-500">
                {currentUser?.email || "user@example.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center text-md text-gray-600 hover:text-gray-900 w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
