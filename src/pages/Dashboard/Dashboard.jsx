import React, { useState } from "react";
import { useSelector } from "react-redux";

import Dashboard from "../Branch Manager/Dashboard/Dashboard";
import  {DashboardStore}  from "../store/Dashboard";

function DashboardMain() {
  const { selectedBranchId } = useSelector((state) => state.user);

  // Tabs: branch overview only if branch selected
const branchTab = ()=><>
<Dashboard />
</>;
const storeTab = ()=><><DashboardStore /></>;


  const tabs = selectedBranchId
    ? [
        { key: "branch", label: "Branch Overview", 
          component: branchTab() 
        },
        { key: "store", label: "Store Overview", component:storeTab() },
      ]
    : [{ key: "store", label: "Store Overview", component:storeTab() }];

  const [activeTab, setActiveTab] = useState(tabs[0].key);

  const activeComponent = tabs.find((t) => t.key === activeTab)?.component;

  return (
    <div className="p-4 space-y-4  ml-20 md:ml-0">
      {/* Simple Nav */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === tab.key
                ? "bg-neutral-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Render Active Overview */}
      {activeComponent}
    </div>
  );
}

export default DashboardMain;