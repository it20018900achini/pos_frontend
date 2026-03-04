// src/features/inventory/StockStatementTable.jsx
import React, { useState } from "react";
import { useGetStockStatementQuery } from "../../../Redux Toolkit/features/inventory/inventoryApi";
import { useSelector } from "react-redux";

const StockStatementTable = () => {
      const { selectedBranchId } = useSelector((state) => state.user);
  
  const [branchId, setBranchId] = useState(selectedBranchId);
  const [startDate, setStartDate] = useState("2026-01-01T00:00:00");
  const [endDate, setEndDate] = useState("2026-01-09T23:59:59");
  const [filterParams, setFilterParams] = useState({
    branchId,
    startDate,
    endDate,
  });

  const { data: stockStatement = [], isLoading, isError, refetch } = useGetStockStatementQuery(
    filterParams,
    {
      // optional: refetch automatically when args change
      refetchOnMountOrArgChange: true,
    }
  );

  const handleFilter = () => {
    setFilterParams({ branchId, startDate, endDate });
  };

  if (isLoading) return <p>Loading stock statement...</p>;
  if (isError) return <p>Error loading data!</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Stock Statement</h2>

      {/* Date Filter */}
      <div className="flex gap-2 mb-4 items-center">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate.split("T")[0]}
            onChange={(e) => setStartDate(`${e.target.value}T00:00:00`)}
            className="border p-1 rounded ml-1"
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate.split("T")[0]}
            onChange={(e) => setEndDate(`${e.target.value}T23:59:59`)}
            className="border p-1 rounded ml-1"
          />
        </label>
        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Filter
        </button>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Product</th>
            <th className="border px-2 py-1">Starting Stock</th>
            <th className="border px-2 py-1">Stock In</th>
            <th className="border px-2 py-1">Stock Out</th>
            <th className="border px-2 py-1">Ending Stock</th>
            <th className="border px-2 py-1">Minimum Stock Level</th>
            <th className="border px-2 py-1">Below Minimum?</th>
          </tr>
        </thead>
        <tbody>
          {stockStatement.map((item) => (
            <tr
              key={item.productId}
              className={item.belowMinimum ? "bg-red-100" : ""}
            >
              <td className="border px-2 py-1">{item.productName}</td>
              <td className="border px-2 py-1">{item.startingStock}</td>
              <td className="border px-2 py-1">{item.stockIn}</td>
              <td className="border px-2 py-1">{item.stockOut}</td>
              <td className="border px-2 py-1">{item.endingStock}</td>
              <td className="border px-2 py-1">{item.minimumStockLevel}</td>
              <td className="border px-2 py-1">
                {item.belowMinimum ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockStatementTable;
