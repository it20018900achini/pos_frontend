import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPurchases } from "@/Redux Toolkit/features/purchase/purchaseSlice";
import PurchaseModal from "./PurchaseModal";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";

const PurchaseList = () => {
  const dispatch = useDispatch();
  const { purchases, totalElements, loading, error } = useSelector((state) => state.purchase);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [page, setPage] = useState(0);
  const size = 10;

  // Debounced fetch
  const fetchPurchases = useCallback(
    debounce((params) => dispatch(getPurchases(params)), 500),
    [dispatch]
  );

  // Fetch purchases whenever filters or page change
  useEffect(() => {
    fetchPurchases({
      page,
      size,
      search,
      from: dateRange.from || undefined,
      to: dateRange.to || undefined,
    });
  }, [fetchPurchases, page, size, search, dateRange]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleDateChange = (field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const formatDateTime = (dateStr) => (dateStr ? new Date(dateStr).toLocaleString() : "-");

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle>Purchases</CardTitle>
          <Button onClick={() => setOpen(true)}>+ New Purchase</Button>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Search by supplier..."
              value={search}
              onChange={handleSearchChange}
              className="border rounded p-1"
            />
            <input
              type="datetime-local"
              value={dateRange.from}
              onChange={(e) => handleDateChange("from", e.target.value)}
              className="border rounded p-1"
            />
            <input
              type="datetime-local"
              value={dateRange.to}
              onChange={(e) => handleDateChange("to", e.target.value)}
              className="border rounded p-1"
            />
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : purchases?.length === 0 ? (
            <p className="text-muted-foreground">No purchases found</p>
          ) : (
            <>
              {/* Purchase Table */}
              <table className="w-full border rounded-md">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Supplier</th>
                    <th className="p-2 text-left">Total</th>
                    <th className="p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => (
                    <React.Fragment key={p.id}>
                      <tr className="border-t">
                        <td className="p-2">{p.id}</td>
                        <td className="p-2">{p?.supplier?.name}</td>
                        <td className="p-2">Rs. {p.totalAmount}</td>
                        <td className="p-2">{formatDateTime(p.purchaseDate)}</td>
                      </tr>
                      {p.items.map((item) => (
                        <tr key={item.id} className="bg-gray-50">
                          <td className="p-2"></td>
                          <td className="p-2">{item.productName}</td>
                          <td className="p-2">{item.quantity}</td>
                          <td className="p-2">Rs. {item.price}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="mt-2 flex justify-end gap-2">
                <Button disabled={page === 0} onClick={() => setPage(page - 1)}>
                  Prev
                </Button>
                <span className="px-2 py-1">
                  {page + 1} / {totalElements ? Math.ceil(totalElements / size) : 1}
                </span>
                <Button
                  disabled={totalElements ? (page + 1) * size >= totalElements : true}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <PurchaseModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default PurchaseList;
