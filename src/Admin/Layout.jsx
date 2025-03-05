import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  FileText,
  Users,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../Contexts/AuthContext";

const MenuItem = ({
  icon: Icon,
  label,
  isSubItem = false,
  active = false,
  onClick,
  children,
  expandable = false,
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
    <button
      onClick={onClick}
      className={`${baseClasses} ${activeClasses} hover:text-black`}
    >
      <span className="flex items-center">
        {Icon && <Icon className="w-5 h-5" />}
        <span className={`ml-3 ${active ? "font-medium" : "font-normal"}`}>
          {label}
        </span>
      </span>
    </button>
  );
};

const SubMenuItem = ({ label, onClick, active = false }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(onClick)}
      className={`block py-2 pl-14 pr-6 text-sm ${
        active ? "text-black font-medium" : "text-gray-600"
      } hover:text-black w-full text-left`}
    >
      {label}
    </button>
  );
};

const AdminSidebar = ({ mobile, closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Generate avatar URL based on user name or use a default
  const getAvatarUrl = () => {
    if (currentUser?.username) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        currentUser.username
      )}&background=047857&color=fff`;
    }
    return `https://ui-avatars.com/api/?name=Admin&background=047857&color=fff`;
  };

  // Handle navigation and close sidebar on mobile
  const handleNavigation = (path) => {
    navigate(path);
    if (mobile) {
      closeSidebar();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo section */}
      <div className="px-6 py-4 flex items-center justify-between">
        <img src={logo} alt="Logo" className="h-24" />
        {mobile && (
          <button
            onClick={closeSidebar}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Menu Section */}
      <nav className="flex-1 overflow-y-auto py-4">
        <MenuItem
          icon={LayoutGrid}
          label="Overview"
          active={isActive("/admin")}
          onClick={() => handleNavigation("/admin")}
        />

        <MenuItem
          icon={FileText}
          label="View Applications"
          expandable
          active={[
            "/admin/fatwa-applications",
            "/admin/marriage-applications",
            "/admin/reconciliation",
          ].some((path) => location.pathname.includes(path))}
        >
          <SubMenuItem
            label="Fatwa Applications"
            onClick="/admin/fatwa-applications"
            active={isActive("/admin/fatwa-applications")}
          />
          <SubMenuItem
            label="Marriage Applications"
            onClick="/admin/marriage-applications"
            active={isActive("/admin/marriage-applications")}
          />
          <SubMenuItem
            label="Reconciliation Applications"
            onClick="/admin/reconciliation"
            active={isActive("/admin/reconciliation")}
          />
        </MenuItem>

        <MenuItem
          icon={Users}
          label="Manage Shaykhs"
          expandable
          active={["/admin/add-shaykh", "/admin/shaykhs"].some((path) =>
            location.pathname.includes(path)
          )}
        >
          <SubMenuItem
            label="Add Shaykh"
            onClick="/admin/add-shaykh"
            active={isActive("/admin/add-shaykh")}
          />
          <SubMenuItem
            label="View all Shaykhs"
            onClick="/admin/shaykhs"
            active={isActive("/admin/shaykhs")}
          />
        </MenuItem>
      </nav>

      {/* Profile Section */}
      <div className="border-t border-gray-200 mt-auto">
        <div className="px-6 py-4">
          <div className="text-sm text-gray-500">Profile</div>
          <div className="mt-4 flex items-center">
            <img
              className="h-10 w-10 rounded-full"
              src={getAvatarUrl()}
              alt="Profile"
            />
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser?.username || "Admin User"}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {currentUser?.email || "admin@example.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center text-sm text-gray-600 hover:text-gray-900 w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = ({ openSidebar }) => {
  const { currentUser } = useAuth();

  // Generate avatar URL based on user name or use a default
  const getAvatarUrl = () => {
    if (currentUser?.username) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        currentUser.username
      )}&background=047857&color=fff`;
    }
    return `https://ui-avatars.com/api/?name=Admin&background=047857&color=fff`;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={openSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <button
                className="p-1 text-gray-400 hover:text-gray-500 relative"
                onClick={() => {}}
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              <button
                className="p-1 text-gray-400 hover:text-gray-500"
                onClick={() => {}}
              >
                <span className="sr-only">Settings</span>
                <Settings className="h-6 w-6" />
              </button>

              {/* Mobile profile image */}
              <img
                className="h-8 w-8 rounded-full"
                src={getAvatarUrl()}
                alt="Profile"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size on mount and when resized
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is the lg breakpoint in Tailwind
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar
          mobile={true}
          closeSidebar={() => setSidebarOpen(false)}
        />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64">
          <AdminSidebar mobile={false} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Only show header on mobile */}
        {isMobile && <Header openSidebar={() => setSidebarOpen(true)} />}

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
