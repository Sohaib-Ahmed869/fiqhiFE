import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../User/components/sidebar";
import { Menu } from "lucide-react";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? "" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <Sidebar mobile={true} closeSidebar={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72 min-h-screen">
          <Sidebar mobile={false} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header with menu button */}
        <header className="lg:hidden bg-white shadow-sm z-10">
          <div className="px-4 py-4 flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
           
          </div>
        </header>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className=" mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
