import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Download, FileText, BarChart2, TrendingUp, Users } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, PieChart as RPieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import {
  getDailySalesChart,
  getPaymentBreakdown,
  getCategoryWiseSalesBreakdown,
  getTopCashiersByRevenue,
} from "@/Redux Toolkit/features/branchAnalytics/branchAnalyticsThunks";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Reports = () => {
  const dispatch = useDispatch();
  const branchId = useSelector((state) => state.branch.branch?.id);
  const { dailySales, paymentBreakdown, categorySales, topCashiers } = useSelector((state) => state.branchAnalytics);

  // --- Date range state ---
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    if (branchId) {
      dispatch(getDailySalesChart({ branchId, startDate, endDate }));
      dispatch(getPaymentBreakdown({ branchId, startDate, endDate }));
      dispatch(getCategoryWiseSalesBreakdown({ branchId, startDate, endDate }));
      dispatch(getTopCashiersByRevenue({ branchId, startDate, endDate }));
    }
  }, [branchId, startDate, endDate, dispatch]);

  // --- Currency formatting ---
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "LKR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  // --- Map API data ---
  const salesData = dailySales?.map((item) => ({ date: item.date, sales: item.totalSales })) || [];
  const paymentData = paymentBreakdown?.map((item) => ({ name: item.type, value: item.percentage })) || [];
  const categoryData = categorySales?.map((item) => ({ name: item.categoryName, value: item.totalSales })) || [];
  const cashierData = topCashiers?.map((item) => ({ name: item.cashierName, sales: item.totalRevenue })) || [];

  // --- Export function ---
  const exportToExcel = (data, filename = "report.xlsx") => {
    if (!data || !data.length) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, filename);
  };

  const handleExport = (type) => {
    switch (type) {
      case "sales":
        exportToExcel(salesData.map(d => ({ Date: d.date, Sales: d.sales })), "DailySales.xlsx");
        break;
      case "payments":
        exportToExcel(paymentData.map(d => ({ PaymentType: d.name, Percentage: d.value })), "PaymentBreakdown.xlsx");
        break;
      case "products":
        exportToExcel(categoryData.map(d => ({ Category: d.name, Sales: d.value })), "CategorySales.xlsx");
        break;
      case "cashier":
        exportToExcel(cashierData.map(d => ({ Cashier: d.name, Sales: d.sales })), "CashierPerformance.xlsx");
        break;
      default:
        console.warn("Unknown export type");
    }
  };

  // --- Chart configurations ---
  const salesConfig = { sales: { label: "Sales", color: "#4f46e5" } };
  const paymentConfig = paymentBreakdown?.reduce((acc, item, idx) => {
    acc[item.type] = { label: item.type, color: COLORS[idx % COLORS.length] };
    return acc;
  }, {}) || {};
  const categoryConfig = categorySales?.reduce((acc, item, idx) => {
    acc[item.categoryName] = { label: item.categoryName, color: COLORS[idx % COLORS.length] };
    return acc;
  }, {}) || {};
  const cashierConfig = { sales: { label: "Sales", color: "#4f46e5" } };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-1"
          />
          <span>to</span>
          <input
            type="date"
            value={endDate}
            min={startDate}
            max={today}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-1"
          />
          <Button variant="outline" size="sm" onClick={() => handleExport("sales")}>
            <Download className="h-4 w-4 mr-1" /> Export All
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Sales
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Products
          </TabsTrigger>
          <TabsTrigger value="cashier" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Cashier Performance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Sales Trend */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Daily Sales Trend</CardTitle>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => handleExport("sales")}>
                    <Download className="h-4 w-4" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={salesConfig}>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={salesData}>
                      <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `LKR ${v}`} />
                      <ChartTooltip content={({ active, payload }) => <ChartTooltipContent active={active} payload={payload} formatter={v => [`LKR ${v}`, "Sales"]} />} />
                      <Bar dataKey="sales" fill="currentColor" radius={[4,4,0,0]} className="fill-primary" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Payment Methods</CardTitle>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => handleExport("payments")}>
                    <Download className="h-4 w-4" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={paymentConfig}>
                  <ResponsiveContainer width="100%" height={400}>
                    <RPieChart>
                      <Pie data={paymentData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent*100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                        {paymentData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <ChartTooltip content={({ active, payload }) => <ChartTooltipContent active={active} payload={payload} formatter={v => [`${v}%`, "Percentage"]} />} />
                      <ChartLegend content={({ payload }) => <ChartLegendContent payload={payload} />} />
                    </RPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Sales Performance</CardTitle>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => handleExport("sales")}>
                  <Download className="h-4 w-4" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={salesConfig}>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={salesData}>
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `LKR ${v}`} />
                    <ChartTooltip content={({ active, payload }) => <ChartTooltipContent active={active} payload={payload} formatter={v => [`LKR ${v}`, "Sales"]} />} />
                    <Bar dataKey="sales" fill="currentColor" radius={[4,4,0,0]} className="fill-primary" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Product Category Performance</CardTitle>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => handleExport("products")}>
                  <Download className="h-4 w-4" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartContainer config={categoryConfig}>
                  <ResponsiveContainer width="100%" height={300}>
                    <RPieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent*100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                        {categoryData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <ChartTooltip content={({ active, payload }) => <ChartTooltipContent active={active} payload={payload} formatter={v => [`${v}%`, "Sales Percentage"]} />} />
                      <ChartLegend content={({ payload }) => <ChartLegendContent payload={payload} />} />
                    </RPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="rounded-lg bg-gray-50 p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-500">{category.name}</p>
                          <p className="text-2xl font-bold">{formatCurrency(category.value)}</p>
                        </div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cashier Tab */}
        <TabsContent value="cashier">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Cashier Performance</CardTitle>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => handleExport("cashier")}>
                  <Download className="h-4 w-4" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={cashierConfig}>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={cashierData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `LKR ${v}`} />
                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <ChartTooltip content={({ active, payload }) => <ChartTooltipContent active={active} payload={payload} formatter={v => [`LKR ${v.toLocaleString('en-IN')}`, 'Sales']} />} />
                    <Bar dataKey="sales" fill="currentColor" radius={[0,4,4,0]} className="fill-primary" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
