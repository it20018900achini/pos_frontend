// src/features/inventory/StockStatement.js
import React, { useState } from "react";
import { useGetStockStatementQuery } from "../../../Redux Toolkit/features/inventory/inventoryApi";

const StockStatement = ({ branchId }) => {
  const [dates, setDates] = useState({
    startDate: "2026-01-01T00:00:00",
    endDate: "2026-01-09T23:59:59",
  });

  const { data, isLoading, isError } = useGetStockStatementQuery({
    branchId,
    ...dates,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading stock statement</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Stock Statement</h2>
      
      <table className="min-w-full border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Product</th>
            <th className="px-4 py-2 border">Starting Stock</th>
            <th className="px-4 py-2 border">Stock In</th>
            <th className="px-4 py-2 border">Stock Out</th>
            <th className="px-4 py-2 border">Ending Stock</th>
            <th className="px-4 py-2 border">Minimum Stock</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.productId}
              className={item.belowMinimum ? "bg-red-100" : ""}
            >
              <td className="px-4 py-2 border">{item.productName}</td>
              <td className="px-4 py-2 border">{item.startingStock}</td>
              <td className="px-4 py-2 border">{item.stockIn}</td>
              <td className="px-4 py-2 border">{item.stockOut}</td>
              <td className="px-4 py-2 border">{item.endingStock}</td>
              <td className="px-4 py-2 border">{item.minimumStockLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockStatement;
