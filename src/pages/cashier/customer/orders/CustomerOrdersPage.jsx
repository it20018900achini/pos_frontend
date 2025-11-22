// src/components/CustomerOrderPage.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomerOrders,
  setPage,
  setSort,
  setFilters,
  resetFilters
} from "../../../../Redux Toolkit/features/customer/customerOrders/customerOrderSlice";

export default function CustomerOrderPage({ customerId }) {
  const dispatch = useDispatch();

  const {
    content,
    number,
    totalPages,
    sortBy,
    sortDir,
    status,
    startDate,
    endDate,
    loading,
  } = useSelector((state) => state.customerOrder);

  // Load data
  useEffect(() => {
    dispatch(
      fetchCustomerOrders({
        customerId,
        page: number,
        sortBy,
        sortDir,
        status,
        startDate,
        endDate,
      })
    );
  }, [customerId, number, sortBy, sortDir, status, startDate, endDate, dispatch]);

  // Sorting handler
  const handleSort = (field) => {
    const newDir = sortDir === "asc" ? "desc" : "asc";
    dispatch(setSort({ sortBy: field, sortDir: newDir }));
  };

  // Filter handler
  const handleFilterChange = (e) => {
    dispatch(
      setFilters({
        ...{
          status,
          startDate,
          endDate,
        },
        [e.target.name]: e.target.value,
      })
    );
  };

  const clearFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Customer Orders</h2>

      {/* ========================= FILTERS ========================= */}
      <div className="flex gap-3 mb-4">
        {/* Status Filter */}
        <select
          name="status"
          value={status}
          onChange={handleFilterChange}
          className="border p-1"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETE">Complete</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {/* Date Filter */}
        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={handleFilterChange}
          className="border p-1"
        />

        <input
          type="date"
          name="endDate"
          value={endDate}
          onChange={handleFilterChange}
          className="border p-1"
        />

        <button onClick={clearFilters} className="border px-2">
          Clear
        </button>
      </div>

      {/* ========================= TABLE ========================= */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th
                className="cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                Date {sortBy === "createdAt" ? `(${sortDir})` : ""}
              </th>

              <th
                className="cursor-pointer"
                onClick={() => handleSort("total")}
              >
                Total {sortBy === "total" ? `(${sortDir})` : ""}
              </th>

              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {content.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-3">
                  No records found
                </td>
              </tr>
            ) : (
              content.map((order) => (
                <tr key={order.id} className="border-t">
                  <td>{order?.id}| {order.createdAt}</td>
                  <td>{order.total}</td>
                  <td>{order.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
{/* <pre>{JSON.stringify(content,null,2)}</pre> */}
      {/* ========================= PAGINATION ========================= */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="border p-1 px-3"
          disabled={number === 0}
          onClick={() => dispatch(setPage(number - 1))}
        >
          Prev
        </button>

        <span>
          Page {number + 1} of {totalPages}
        </span>

        <button
          className="border p-1 px-3"
          disabled={number + 1 >= totalPages}
          onClick={() => dispatch(setPage(number + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
