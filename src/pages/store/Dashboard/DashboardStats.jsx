import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  Store, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight
} from "lucide-react";
import api from "@/utils/api";

// --- 1. REDUX THUNK (API) ---
export const getStoreOverview = createAsyncThunk(
  "storeAnalytics/getStoreOverview",
  async (storeId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('jwt');
      const res = await api.get(`/api/store/analytics/${storeId}/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Sync Failed");
    }
  }
);

// --- 2. REDUX SLICE (STATE) ---
export const storeAnalyticsSlice = createSlice({
  name: "storeAnalytics",
  initialState: {
    storeOverview: null, // Critical: Starting with null prevents LKR 0 flash
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStoreOverview.pending, (state) => { state.loading = true; })
      .addCase(getStoreOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.storeOverview = action.payload;
      })
      .addCase(getStoreOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// --- 3. COMPONENT ---
const DashboardStats = () => {
  const dispatch = useDispatch();
  const { storeOverview, loading } = useSelector((state) => state.storeAnalytics);
  const { userProfile } = useSelector((state) => state.user);

  useEffect(() => {
    const storeId = userProfile?.user?.store?.id;
    if (storeId) {
      dispatch(getStoreOverview(storeId));
    }
  }, [userProfile?.user?.store?.id, dispatch]);

  const formatLKR = (amount) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const getTrendData = (current, previous) => {
    if (!previous || previous === 0) return { percent: "0.0", isPositive: true };
    const diff = ((current - previous) / previous) * 100;
    return {
      percent: Math.abs(diff).toFixed(1),
      isPositive: diff >= 0,
    };
  };

  // --- SKELETON LOADING STATE ---
  // If storeOverview is null, we show the skeleton regardless of the 'loading' flag
  // to ensure no "0" values are ever rendered.
  if (!storeOverview || (loading && !storeOverview)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-700" />
        ))}
      </div>
    );
  }

  const statsConfig = [
    {
      title: "Total Revenue",
      display: formatLKR(storeOverview.totalSales),
      raw: storeOverview.totalSales,
      prev: storeOverview.previousPeriodSales,
      icon: DollarSign,
      color: "blue",
    },
    {
      title: "Active Branches",
      display: storeOverview.totalBranches || 0,
      raw: storeOverview.totalBranches,
      prev: storeOverview.previousPeriodBranches,
      icon: Store,
      color: "emerald",
    },
    {
      title: "Inventory Size",
      display: storeOverview.totalProducts || 0,
      raw: storeOverview.totalProducts,
      prev: storeOverview.previousPeriodProducts,
      icon: ShoppingCart,
      color: "violet",
    },
    {
      title: "Workforce",
      display: storeOverview.totalEmployees || 0,
      raw: storeOverview.totalEmployees,
      prev: storeOverview.previousPeriodEmployees,
      icon: Users,
      color: "amber",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        const trend = getTrendData(stat.raw, stat.prev);

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, ease: "easeOut" }}
            className="group relative p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Background Glow Effect */}
            <div className={`absolute -right-2 -bottom-2 w-24 h-24 blur-3xl opacity-5 rounded-full bg-${stat.color}-500 transition-opacity group-hover:opacity-10`} />

            <div className="flex flex-col h-full justify-between relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-2.5 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                  <Icon size={22} strokeWidth={2.5} />
                </div>
                
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  trend.isPositive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                }`}>
                  {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {trend.percent}%
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] font-black text-slate-400 dark:text-slate-500">
                  {stat.title}
                </p>
                
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
                  {stat.display}
                </h2>
                
                <div className="mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                  <span className="text-[10px] text-slate-400 font-bold italic">Analytics Dashboard</span>
                  <ArrowUpRight size={10} className="text-slate-400" />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardStats;