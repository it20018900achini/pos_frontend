import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useBranchOrders } from "@/context/hooks/useBranchOrders";
import OrderTable from "./OrderTable";

const RecentOrders = ({ branches = [] }) => {
  const {
    orders,
    pageInfo,
    loading,
    userProfile,

    selectedBranchId,
    setSelectedBranchId,

    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchText,
    setSearchText,

    page,
    setPage,
    size,
    setSize,

    loadOrders,
  } = useBranchOrders();

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchText("");
    setPage(0);
    loadOrders("", "", "");
  };

  const nextPage = () => {
    if (pageInfo && page < pageInfo.totalPages - 1) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <div className="h-full flex flex-col">
    

      {/* Branch Select (Admin Only) */}
      {!userProfile?.user?.branch?.id && (
        <div className="p-4">
          <select
            value={selectedBranchId}
            onChange={(e) => {
              setSelectedBranchId(e.target.value);
              setPage(0);
            }}
            className="border p-2"
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Filters */}
      <div className="p-4 flex flex-wrap gap-2">
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2"
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search..."
          className="border p-2"
        />
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="border p-2"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>

        <Button onClick={() => loadOrders()} disabled={loading}>
          Filter
        </Button>

        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>

        <Button
          variant="outline"
          onClick={() => loadOrders()}
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Orders Table */}
      <div className="flex-1 p-4 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin h-10 w-10" />
          </div>
        ) : orders?.length ? (
          <>
            <OrderTable orders={orders} />

            {/* Pagination */}
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                disabled={page === 0}
                onClick={prevPage}
              >
                Prev
              </Button>

              <span>
                Page {page + 1} of {pageInfo?.totalPages || 1}
              </span>

              <Button
                variant="outline"
                disabled={
                  pageInfo && page >= pageInfo.totalPages - 1
                }
                onClick={nextPage}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;