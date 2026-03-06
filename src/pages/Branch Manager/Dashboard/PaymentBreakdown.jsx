import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector, useDispatch } from 'react-redux';
import { getPaymentIcon } from '../../../utils/getPaymentIcon';
import { getPaymentBreakdown } from '@/Redux Toolkit/features/branchAnalytics/branchAnalyticsThunks';

const PaymentBreakdown = () => {
  const dispatch = useDispatch();
  const { paymentBreakdown, loading } = useSelector((state) => state.branchAnalytics);
  const { selectedBranchId } = useSelector((state) => state.user);

  // State for selected date
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Load data whenever branchId or date changes
  useEffect(() => {
    if (!selectedBranchId) return;
    dispatch(getPaymentBreakdown({ branchId: selectedBranchId, date }));
  }, [dispatch, selectedBranchId, date]);

  // Handlers for arrows
  const changeDate = (days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString().slice(0, 10));
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="text-xl font-semibold">Payment Breakdown</CardTitle>
        
        {/* Date Controls */}
        <div className="flex items-center gap-2">
          <button
            className="p-1 rounded-md bg-gray-200 hover:bg-gray-300"
            onClick={() => changeDate(-1)}
            title="Previous Day"
          >
            &#8592;
          </button>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-1 border border-gray-300 rounded-md"
          />

          <button
            className="p-1 rounded-md bg-gray-200 hover:bg-gray-300"
            onClick={() => changeDate(1)}
            title="Next Day"
          >
            &#8594;
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {paymentBreakdown && paymentBreakdown.length > 0 ? (
            paymentBreakdown.map((payment) => (
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