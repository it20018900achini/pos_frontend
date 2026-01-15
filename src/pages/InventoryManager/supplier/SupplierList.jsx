import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import {
//   getSuppliers,
//   removeSupplier,
// } from "../../../Redux Toolkit/features/suppliers/supplierSlice";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import EditSupplierDialog from "./EditSupplierDialog";
import { getSuppliers, removeSupplier } from "../../../Redux Toolkit/features/suppliers/supplierSlice";

const PAGE_SIZE = 10;

const SupplierList = () => {
  const dispatch = useDispatch();
  const { suppliers, total, totalPages, loading } = useSelector(
    (state) => state.supplier
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  // ✅ Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    dispatch(
      getSuppliers({
        page: currentPage,
        size: PAGE_SIZE,
        search,
      })
    );
  }, [dispatch, currentPage, search]);

  const handleSearch = () => {
    setCurrentPage(0);
    dispatch(getSuppliers({ page: 0, size: PAGE_SIZE, search }));
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      dispatch(removeSupplier(id)).then(() =>
        dispatch(
          getSuppliers({
            page: currentPage,
            size: PAGE_SIZE,
            search,
          })
        )
      );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Suppliers ({total})</CardTitle>

        {/* ✅ ADD */}
        <Button
          onClick={() => {
            setSelectedSupplier(null); // add mode
            setOpenDialog(true);
          }}
        >
          + Add Supplier
        </Button>
      </CardHeader>

      <CardContent>
        {/* 🔍 Search */}
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {/* 📄 Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="w-full table-auto border rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border-b">ID</th>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Phone</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {suppliers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No suppliers found
                    </td>
                  </tr>
                ) : (
                  suppliers.map((s) => (
                    <tr key={s.id} className="border-b">
                      <td className="px-4 py-2">{s.id}</td>
                      <td className="px-4 py-2">{s.name || "-"}</td>
                      <td className="px-4 py-2">{s.phone || "-"}</td>
                      <td className="px-4 py-2">{s.email || "-"}</td>
                      <td className="px-4 py-2 text-center space-x-2">
                        {/* ✏️ EDIT */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedSupplier(s);
                            setOpenDialog(true);
                          }}
                        >
                          Edit
                        </Button>

                        {/* 🗑️ DELETE */}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(s.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* 📑 Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <Button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>

              <span>
                Page {currentPage + 1} of {totalPages}
              </span>

              <Button
                disabled={currentPage + 1 >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>

      {/* ✅ SINGLE SOURCE OF TRUTH */}
      <EditSupplierDialog
        open={openDialog}
        supplier={selectedSupplier}
        onClose={() => setOpenDialog(false)}
      />
    </Card>
  );
};

export default SupplierList;
