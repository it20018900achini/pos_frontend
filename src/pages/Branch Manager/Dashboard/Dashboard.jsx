import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";



// Import chart components
import SalesChart from "./SalesChart";
import TopProducts from "./TopProducts";
import CashierPerformance from "./CashierPerformance";
import RecentOrders from "./RecentOrders";
import { getTodayOverview, getPaymentBreakdown } from "@/Redux Toolkit/features/branchAnalytics/branchAnalyticsThunks";
import PaymentBreakdown from "./PaymentBreakdown";
import TodayOverview from "./TodayOverview";
import DateRangeFilter from "../../Dashboard/DateRangeFilter";

export default function Dashboard() {
  const dispatch = useDispatch();
  const {selectedBranchId}=useSelector((state)=>state.user)
  const { branch } = useSelector((state) => state.branch);
  

  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    if (selectedBranchId) {
      // alert(JSON.stringify(selectedBranchId))
      const today = new Date().toISOString().slice(0, 10);
      dispatch(getTodayOverview({branchId:selectedBranchId,start:today,end:today}));
      dispatch(getPaymentBreakdown({ branchId:selectedBranchId, date: today }));
    }
  }, [selectedBranchId, dispatch]);

  // Helper to determine changeType
 
  // KPIs from todayOverview (new API fields)


  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      {/* {branchId&&} */}
        <div className="flex justify-end">
        <DateRangeFilter
          start={startDate}
          end={endDate}
          onChange={({ start, end }) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
      </div>
      <TodayOverview selectedBranchId={selectedBranchId} startDate={startDate} endDate={endDate}/>

      {/* Payment Breakdown */}
      <PaymentBreakdown selectedBranchId={selectedBranchId}/>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SalesChart />
        <TopProducts selectedBranchId={selectedBranchId}/>
      </div>
      {/* Additional Data */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CashierPerformance selectedBranchId={selectedBranchId}/>
        <RecentOrders selectedBranchId={selectedBranchId} />
      </div>
    </div>
  );
}