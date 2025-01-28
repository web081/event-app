import React from "react";
import { Outlet } from "react-router-dom";
import UserSideBar from "./UserSideBar";

export default function UserLayout() {
  return (
    <div className="bg-neutral-100 h-screen w-screen flex">
      {/* Sidebar */}
      <div className="flex-shrink-0 h-full overflow-y-auto">
        <UserSideBar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-x-hidden">
        {/* Main content area */}
        <div className="flex-1 p-4 min-h-0 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
