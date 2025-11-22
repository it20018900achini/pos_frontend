import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersByCustomerPagin } from "../../../../Redux Toolkit/features/order/orderThunks";
import { clearOrderState } from "../../../../Redux Toolkit/features/order/orderSlice";
// import {
//   getOrdersByCustomerPagin,
//   clearOrderState,
// } from "@/store/order/orderSlice";

export default function CustomerOrdersHistory({ customerId }) {
  const dispatch = useDispatch();

  const { orders, pageInfo, loading } = useSelector((state) => state.order);

  // Page states
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 20;

  // Filters
  const [search, setSearch] = useState("");
  const [dates, setDates] = useState({
    startDate: "",
    endDate: "",
  });

  // Fetch orders (memoized to prevent infinite loop)
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
  }, [dispatch, customerId, search, dates.startDate, dates.endDate, pageNumber]);

  // Run fetch on dependency change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Clear redux state on unmount
  useEffect(() => {
    return () => {
      dispatch(clearOrderState());
    };
  }, [dispatch]);

  // Pagination handlers
  const goNext = () => {
    if (!pageInfo?.last) setPageNumber((p) => p + 1);
  };

  const goPrev = () => {
    if (pageNumber !== 0) setPageNumber((p) => p - 1);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Customer Orders</h2>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search invoice or product..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPageNumber(0);
          }}
          className="border px-3 py-2 rounded"
        />

        <input
          type="date"
          value={dates.startDate}
          onChange={(e) => {
            setDates((prev) => ({ ...prev, startDate: e.target.value }));
            setPageNumber(0);
          }}
          className="border px-3 py-2 rounded"
        />

        <input
          type="date"
          value={dates.endDate}
          onChange={(e) => {
            setDates((prev) => ({ ...prev, endDate: e.target.value }));
            setPageNumber(0);
          }}
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* Table */}
      <div className="border rounded p-3">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No orders found</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Cash</th>
                <th className="border p-2">Credit</th>
                <th className="border p-2">Payment Type</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="border p-2">{o.id}</td>
                  <td className="border p-2">{o.totalAmount}</td>
                  <td className="border p-2">{o.cash}</td>
                  <td className="border p-2">{o.credit}</td>
                  <td className="border p-2">{o.paymentType}</td>
                  <td className="border p-2">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pageInfo && (
        <div className="flex justify-between mt-4">
          <button
            onClick={goPrev}
            disabled={pageNumber === 0}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {pageInfo.pageNumber + 1} of {pageInfo.totalPages}
          </span>

          <button
            onClick={goNext}
            disabled={pageInfo.last}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
