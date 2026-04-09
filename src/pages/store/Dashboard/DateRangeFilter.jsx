import React, { useState, useEffect, useCallback } from "react";

export default function DateRangeFilter({ start, end, onChange }) {
  const today = new Date().toISOString().split("T")[0];

  // --- Local Storage Helpers ---
  const getStorage = (key) => (typeof window !== "undefined" ? localStorage.getItem(key) : null);
  const setStorage = (key, value) => {
    if (typeof window !== "undefined") localStorage.setItem(key, value);
  };

  const [preset, setPreset] = useState("");
  const [startDate, setStartDate] = useState(start || getStorage("startTimeStamp") || today);
  const [endDate, setEndDate] = useState(end || getStorage("endTimeStamp") || today);

  const format = (d) => d.toISOString().split("T")[0];

  const handlePresetChange = (value) => {
    setPreset(value);
    const now = new Date();

    if (value === "today") {
      setStartDate(format(now));
      setEndDate(format(now));
    } else if (value === "yesterday") {
      const y = new Date(now);
      y.setDate(now.getDate() - 1);
      setStartDate(format(y));
      setEndDate(format(y));
    } else if (value === "thisWeek") {
      const first = new Date(now);
      first.setDate(now.getDate() - now.getDay());
      setStartDate(format(first));
      setEndDate(format(now));
    } else if (value === "thisMonth") {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(format(first));
      setEndDate(format(now));
    } else if (value === "thisYear") {
      const first = new Date(now.getFullYear(), 0, 1);
      setStartDate(format(first));
      setEndDate(format(now));
    }
  };

  // Detect preset based on current dates
  const detectPreset = useCallback((s, e) => {
    const now = new Date();
    const todayStr = format(now);
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = format(yesterday);

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    if (s === todayStr && e === todayStr) return "today";
    if (s === yesterdayStr && e === yesterdayStr) return "yesterday";
    if (s === format(weekStart) && e === todayStr) return "thisWeek";
    if (s === format(monthStart) && e === todayStr) return "thisMonth";
    if (s === format(yearStart) && e === todayStr) return "thisYear";
    return "";
  }, []);

  useEffect(() => {
    setStorage("startTimeStamp", startDate);
    setStorage("endTimeStamp", endDate);
    setPreset(detectPreset(startDate, endDate));

    if (onChange) {
      // 💡 Optimization: Send ISO Strings with Time for Backend Compatibility
      // Start of the day (00:00:00) to End of the day (23:59:59)
      onChange({ 
        start: `${startDate}T00:00:00`, 
        end: `${endDate}T23:59:59` 
      });
    }
  }, [startDate, endDate, detectPreset]);

  return (
    <div className="flex flex-wrap items-center gap-4 p-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
      
      {/* Preset Selector */}
      <div className="flex flex-col">
        <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 ml-1">Period</label>
        <select
          value={preset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="h-9 text-xs font-semibold px-3 rounded-xl border-none bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none w-36"
        >
          <option value="">Custom Range</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
          <option value="thisYear">This Year</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 ml-1">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-9 text-xs font-medium px-3 rounded-xl border-none bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 outline-none w-36"
          />
        </div>

        <div className="mt-4 text-slate-300">—</div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 ml-1">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-9 text-xs font-medium px-3 rounded-xl border-none bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 outline-none w-36"
          />
        </div>
      </div>
    </div>
  );
}