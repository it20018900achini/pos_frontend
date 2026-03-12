import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";

import { getPurchases } from "@/Redux Toolkit/features/purchase/purchaseSlice";
import PurchaseModal from "./PurchaseModal";
import ReturnPurchaseModal from "./ReturnPurchaseModal";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 10;

const PurchaseList = () => {
  const dispatch = useDispatch();
  const { purchases, total, loading, error } = useSelector(
    (state) => state.purchase
  );

  // UI state
  const [openCreate, setOpenCreate] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [page, setPage] = useState(0);
const {selectedBranchId}=useSelector((state)=>state.user)
const branchId=selectedBranchId
  // Debounced fetch
  const debouncedFetch = useMemo(
    () =>
      debounce((params) => {
        dispatch(getPurchases(params));
      }, 400),
    [dispatch]
  );

  useEffect(() => {
    debouncedFetch({
      branchId,
      page,
      size: PAGE_SIZE,
      search,
      from: dateRange.from || undefined,
      to: dateRange.to || undefined,
    });

    return () => debouncedFetch.cancel();
  }, [branchId,page, search, dateRange, debouncedFetch]);

  // Handlers
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleDateChange = (key, value) => {
    setDateRange((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const openReturnModal = (purchase) => {
    setSelectedPurchase(purchase);
    setOpenReturn(true);
  };

  const formatDateTime = useCallback(
    (date) => (date ? new Date(date).toLocaleString() : "-"),
    []
  );

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Purchases-</CardTitle>
          <Button onClick={() => setOpenCreate(true)}>+ New Purchase</Button>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-2">
            <Input
              placeholder="Search supplier..."
              value={search}
              onChange={handleSearchChange}
              className="w-56"
            />
            <Input
              type="datetime-local"
              value={dateRange.from}
              onChange={(e) => handleDateChange("from", e.target.value)}
            />
            <Input
              type="datetime-local"
              value={dateRange.to}
              onChange={(e) => handleDateChange("to", e.target.value)}
            />
          </div>

          {/* Content */}
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && purchases?.length === 0 && (
            <p className="text-muted-foreground">No purchases found</p>
          )}

          {!loading && !error && purchases?.length > 0 && (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border rounded-md">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">ID</th>
                      <th className="p-2 text-left">Supplier</th>
                      <th className="p-2 text-left">Total</th>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((p) => (
                      <React.Fragment key={p.id}>
                        <tr className="border-t">
                          <td className="p-2">{p.id}</td>
                          <td className="p-2">{p?.supplier?.name}</td>
                          <td className="p-2">Rs. {p.totalAmount}</td>
                          <td className="p-2">
                            {formatDateTime(p.purchaseDate)}
                          </td>
                          <td className="p-2 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openReturnModal(p)}
                            >
                              Return
                            </Button>
                          </td>
                        </tr>

                        {p.items.map((item) => (
                          <tr key={item.id} className="bg-gray-50">
                            <td />
                            <td className="p-2">{item.variantName}</td>
                            <td className="p-2">
                              Qty: {item.quantity}
                            </td>
                            <td className="p-2">
                              Rs. {item.price}
                            </td>
                            <td />
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </Button>

                <span className="text-sm">
                  Page {page + 1} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <PurchaseModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      {selectedPurchase && (
        <ReturnPurchaseModal
          open={openReturn}
          onClose={() => setOpenReturn(false)}
          purchase={selectedPurchase}
        />
      )}
    </>
  );
};

export default PurchaseList;
