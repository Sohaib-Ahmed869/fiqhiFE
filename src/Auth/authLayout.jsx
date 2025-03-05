// AuthLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import image from "../assets/mosque-image.png";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="lg:w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Right Section - Mosque Image */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`,
        }}
      ></div>
    </div>
  );
};

export default AuthLayout;
