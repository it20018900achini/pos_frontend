import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  TrendingUp, ShoppingBag, RotateCcw, Box, 
  ArrowUpRight, ArrowDownRight, User, MoreHorizontal,
  CreditCard, Wallet, Banknote, Calendar
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const PremiumBranchDashboard = () => {
  const { 
    todayOverview, dailySales, topProducts, 
    topCashiers, paymentBreakdown, recentOrders, 
    recentRefunds, loading 
  } = useSelector((state) => state.branchAnalytics);

  // Merge and sort activity
  const activity = useMemo(() => {
    const combined = [
      ...(recentOrders || []).map(o => ({ ...o, type: 'ORDER' })),
      ...(recentRefunds || []).map(r => ({ ...r, type: 'REFUND' }))
    ];
    return combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
  }, [recentOrders, recentRefunds]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8 space-y-8 font-sans">
      
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Branch Intelligence</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-slate-500 text-sm font-medium">Live System Status: Optimal</p>
          </div>
        </div>
        <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl transition-all">Analytics</button>
          <button className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all">Reports</button>
        </div>
      </header>

      {/* --- KPI SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Gross Revenue" 
          value={todayOverview?.totalSales} 
          growth={todayOverview?.salesGrowth} 
          icon={<TrendingUp size={20}/>} 
          color="blue" 
          isCurrency 
        />
        <StatCard 
          label="Transaction Vol." 
          value={todayOverview?.ordersToday} 
          growth={todayOverview?.orderGrowth} 
          icon={<ShoppingBag size={20}/>} 
          color="emerald" 
        />
        <StatCard 
          label="Refunds Processed" 
          value={todayOverview?.todayRefunds} 
          growth={todayOverview?.refundGrowth} 
          icon={<RotateCcw size={20}/>} 
          color="rose" 
          isCurrency 
        />
        <StatCard 
          label="Low Stock Items" 
          value={todayOverview?.lowStockItems} 
          growth={todayOverview?.lowStockGrowth} 
          icon={<Box size={20}/>} 
          color="amber" 
          warning={todayOverview?.lowStockItems > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* --- MAIN CHART: BENTO LARGE --- */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Revenue Trajectory</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <Calendar size={14}/> LAST 7 DAYS
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySales}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                   dataKey="date" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{fontSize: 11, fontWeight: 700, fill: '#94A3B8'}} 
                   dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalSales" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- PAYMENT MIX: BENTO SMALL --- */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Payment Distribution</h3>
          <div className="flex-1 flex flex-col justify-center">
             <div className="h-56 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentBreakdown}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={8}
                      dataKey="totalAmount"
                    >
                      {paymentBreakdown?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b'][index % 3]} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-3xl font-black text-slate-900 leading-none">
                     {paymentBreakdown?.length}
                   </span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Methods</span>
                </div>
             </div>
             <div className="mt-8 space-y-3">
               {paymentBreakdown?.map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-3">
                     <div className={`w-3 h-3 rounded-full`} style={{backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'][idx % 3]}} />
                     <span className="text-sm font-bold text-slate-600 uppercase tracking-wide">{item.paymentMethod}</span>
                   </div>
                   <span className="text-sm font-black text-slate-900">LKR {item.totalAmount.toFixed(0)}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* --- PERFORMANCE LEADERBOARD --- */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900">Leaderboard</h3>
              <MoreHorizontal className="text-slate-300" />
           </div>
           
           <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Top Volume Product</p>
                {topProducts?.map((p, i) => (
                   <div key={i} className="group">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-slate-700">{p.productName}</span>
                        <span className="text-sm font-black text-blue-600">{p.quantitySold}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{width: `${p.percentage}%`}} />
                      </div>
                   </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Efficiency by Cashier</p>
                {topCashiers?.map((c, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 font-bold text-xs text-blue-600">
                          {c.cashierName.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{c.cashierName}</span>
                      </div>
                      <span className="text-xs font-black text-slate-900">LKR {c.totalRevenue.toFixed(0)}</span>
                   </div>
                ))}
              </div>
           </div>
        </div>

        {/* --- ACTIVITY STREAM --- */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
           <h3 className="text-xl font-bold text-slate-900 mb-8">Branch Activity Stream</h3>
           <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="pb-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Net Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {activity.map((item, idx) => (
                     <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                             <div className={`p-2 rounded-xl ${item.type === 'REFUND' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                                {item.type === 'REFUND' ? <RotateCcw size={16}/> : <ShoppingBag size={16}/>}
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-800">#{item.id}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{new Date(item.createdAt).toLocaleTimeString()}</p>
                             </div>
                          </div>
                        </td>
                        <td className="py-4">
                           <span className="text-sm font-bold text-slate-600">{item.customer?.fullName || 'Walking Customer'}</span>
                        </td>
                        <td className="py-4">
                           <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${item.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                             {item.status || 'PROCESSED'}
                           </span>
                        </td>
                        <td className="py-4 text-right font-mono font-black text-slate-900">
                           {item.type === 'REFUND' ? '-' : ''}LKR {(item.netAmount || item.totalAmount).toFixed(2)}
                        </td>
                     </tr>
                   ))}
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StatCard = ({ label, value, growth, icon, color, isCurrency, warning }) => {
  const themes = {
    blue: "border-t-blue-500 text-blue-600 bg-blue-50/20",
    emerald: "border-t-emerald-500 text-emerald-600 bg-emerald-50/20",
    rose: "border-t-rose-500 text-rose-600 bg-rose-50/20",
    amber: "border-t-amber-500 text-amber-600 bg-amber-50/20",
  };

  return (
    <div className={`relative bg-white p-6 rounded-[1.5rem] border border-slate-200 border-t-4 ${themes[color]} shadow-sm transition-all hover:-translate-y-1 hover:shadow-md`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">{icon}</div>
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${growth >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
           {growth >= 0 ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
           {Math.abs(growth)}%
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h4 className="text-3xl font-black text-slate-900 tracking-tighter">
        {isCurrency ? `LKR ${value?.toLocaleString()}` : value}
      </h4>
      {warning && <div className="mt-3 text-[10px] font-bold text-rose-500 animate-pulse">ACTION REQUIRED</div>}
    </div>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-800">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{payload[0].payload.date}</p>
        <p className="text-xl font-black text-white leading-none">LKR {payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const LoadingSkeleton = () => (
  <div className="p-8 space-y-8 animate-pulse bg-slate-50 min-h-screen">
    <div className="h-12 w-48 bg-slate-200 rounded-xl" />
    <div className="grid grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white rounded-[1.5rem] border border-slate-200" />)}
    </div>
    <div className="grid grid-cols-12 gap-6">
       <div className="col-span-8 h-96 bg-white rounded-[2rem]" />
       <div className="col-span-4 h-96 bg-white rounded-[2rem]" />
    </div>
  </div>
);

export default PremiumBranchDashboard;