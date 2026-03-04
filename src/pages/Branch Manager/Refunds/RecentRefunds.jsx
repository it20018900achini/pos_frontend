"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, SearchIcon } from "lucide-react";
import OrderTable from "./OrderTable";
import { useBranchRefunds } from "@/context/hooks/useBranchRefunds";
import { useSelector } from "react-redux";

const RecentRefunds = ({ branches = [] }) => {
  // Selected branch state (default to first branch)
    const { userProfile,selectedBranchId } = useSelector((state) => state.user);


  const {
    refunds,
    pageInfo,
    loading,
    page,
    setPage,
    size,
    setSize,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchText,
    setSearchText,
    fetchRefunds,
    resetFilters,
  } = useBranchRefunds(selectedBranchId);

  // Reset page when branch changes
  useEffect(() => {
    setPage(0);
    fetchRefunds();
  }, [selectedBranchId]);

  return (
    <div className="h-full flex flex-col">
      {/* ---------------- Filters ---------------- */}
      <div className="p-4 flex flex-wrap gap-2 items-center">

        {/* Branch Selector */}
        

        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-2 py-1"
        />

        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-2 py-1"
        />

        <input
          type="text"
          placeholder="Search refund..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border rounded px-2 py-1"
        />

        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>

        <Button size="sm" onClick={() => fetchRefunds()}>
          Filter
        </Button>

        <Button size="sm" variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      {/* ---------------- Table Section ---------------- */}
      <div className="flex-1 p-4 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : refunds?.length ? (
          <>
            <OrderTable refunds={refunds} />

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <Button
                size="sm"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>

              <span>
                Page {page + 1} of {pageInfo?.totalPages || 1}
              </span>

              <Button
                size="sm"
                disabled={page + 1 >= pageInfo?.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <SearchIcon size={40} />
            <p>No refunds found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentRefunds;