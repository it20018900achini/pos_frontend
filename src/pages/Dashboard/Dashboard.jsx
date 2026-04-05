"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import Dashboard from "../Branch Manager/Dashboard/Dashboard";
import { DashboardStore } from "../store/Dashboard";
import DashboardSuperAdmin from "../SuperAdminDashboard/Dashboard";
import { 
  LayoutGrid, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Zap, 
  ChevronRight,
  Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";

function DashboardMain() {
  const { userProfile, selectedBranchId } = useSelector((state) => state.user);

  const tabs = useMemo(() => {
    const availableTabs = [];
    if (selectedBranchId) {
      availableTabs.push({ 
        key: "branch", 
        label: "Node Intelligence", 
        icon: <Cpu size={16} />,
        accent: "blue",
        component: <Dashboard />
      });
    }

    availableTabs.push({ 
      key: "store", 
      label: "Global Store", 
      icon: <LayoutGrid size={16} />,
      accent: "indigo",
      component: <DashboardStore /> 
    });

    return availableTabs;
  }, [selectedBranchId]);

  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "store");
  const currentAccent = tabs.find(t => t.key === activeTab)?.accent || "blue";

  // --- Executive View (Super Admin) ---
  if (userProfile?.role === "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-[#020617] p-8 lg:p-12 ml-20 md:ml-0 font-sans text-slate-200 selection:bg-blue-500/30">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/50 pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 items-center gap-2 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Globe size={14} className="animate-spin-slow" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">Network Master</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Instance: v4.2.0</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white">
              Executive <span className="text-slate-500 font-medium">OS</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-slate-800 shadow-2xl">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <ShieldCheck size={20} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security Clearance</p>
              <p className="text-sm font-bold text-white tracking-tight">Level 7 - Root Admin</p>
            </div>
            <div className="ml-4 h-10 w-[1px] bg-slate-800" />
            <Fingerprint size={24} className="text-slate-600 opacity-50" />
          </div>
        </header>
        <DashboardSuperAdmin />
      </div>
    );
  }

  // --- Intelligence View (Branch/Store) ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black p-6 lg:p-10 ml-20 md:ml-0 font-sans transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        {/* Navigation Bar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div className="flex flex-col gap-1">
             <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
               Analytics <span className="text-slate-400 font-light">Engine</span>
             </h2>
             <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
               <span>Main Terminal</span>
               <ChevronRight size={12} />
               <span className="text-blue-600 font-bold capitalize">{activeTab} Metrics</span>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Segmented Control */}
            <div className="inline-flex p-1.5 bg-slate-200/40 dark:bg-slate-900/50 backdrop-blur-2xl rounded-[24px] border border-slate-200/60 dark:border-white/5 shadow-inner w-full sm:w-auto">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "relative flex items-center justify-center gap-3 px-8 py-3 rounded-[18px] text-[11px] font-black transition-all duration-500 overflow-hidden",
                      isActive ? "text-blue-600 dark:text-white" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabSurface"
                        className="absolute inset-0 bg-white dark:bg-blue-600 shadow-xl shadow-blue-500/20"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{tab.icon}</span>
                    <span className="relative z-10 uppercase tracking-[0.15em]">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Indicator Hook */}
            {selectedBranchId && (
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-6 py-3 rounded-[24px] border border-slate-200/50 dark:border-white/5 shadow-sm">
                <div className="relative">
                  <Zap size={18} className="text-amber-500 fill-amber-500" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="h-6 w-[1px] bg-slate-100 dark:bg-slate-800" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Branch Node</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">ID-{selectedBranchId}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Content Surface */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="relative"
          >
            {/* Background Decorative Gradient - Changes based on tab */}
            <div className={cn(
              "absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-64 opacity-[0.03] blur-[120px] pointer-events-none rounded-full transition-colors duration-1000",
              currentAccent === "blue" ? "bg-blue-600" : "bg-indigo-600"
            )} />

            <div className="relative z-10">
              {tabs.find((t) => t.key === activeTab)?.component}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DashboardMain;