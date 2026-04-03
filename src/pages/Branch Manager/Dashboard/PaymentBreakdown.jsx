import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector, useDispatch } from 'react-redux';
import { getPaymentIcon } from '../../../utils/getPaymentIcon';
import { getPaymentBreakdown } from '@/Redux Toolkit/features/branchAnalytics/branchAnalyticsThunks';

const PaymentBreakdown = ({ selectedBranchId }) => {
  const dispatch = useDispatch();
  const { paymentBreakdown, loading } = useSelector((state) => state.branchAnalytics);

  // 1. Initial state defaults to today
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  // 2. Fetch data when branchId or date changes
  useEffect(() => {
    if (!selectedBranchId) return;
    dispatch(getPaymentBreakdown({ branchId: selectedBranchId, date }));
  }, [dispatch, selectedBranchId, date]);

  // 3. NEW: Sync local date with latestRecordDate from backend on first success
  useEffect(() => {
    if (paymentBreakdown?.latestRecordDate) {
      // Update state to the actual latest date found in the DB
      setDate(paymentBreakdown.latestRecordDate);
    }
  }, [paymentBreakdown?.latestRecordDate]); // Only runs when the backend value changes

  const changeDate = (days) => {
    // We use the current state date to calculate the next/prev day
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + days);
    setDate(currentDate.toISOString().slice(0, 10));
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
           <CardTitle className="text-xl font-semibold">Payment Breakdown</CardTitle>
           {/* Optional: Show the user they are looking at the latest data */}
           <p className="text-xs text-muted-foreground">
             Latest data: {paymentBreakdown?.latestRecordDate || "..."}
           </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 rounded-md bg-secondary hover:bg-secondary/80 disabled:opacity-50"
            onClick={() => changeDate(-1)}
            disabled={loading}
          >
            &#8592;
          </button>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-1 border border-input rounded-md bg-background text-sm"
          />

          <button
            className="p-1.5 rounded-md bg-secondary hover:bg-secondary/80 disabled:opacity-50"
            onClick={() => changeDate(1)}
            disabled={loading}
          >
            &#8594;
          </button>
        </div>
      </CardHeader>

     
      <CardContent>
        <div className="space-y-4">
          {paymentBreakdown?.breakdown && paymentBreakdown?.breakdown.length > 0 ? (
            paymentBreakdown?.breakdown.map((payment) => (
              <div key={payment.type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getPaymentIcon(payment.type)}
                  <span>{payment.paymentMethod}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${payment.percentage ?? 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">LKR {payment.totalAmount?.toLocaleString() ?? "-"}</span>
                  <span className="text-xs text-gray-500">{payment.percentage ? `${payment.percentage}%` : ""}</span>
                  <span className="text-xs text-gray-500">{payment.transactionCount ? `(${payment.transactionCount} txns)` : ""}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400">
              {loading ? "Loading payment breakdown..." : "No data available"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentBreakdown;