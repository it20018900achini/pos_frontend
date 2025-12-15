import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrdersByCustomerPagin,
} from "../../../../Redux Toolkit/features/order/orderThunks";
import { clearOrderState } from "../../../../Redux Toolkit/features/order/orderSlice";

export default function CustomerOrdersHistory({ customerId }) {
  const dispatch = useDispatch();
  const { orders, pageInfo, loading } = useSelector((state) => state.order);

  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 20;

  const [search, setSearch] = useState("");
  const [dates, setDates] = useState({ startDate: "", endDate: "" });

  const fetchOrders = useCallback(() => {
    dispatch(
      getOrdersByCustomerPagin({
        customerId,
        search,
        start: dates.startDate || null,
        end: dates.endDate || null,
        pageNumber,
        pageSize,
      })
    );
  }, [dispatch, customerId, search, dates, pageNumber]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    return () => dispatch(clearOrderState());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">Order History</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search invoice / product"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageNumber(0);
            }}
            className="px-3 py-2 border rounded-lg text-sm"
          />

          <input
            type="date"
            value={dates.startDate}
            onChange={(e) => {
              setDates((p) => ({ ...p, startDate: e.target.value }));
              setPageNumber(0);
            }}
            className="px-3 py-2 border rounded-lg text-sm"
          />

          <input
            type="date"
            value={dates.endDate}
            onChange={(e) => {
              setDates((p) => ({ ...p, endDate: e.target.value }));
              setPageNumber(0);
            }}
            className="px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          No orders found
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="
                p-4 rounded-xl border
                bg-white hover:bg-gray-50
                transition
              "
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Left */}
                <div>
                  <p className="font-semibold">
                    Order #{o.id}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Center */}
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Total</p>
                    <p className="font-semibold">{o.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Cash</p>
                    <p>{o.cash}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Credit</p>
                    <p>{o.credit}</p>
                  </div>
                </div>

                {/* Right */}
                <div
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${
                      o.paymentType === "CASH"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }
                  `}
                >
                  {o.paymentType}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pageInfo && (
        <div className="flex items-center justify-between pt-4 border-t">
          <button
            onClick={() => setPageNumber((p) => Math.max(p - 1, 0))}
            disabled={pageNumber === 0}
            className="px-4 py-2 rounded-lg border disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500">
            Page {pageInfo.pageNumber + 1} of {pageInfo.totalPages}
          </span>

          <button
            onClick={() => setPageNumber((p) => p + 1)}
            disabled={pageInfo.last}
            className="px-4 py-2 rounded-lg border disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
