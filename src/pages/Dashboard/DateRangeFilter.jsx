import React, { useState, useEffect } from "react";

export default function DateRangeFilter({ start, end, onChange }) {

  const today = new Date().toISOString().split("T")[0];

  const getStorage = (key) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  };

  const setStorage = (key, value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  };

  const [preset, setPreset] = useState("");

  const [startDate, setStartDate] = useState(
    start || getStorage("startTimeStamp") || today
  );

  const [endDate, setEndDate] = useState(
    end || getStorage("endTimeStamp") || today
  );

  const format = (d) => d.toISOString().split("T")[0];

  const applyRange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  /* ---------------- Preset change ---------------- */

  const handlePresetChange = (value) => {
    setPreset(value);

    const now = new Date();

    if (value === "today") {
      applyRange(format(now), format(now));
    }

    if (value === "yesterday") {
      const y = new Date(now);
      y.setDate(now.getDate() - 1);
      applyRange(format(y), format(y));
    }

    if (value === "thisWeek") {
      const first = new Date(now);
      first.setDate(now.getDate() - now.getDay());
      applyRange(format(first), format(now));
    }

    if (value === "thisMonth") {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      applyRange(format(first), format(now));
    }

    if (value === "thisYear") {
      const first = new Date(now.getFullYear(), 0, 1);
      applyRange(format(first), format(now));
    }
  };

  /* ---------------- Detect preset from dates ---------------- */

  const detectPreset = (start, end) => {
    const now = new Date();

    const todayStr = format(now);

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    if (start === todayStr && end === todayStr) return "today";

    if (start === format(yesterday) && end === format(yesterday))
      return "yesterday";

    if (start === format(weekStart) && end === todayStr)
      return "thisWeek";

    if (start === format(monthStart) && end === todayStr)
      return "thisMonth";

    if (start === format(yearStart) && end === todayStr)
      return "thisYear";

    return "";
  };

  /* ---------------- Save + detect preset ---------------- */

  useEffect(() => {

    setStorage("startTimeStamp", startDate);
    setStorage("endTimeStamp", endDate);

    const detected = detectPreset(startDate, endDate);
    setPreset(detected);

    if (onChange) {
      onChange({ start: startDate, end: endDate });
    }

  }, [startDate, endDate]);

  return (
    <div className="flex gap-3 mb-4 items-end justify-end w-full flex-wrap">

      {/* Range */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          Range
        </label>

        <select
          value={preset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="h-8 text-sm px-2 rounded-md border border-gray-300 w-32"
        >
          <option value="">Select</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
          <option value="thisYear">This Year</option>
        </select>
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          Start
        </label>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="h-8 text-sm px-2 rounded-md border border-gray-300 w-36"
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          End
        </label>

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="h-8 text-sm px-2 rounded-md border border-gray-300 w-36"
        />
      </div>

    </div>
  );
}