import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getStoreOverview, 
  getMonthlySales, 
  getSalesByCategory, 
  getStoreAlerts 
} from "@/Redux Toolkit/features/storeAnalytics/storeAnalyticsThunks";
import DashboardStats from "./DashboardStats";
import SalesTrendChart from "./SalesTrendChart";
import CategoryDistribution from "./CategoryDistribution";
import StoreAlertsList from "./StoreAlertsList";
import { RefreshCcw } from "lucide-react";
import DateRangeFilter from "./DateRangeFilter";

export default function DashboardStore() {
  const dispatch = useDispatch();
  // Replace with actual storeId from your auth selector
  const storeId = useSelector((state) => state.user.userProfile?.user?.store?.id); 

  const { loading } = useSelector((state) => state.storeAnalytics);

  useEffect(() => {
    if (storeId) {
      dispatch(getStoreOverview(storeId));
      dispatch(getMonthlySales(storeId));
      dispatch(getSalesByCategory(storeId));
      dispatch(getStoreAlerts(storeId));
    }
  }, [dispatch, storeId]);
const handleDateChange = ({ start, end }) => {
    if (storeId) {
      dispatch(getStoreOverview({ storeId, start, end }));
    }
  };
  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Store Analytics</h1>
          <p className="text-slate-500">Welcome back! Here is what's happening today.</p>
        </div>
        <button 
          onClick={() => dispatch(getStoreOverview(storeId))}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-slate-50 transition-all"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
<div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <DateRangeFilter onChange={handleDateChange} />
      </div>
      {/* KPI Cards */}
      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart - Large */}
        <div className="lg:col-span-2">
          <SalesTrendChart />
        </div>

        {/* Category Breakdown - Smaller */}
        <div className="lg:col-span-1">
          <CategoryDistribution />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <StoreAlertsList />
        
        {/* Branch Quick View or Recent Activity Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="font-bold text-lg mb-4">System Status</h3>
           <div className="flex items-center justify-between p-4 bg-green-50 text-green-700 rounded-lg">
             <span>All API Services Operational</span>
             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
           </div>
        </div>
      </div>
    </div>
  );
}