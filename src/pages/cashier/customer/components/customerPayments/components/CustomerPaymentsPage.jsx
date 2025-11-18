import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../../../../../../Redux Toolkit/features/customerPayment/customerPaymentSlice";
import CustomerPaymentTable from "./CustomerPaymentTable";
import CustomerPaymentForm from "./CustomerPaymentForm";
import Filters from "./Filters";
import Pagination from "./Pagination";
import { Loader2 } from "lucide-react";

export default function CustomerPaymentsPage(customer) {
  const dispatch = useDispatch();
  const { payments, loading, totalPages, currentPage } = useSelector(
    (state) => state.customerPayment
  );
  const { userProfile, loading: loadingUser } = useSelector((state) => state.user);

  const [filters, setFilters] = useState({});
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  // Fetch when filters or pagination change
  useEffect(() => {
    const params = {
      ...filters,
      page,
      size: 10,
      sortBy,
      sortDir,
    };
    params.customerId=customer?.customer?.id
    dispatch(fetchPayments({ filters: params }));
    // console.log(filters)
  }, [filters, page, sortBy, sortDir, dispatch]);

  const handleSave = (data) => {
    if (editing) {
      dispatch(updatePayment({ id: editing.id, payment: data }));
      setEditing(null);
    } else {
      dispatch(createPayment(data));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      dispatch(deletePayment(id));
    }
  };

  return (
    <div className="border-t">
      <h1 className="text-3xl font-bold">Customer Payments</h1>
      {/* Filters */}

      {/* Form for Add/Edit */}
      
      <CustomerPaymentForm
        initialData={editing}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
        customer={customer}
        user={userProfile}
      />
      <Filters onFilter={setFilters} />

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
        <Loader2 className="animate-spin h-8 w-8 mb-4" />
        <p>Loading customer payments...</p>
      </div>
      ) : (
        <>
        {payments?.length<1?<p className="text-center my-3">No data found</p>:<CustomerPaymentTable
          payments={payments}
          onEdit={setEditing}
          onDelete={handleDelete}
          onSort={(col, dir) => {
            setSortBy(col);
            setSortDir(dir);
          }}
          user={userProfile}
        />}
        
        
        
        </>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
