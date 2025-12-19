import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, UserIcon, ArrowLeft } from "lucide-react";

import CustomerSummary from "./customerPayments/components/CustomerSummary";
import CustomerOrdersPage from "../orders/CustomerOrdersPage";
import CustomerRefundsPage from "../refunds/CustomerRefundsPage";
import CustomerPaymentsPage from "./customerPayments/components/CustomerPaymentsPage";
import UpdateCustomerDialog from "./UpdateCustomerDialog";

import { useGetCustomerByIdQuery } from "@/Redux Toolkit/features/customer/customerApi";

/* Skeleton */
const TabSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-6 w-1/3 bg-muted rounded" />
    <div className="h-6 w-1/4 bg-muted rounded" />
    <div className="h-40 w-full bg-muted rounded" />
    <div className="h-40 w-full bg-muted rounded" />
  </div>
);

const CustomerDetails = ({ customerId }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [tabLoading, setTabLoading] = useState(false);

  const { data: customer, isLoading, isFetching } =
    useGetCustomerByIdQuery(customerId, {
      skip: !customerId,
    });

  const changeTab = (t) => {
    setTabLoading(true);
    setTab(t);
    setTimeout(() => setTabLoading(false), 200);
  };

  /* Empty */
  if (!customerId) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
        <UserIcon size={48} />
        <p className="mt-2 text-sm">Select a customer to view details</p>
      </div>
    );
  }

  /* Loading */
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 p-6 bg-muted/40">

      {/* HEADER CARD */}
      <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600" />

        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {customer.fullName}
              {isFetching && (
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
              )}
            </h2>
            <p className="text-sm text-muted-foreground">{customer.phone}</p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
          >
            Edit Customer
          </Button>
        </div>
      </div>

      {/* EDIT DIALOG */}
      <UpdateCustomerDialog
        open={open}
        setOpen={setOpen}
        customer={customer}
      />

      {/* TABS */}
      <div className="flex items-center gap-2">
        {tab !== 0 && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => changeTab(0)}
            className="rounded-xl"
          >
            <ArrowLeft />
          </Button>
        )}

        <div className="flex gap-1 bg-white border rounded-xl p-1 shadow-sm">
          {["Overview", "Orders", "Refunds", "Payments"].map((label, index) => (
            <button
              key={label}
              onClick={() => changeTab(index)}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg transition-all
                ${
                  tab === index
                    ? "bg-indigo-600 text-white shadow"
                    : "text-muted-foreground hover:bg-muted"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-hidden rounded-2xl border bg-white shadow-inner">
        <div className="h-full overflow-y-auto p-4">
          {tabLoading && <TabSkeleton />}

          {!tabLoading && tab === 0 && (
            <CustomerSummary customerId={customer.id} customer={customer} />
          )}

          {!tabLoading && tab === 1 && (
            <CustomerOrdersPage customerId={customer.id} />
          )}

          {!tabLoading && tab === 2 && (
            <CustomerRefundsPage customerId={customer.id} />
          )}

          {!tabLoading && tab === 3 && (
            <CustomerPaymentsPage customer={customer} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
