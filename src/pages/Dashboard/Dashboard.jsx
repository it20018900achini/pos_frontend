"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import Dashboard from "../Branch Manager/Dashboard/Dashboard";
import { DashboardStore } from "../store/Dashboard";
import DashboardSuperAdmin from "../SuperAdminDashboard/Dashboard";
import { LayoutGrid, Cpu, ShieldCheck, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

function DashboardMain() {
  const { userProfile, selectedBranchId } = useSelector((state) => state.user);

  const tabs = useMemo(() => {
    const availableTabs = [];
    if (selectedBranchId) {
      availableTabs.push({ 
        key: "branch", 
        label: "Branch Intelligence", 
        icon: <Cpu size={14} />,
        component: <Dashboard />
      });
    }

    availableTabs.push({ 
      key: "store", 
      label: "Store Insights", 
      icon: <LayoutGrid size={14} />,
      component: <DashboardStore /> 
    });

    return availableTabs;
  }, [selectedBranchId]);

  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "store");

  // --- Executive View (Super Admin) ---
  if (userProfile?.role === "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12 ml-20 md:ml-0 font-sans">
        <header className="mb-10 flex items-end justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600">
              <Globe size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Global Network</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">
              Executive <span className="font-light text-slate-400">Command</span>
            </h1>
          </div>
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-xs font-bold text-slate-600">Superuser Access Verified</span>
          </div>
        </header>
        <DashboardSuperAdmin />
      </div>
    );
  }

  // --- Intelligence View (Branch/Store) ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 ml-20 md:ml-0 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Modern Segmented Tab Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="inline-flex p-1.5 bg-slate-200/50 backdrop-blur-xl rounded-[20px] border border-slate-200/60 shadow-inner">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "relative flex items-center gap-2 px-6 py-2.5 rounded-[14px] text-xs font-black transition-all duration-300",
                    isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{tab.icon}</span>
                  <span className="relative z-10 uppercase tracking-wider">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {selectedBranchId && activeTab === 'branch' && (
            <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Active Terminal</span>
                <span className="text-sm font-black text-slate-900 tracking-tight">Branch #{selectedBranchId}</span>
              </div>
              <div className="h-8 w-[1px] bg-slate-100" />
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse ring-4 ring-emerald-50" />
            </div>
          )}
        </div>

        {/* Dynamic Content Transition */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="min-h-[600px]"
        >
          {tabs.find((t) => t.key === activeTab)?.component}
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardMain;