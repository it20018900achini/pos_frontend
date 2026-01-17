"use client";
import React, { useState } from "react";
import Notifications from "./Notifications";
import OnlineUsers from "./OnlineUsers";

export default function UserActivities() {
  const [activeTab, setActiveTab] = useState("online");

  return (
    <div className="bg-white border rounded shadow p-3 w-full">
      {/* Tabs */}
      <div className="flex border-b mb-3">
        <button
          onClick={() => setActiveTab("online")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "online"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          Online Users-
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "notifications"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          Notifications
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "online" && <OnlineUsers />}
        {activeTab === "notifications" && <Notifications />}
      </div>
    </div>
  );
}
