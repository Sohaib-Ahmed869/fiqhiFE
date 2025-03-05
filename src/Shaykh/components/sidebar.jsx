import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  ClipboardList,
  ScrollText,
  Calendar,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../Contexts/AuthContext";

const MenuItem = ({
  icon: Icon,
  label,
  isSubItem = false,
  active = false,
  to,
  children,
  expandable = false,
  onClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const baseClasses = `flex items-center w-full py-3 text-sm transition-colors duration-150 ${
    isSubItem ? "pl-12" : "px-6"
  }`;
  const activeClasses = active ? "text-black font-medium" : "text-gray-600";

  if (expandable) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`${baseClasses} ${activeClasses} hover:text-black justify-between w-full flex`}
        >
          <span className="flex items-center">
            {Icon && <Icon className="w-5 h-5" />}
            <span className={`ml-3 ${active ? "font-medium" : "font-normal"}`}>
              {label}
            </span>
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isExpanded ? "transform rotate-180" : ""
            }`}
          />
        </button>
        {isExpanded && children}
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`${baseClasses} ${activeClasses} hover:text-black`}
      onClick={onClick}
    >
      <span className="flex items-center">
        {Icon && <Icon className="w-5 h-5" />}
        <span className={`ml-3 ${active ? "font-medium" : "font-normal"}`}>
          {label}
        </span>
      </span>
    </Link>
  );
};

const ShaykhSidebar = ({ mobile = false, closeSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (currentUser) {
      // Set user details from auth context
      setFirstName(currentUser.firstName || "");
      setLastName(currentUser.lastName || "");
      setEmail(currentUser.email || "");

      // Generate avatar URL with user's name
      const name = `${currentUser.firstName || ""}+${
        currentUser.lastName || ""
      }`;
      setAvatar(
        `https://ui-avatars.com/api/?name=${name}&background=047857&color=fff`
      );
    }
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // If no user is logged in, don't render the sidebar
  if (!currentUser) {
    return null;
  }

  // Check if the path is active (for highlighting the current page)
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  // Handle menu item click for mobile view - closes sidebar after navigation
  const handleMenuItemClick = () => {
    if (mobile && closeSidebar) {
      closeSidebar();
    }
  };

  return (
    <div
      className={`bg-white h-screen flex flex-col border-r border-gray-200 ${
        mobile ? "w-full" : "w-64"
      }`}
    >
      {/* Logo section */}
      <div className="px-6 py-2">
        <img src={logo} alt="The Fiqhi Council of Australia" className="h-24" />
      </div>

      {/* Menu Section */}
      <nav className="flex-1 overflow-y-auto">
        <MenuItem
          icon={LayoutGrid}
          label="Overview"
          to="/shaykh/overview"
          active={isActive("/shaykh/overview")}
          onClick={handleMenuItemClick}
        />

        <MenuItem
          icon={Users}
          label="Marriage Applications"
          to="/shaykh/marriages"
          active={isActive("/shaykh/marriages")}
          onClick={handleMenuItemClick}
        />

        <MenuItem
          icon={ClipboardList}
          label="Reconciliations"
          to="/shaykh/reconciliations"
          active={isActive("/shaykh/reconciliations")}
          onClick={handleMenuItemClick}
        />

        <MenuItem
          icon={ScrollText}
          label="Fatwa Queries"
          to="/shaykh/fatwa-queries"
          active={isActive("/shaykh/fatwa-queries")}
          onClick={handleMenuItemClick}
        />

        <MenuItem
          icon={Calendar}
          label="Schedule"
          to="/shaykh/schedule"
          active={isActive("/shaykh/schedule")}
          onClick={handleMenuItemClick}
        />

        <div className="mt-6 mb-2 px-6">
          <div className="h-px bg-gray-200"></div>
        </div>
      </nav>

      {/* Profile Section */}
      <div className="border-t border-gray-200">
        <div className="px-6 py-4">
          <div className="text-sm text-gray-500">Profile</div>
          <div className="mt-4 flex items-center">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={avatar}
              alt="Profile"
              onError={(e) => {
                e.target.src =
                  "https://ui-avatars.com/api/?name=S&background=047857&color=fff";
              }}
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {firstName && lastName ? `${firstName} ${lastName}` : "Shaykh"}
              </p>
              <p className="text-sm text-gray-500">
                {email || "shaykh@example.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShaykhSidebar;
