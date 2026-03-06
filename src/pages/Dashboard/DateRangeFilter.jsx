import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDateRange } from "@/Redux Toolkit/features/user/userSlice";

export default function DateRangeFilter() {
  const dispatch = useDispatch();

  const { startTimeStamp, endTimeStamp } = useSelector((state) => state.user);

  const today = new Date().toISOString().split("T")[0];

  const [preset, setPreset] = useState("today");
  const [startDate, setStartDate] = useState(startTimeStamp || today);
  const [endDate, setEndDate] = useState(endTimeStamp || today);

  const format = (d) => d.toISOString().split("T")[0];

  const applyRange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    dispatch(setDateRange({ start, end }));
  };

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

  useEffect(() => {
    dispatch(setDateRange({ start: startDate, end: endDate }));
  }, [startDate, endDate]);

  return (
    <div className="flex gap-3 mb-4 items-end justify-end w-full flex-wrap">

      {/* Quick Range */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          Range
        </label>

        <select
          value={preset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="h-8 text-sm px-2 rounded-md border border-gray-300 w-32"
        >
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