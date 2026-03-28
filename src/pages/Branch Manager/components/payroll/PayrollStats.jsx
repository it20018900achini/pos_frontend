"use client";

import React, { useState } from "react";
import { useGetPayrollStatsByBranchQuery } from "@/Redux Toolkit/features/payroll/payrollApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet,
  CalendarDays 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PayrollAdmin from "./PayrollAdmin";

export default function PayrollStats({ branchId, renderChart }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const { data, isLoading } = useGetPayrollStatsByBranchQuery({
    branchId,
    year,
    month,
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (isLoading) return <PayrollStatsSkeleton />;

  if (!data) return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl opacity-50">
      <p className="text-slate-500 font-medium">No payroll data available for this period</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* <PayrollAdmin/> */}
      {/* --- HEADER & FILTERS --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Payroll Performance
          </h2>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-indigo-500" />
            Financial insights for {months[month - 1]} {year}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-[110px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {[year - 1, year, year + 1].map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-[140px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((name, index) => (
                <SelectItem key={index} value={String(index + 1)}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Main Focus: Net Salary */}
        <StatCard 
          title="Total Net Payout" 
          value={`Rs. ${data.totalNetSalary.toLocaleString()}`}
          subtitle="Actual disbursed amount"
          icon={<Wallet className="text-emerald-600" />}
          trend="primary"
        />

        <StatCard 
          title="Total Employees" 
          value={data.totalEmployees}
          subtitle={`${data.paidCount} Paid / ${data.pendingCount} Pending`}
          icon={<Users className="text-indigo-600" />}
          customElement={
             <div className="flex gap-2 mt-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                   {((data.paidCount / data.totalEmployees) * 100).toFixed(0)}% Disbursed
                </span>
             </div>
          }
        />

        <StatCard 
          title="Gross vs Deductions" 
          value={`Rs. ${data.totalGrossSalary.toLocaleString()}`}
          subtitle={`- Rs. ${data.totalDeductions.toLocaleString()} deductions`}
          icon={<ArrowDownRight className="text-rose-600" />}
          trend="danger"
        />
      </div>

      {/* --- CHART SECTION --- */}
      {renderChart && (
        <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-950 rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Salary Distribution Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderChart(data)}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/** * Sub-component for individual Stat Cards
 */
function StatCard({ title, value, subtitle, icon, trend, customElement }) {
  return (
    <Card className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            {icon}
          </div>
          {trend === "primary" && <ArrowUpRight className="w-4 h-4 text-emerald-500" />}
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{value}</h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
          {customElement}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Modern Skeleton State
 */
function PayrollStatsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}