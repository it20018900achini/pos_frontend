// src/components/CustomerPaymentsPage.jsx
import React, { useState } from "react";
import {
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} from "@/Redux Toolkit/features/customer/customerPaymentApi";
import CustomerPaymentForm from "./CustomerPaymentForm";
import CustomerPaymentTable from "./CustomerPaymentTable";
import Filters from "./Filters";
import Pagination from "./Pagination";
import { Loader2 } from "lucide-react";

export default function CustomerPaymentsPage({ customer }) {
  const [filters, setFilters] = useState({});
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const {
    data,
    isLoading,
    isFetching,
  } = useGetPaymentsQuery({
    customerId: customer?.id,
    page,
    size: 10,
    sortBy,
    sortDir,
    ...filters,
  });

  const [createPayment] = useCreatePaymentMutation();
  const [updatePayment] = useUpdatePaymentMutation();
  const [deletePayment] = useDeletePaymentMutation();

  const handleSave = async (data) => {
    if (editing) {
      await updatePayment({ id: editing.id, payment: data });
      setEditing(null);
    } else {
      await createPayment(data);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      await deletePayment(id);
    }
  };

  const payments = data?.content || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.number || 0;

  return (
    <div className="border-t p-4">
      <div className="flex w-full justify-between items-center gap-2 mb-4">
        <Filters onFilter={setFilters} />
        <CustomerPaymentForm
          initialData={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          customer={customer}
        />
      </div>

      {isLoading || isFetching ? (
        <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground p-4">
          <Loader2 className="animate-spin h-8 w-8 mb-2" />
          <p>Loading payments...</p>
        </div>
      ) : payments.length < 1 ? (
        <p className="text-center my-3">No data found</p>
      ) : (
        <CustomerPaymentTable
          payments={payments}
          onEdit={setEditing}
          onDelete={handleDelete}
          onSort={(col, dir) => {
            setSortBy(col);
            setSortDir(dir);
          }}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
