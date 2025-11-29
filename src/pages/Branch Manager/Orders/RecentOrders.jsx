import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecentOrdersByBranchPagin } from "../../../Redux Toolkit/features/order/orderThunks";
import { Loader2 } from "lucide-react";

const RecentOrders = ({ branchId }) => {
  const dispatch = useDispatch();
const { orders, pageInfo,loading,error } = useSelector((state) => state.order);
console.log("Orders state:", orders);
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

  // Fetch orders whenever dependencies change
  useEffect(() => {
    if (branchId) {
      dispatch(getRecentOrdersByBranchPagin({ branchId, page, size, search, start, end }));
    }
  }, [branchId, page, size, search, start, end, dispatch]);

  const handlePrevPage = () => page > 0 && setPage(page - 1);
  const handleNextPage = () => pageInfo && page < pageInfo.totalPages - 1 && setPage(page + 1);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Recent Orders {`(${pageInfo?.totalElements})`}</h2>
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

      
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-end ">
        {loading&&<span  className="relative flex size-3 ">
        <span  className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
        <span  className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
        </span>}
        
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Total Amount</th>
            <th className="border p-2">Cashier</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
            {/* {loading && <tr><td colSpan={5}>Loading orders...</td></tr>} */}
          { orders.length > 0 ? (
            orders.map((r) => (
              <tr key={r.id}>
                <td className="border p-2">{r.id}</td>
                <td className="border p-2"><span className="float-end text-neutral-500 text-sm"> #{r?.customer?.id}</span>{r.customer?.fullName || "-"}</td>
                <td className="border p-2 text-right">{r.totalAmount.toFixed(2)}</td>
                                <td className="border p-2 text-center">#{r.cashierId || "-"}</td>

                <td className="border p-2 text-right">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="border p-2 text-center">
{JSON.stringify(r?.status)}
                </td>
              </tr>
            ))
          ) : (
            !loading?<tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No orders found.
              </td>
            </tr>:<tr>
              <td colSpan={5}>
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
        <Loader2 className="animate-spin h-8 w-8 mb-4" />
        <p>Loading orders...</p>
      </div>
              </td>
            </tr>
          )}
          {/* {JSON.stringify(pageInfo)} */}
        </tbody>
      </table>
{/* {JSON.stringify(orders)} */}
      {/* Pagination */}
      {pageInfo && pageInfo.totalPages > 1 && (
        <div className="flex justify-between mt-4 items-center">
          <button
            onClick={handlePrevPage}
            disabled={page === 0}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>
          <span>
            Page {pageInfo.page + 1} of {pageInfo.totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page >= pageInfo.totalPages - 1}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
      <div className="text-4xl fixed bottom-6 right-8">

{loading&&<div  class="flex items-center gap-2">
  <span class="sr-only">Loading…</span>

  <div class="flex items-end space-x-1">
    <span class="w-2.5 h-2.5 rounded-full bg-green-700 animate-bounce" style={{animationDelay:"0s"}}></span>
    <span class="w-2.5 h-2.5 rounded-full bg-green-700 animate-bounce" style={{animationDelay:"0.12s"}}></span>
    <span class="w-2.5 h-2.5 rounded-full bg-green-700 animate-bounce" style={{animationDelay:"0.24s"}}></span>
  </div>
</div>}
        



      </div>
    </div>
  );
};

export default RecentOrders;
