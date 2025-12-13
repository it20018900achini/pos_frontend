import React, { useState, useMemo } from "react";
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
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [editing, setEditing] = useState(null);

  const { data, isLoading, isFetching } = useGetPaymentsQuery(
    {
      customerId: customer?.id,
      page,
      size: 10,
      sortBy,
      sortDir,
      ...filters,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [createPayment, { isLoading: isSaving }] = useCreatePaymentMutation();
  const [updatePayment] = useUpdatePaymentMutation();
  const [deletePayment] = useDeletePaymentMutation();

  const handleSave = async (paymentData) => {
    try {
      if (editing) {
        await updatePayment({ id: editing.id, payment: paymentData }).unwrap();
        setEditing(null);
      } else {
        await createPayment({ ...paymentData, customerId: customer?.id }).unwrap();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await deletePayment(id).unwrap();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const tableData = useMemo(() => data?.content || [], [data]);

  return (
    <div className="border-t p-4 space-y-4">
      <div className="flex justify-between items-center gap-2">
        <Filters onFilter={setFilters} />
        <CustomerPaymentForm
          initialData={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          customer={customer}
          isLoading={isSaving}
        />
      </div>

      {isLoading || isFetching ? (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <Loader2 className="animate-spin h-8 w-8 mb-4" />
          <p>Loading payments...</p>
        </div>
      ) : tableData.length < 1 ? (
        <p className="text-center text-muted-foreground py-8">No payments found</p>
      ) : (
        <CustomerPaymentTable
          payments={tableData}
          onEdit={setEditing}
          onDelete={handleDelete}
          onSort={(col, dir) => {
            setSortBy(col);
            setSortDir(dir);
          }}
        />
      )}

      <Pagination
        currentPage={data?.number || 0}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}
