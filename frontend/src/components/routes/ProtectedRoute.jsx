import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ requiredRole }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // Extract the user's role from userInfo
  const userRole = userInfo?.role;

  // Check if the user has the required role
  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-700 to-purple-500">
        <div className="max-w-md p-8 bg-white shadow-md rounded-lg mx-auto text-center">
          <h1 className="text-3xl font-semibold text-red-500 mb-4">
            Access Denied
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
