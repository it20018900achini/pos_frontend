import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecentRefundsByBranchPagin } from "../../../Redux Toolkit/features/refund/refundThunks";

const RecentRefunds = ({ branchId }) => {
  const dispatch = useDispatch();
const { refunds, pageInfo,loading,error } = useSelector((state) => state.refund);
console.log("Refunds state:", refunds);
console.log("Page info:", pageInfo);
// console.log("Loading:", loading);
// console.log("Error:", error);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // Reset page to 0 when search or date filter changes
  useEffect(() => {
    setPage(0);
  }, [search, start, end]);

  // Fetch refunds whenever dependencies change
  useEffect(() => {
    if (branchId) {
      dispatch(getRecentRefundsByBranchPagin({ branchId, page, size, search, start, end }));
    }
  }, [branchId, page, size, search, start, end, dispatch]);

  const handlePrevPage = () => page > 0 && setPage(page - 1);
  const handleNextPage = () => pageInfo && page < pageInfo.totalPages - 1 && setPage(page + 1);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Recent Refunds</h2>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-1 rounded flex-1"
        />
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="border p-1 rounded"
        />
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="border p-1 rounded"
        />
      </div>

      {loading && <p>Loading refunds...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Total Amount</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {refunds.length > 0 ? (
            refunds.map((r) => (
              <tr key={r.id}>
                <td className="border p-2">{r.id}</td>
                <td className="border p-2">{r.customer?.fullName || "-"}</td>
                <td className="border p-2 text-right">{r.totalAmount.toFixed(2)}</td>
                <td className="border p-2 text-right">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="border p-2">{r.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No refunds found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
{/* {JSON.stringify(refunds)} */}
      {/* Pagination */}
      {pageInfo && pageInfo.totalPages > 1 && (
        <div className="flex justify-between mt-4 items-center">
          <button
            onClick={handlePrevPage}
            disabled={page === 0}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {pageInfo.page + 1} of {pageInfo.totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page >= pageInfo.totalPages - 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentRefunds;
