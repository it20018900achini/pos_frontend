import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";

import Dashboard from "../Branch Manager/Dashboard/Dashboard";
import { DashboardStore } from "../store/Dashboard";
import DashboardSuperAdmin from "../SuperAdminDashboard/Dashboard";
import BranchDashboard from "./BranchDashboard";

function DashboardMain() {
  const { userProfile, selectedBranchId } = useSelector((state) => state.user);

  // 1. Define tabs using useMemo for better performance
  const tabs = useMemo(() => {
    const availableTabs = [];

    // If a branch is selected, show Branch Overview first
    if (selectedBranchId) {
      availableTabs.push({ 
        key: "branch", 
        label: "Branch Intelligence", 
        component:<>
        <BranchDashboard/>
        <Dashboard />
        </>  
      });
    }

    // Always show Store Overview for Branch Managers/Staff
    availableTabs.push({ 
      key: "store", 
      label: "Store Insights", 
      component: <DashboardStore /> 
    });

    return availableTabs;
  }, [selectedBranchId]);

  // 2. State management for tabs
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "store");

  // 3. Early return for Super Admin (The "Command Center" view)
  if (userProfile?.role === "SUPER_ADMIN") {
    return (
      <div className="p-6 space-y-6 ml-20 md:ml-0 bg-slate-50 min-h-screen">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Executive Overview</h1>
          <p className="text-slate-500">Global performance across all operational branches</p>
        </div>
        <DashboardSuperAdmin />
      </div>
    );
  }

  // 4. Main Dashboard Layout for Branch Managers/Staff
  return (
    <div className="p-6 space-y-6 ml-20 md:ml-0 bg-slate-50 min-h-screen">
      {/* Modern Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative pb-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.key
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
        
        {/* Branch Indicator Badge */}
        {selectedBranchId && activeTab === 'branch' && (
          <div className="hidden md:flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Branch ID: {selectedBranchId}
          </div>
        )}
      </div>

      {/* Render Active Component */}
      <div className="transition-opacity duration-300">
        {tabs.find((t) => t.key === activeTab)?.component}
      </div>
    </div>
  );
}

export default DashboardMain;