"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Trash2 } from "lucide-react";

// UI Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Custom Components
import ReusableTable from "../../common/ReusableTable";
import { 
  getSuppliers, 
  removeSupplier 
} from "../../../Redux Toolkit/features/suppliers/supplierSlice";

const PAGE_SIZE = 10;

const SupplierList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const { suppliers, total, totalPages, loading } = useSelector((state) => state.supplier);

  const [filters, setFilters] = useState({ search: "" });
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    dispatch(getSuppliers({ page: currentPage, size: PAGE_SIZE, search: filters.search }));
  }, [dispatch, currentPage, filters.search]);

  const handleDelete = (id) => {
    if (confirm("Are you sure?")) {
      dispatch(removeSupplier(id)).then(() =>
        dispatch(getSuppliers({ page: currentPage, size: PAGE_SIZE, search: filters.search }))
      );
    }
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name", sortable: true },
    { header: "Phone", accessor: "phone" },
    { header: "Email", accessor: "email" },
  ];

  const renderActions = (supplier) => (
    <div className="flex items-center gap-2">
      <Button 
        size="icon" variant="ghost" className="h-8 w-8 text-blue-600" 
        onClick={() => onEdit(supplier)} // Triggers parent state
      >
        <Edit size={14} />
      </Button>
      <Button 
        size="icon" variant="ghost" className="h-8 w-8 text-destructive" 
        onClick={() => handleDelete(supplier.id)}
      >
        <Trash2 size={14} />
      </Button>
    </div>
  );

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">
          Active Suppliers 
          <span className="ml-2 text-muted-foreground text-sm font-normal">({total || 0})</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ReusableTable
          columns={columns}
          data={suppliers || []}
          loading={loading}
          isServer={true}
          page={currentPage}
          totalPages={totalPages || 1}
          onPageChange={(newPage) => setCurrentPage(newPage)}
          enableSearch={true}
          filters={filters}
          setFilters={setFilters}
          onFilter={(f) => { setFilters(f); setCurrentPage(0); }}
          actions={renderActions}
        />
      </CardContent>
    </Card>
  );
};

export default SupplierList;