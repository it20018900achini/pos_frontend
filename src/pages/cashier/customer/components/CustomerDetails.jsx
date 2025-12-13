import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, UserIcon, ArrowBigLeft } from "lucide-react";

import CustomerSummary from "./customerPayments/components/CustomerSummary";
import CustomerOrdersPage from "../orders/CustomerOrdersPage";
import CustomerRefundsPage from "../refunds/CustomerRefundsPage";
import CustomerPaymentsPage from "./customerPayments/components/CustomerPaymentsPage";
import UpdateCustomerDialog from "./UpdateCustomerDialog";

import {
  useGetCustomerByIdQuery,
} from "@/Redux Toolkit/features/customer/customerApi";

// Skeleton loader for tabs
const TabSkeleton = () => (
  <div className="space-y-4 animate-pulse p-4">
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

  const {
    data: customer,
    isLoading,
    isFetching,
  } = useGetCustomerByIdQuery(customerId, {
    skip: !customerId,
  });

  // Handle tab change
  const handleTabChange = (newTab) => {
    setTabLoading(true);
    setTab(newTab);
    setTimeout(() => setTabLoading(false), 200);
  };

  // Empty state
  if (!customerId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <UserIcon size={48} />
        <p className="mt-2">Select a customer</p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col space-y-4 h-full">

      {/* HEADER */}
      <div className="md:flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">
            {customer.fullName}
            {isFetching && (
              <Loader2 className="inline ml-2 h-4 w-4 animate-spin" />
            )}
          </h2>
          <p className="text-muted-foreground">{customer.phone}</p>
          <p className="text-muted-foreground">{customer.email}</p>
        </div>

        <Button onClick={() => setOpen(true)}>Edit</Button>
      </div>

      {/* EDIT DIALOG */}
      <UpdateCustomerDialog
        open={open}
        setOpen={setOpen}
        customer={customer}
      />

      {/* TABS */}
      <div className="flex gap-2">
        {tab !== 0 && (
          <Button
            variant="secondary"
            onClick={() => handleTabChange(0)}
          >
            <ArrowBigLeft />
          </Button>
        )}

        <Button
          onClick={() => handleTabChange(1)}
          variant={tab === 1 ? "secondary" : "default"}
        >
          Orders
        </Button>

        <Button
          onClick={() => handleTabChange(2)}
          variant={tab === 2 ? "secondary" : "default"}
        >
          Refunds
        </Button>

        <Button
          onClick={() => handleTabChange(3)}
          variant={tab === 3 ? "secondary" : "default"}
        >
          Payments
        </Button>
      </div>

      {/* TAB CONTENT (YOUR SECTION ✅) */}
      <div className="flex-1 overflow-y-auto shadow-inner p-2 rounded-md bg-card">
        {tab === 0 &&
          (tabLoading ? (
            <TabSkeleton />
          ) : (
            customer&&<CustomerSummary customerId={customer.id} customer={customer} />
          ))}

        {tab === 1 &&
          (tabLoading ? (
            <TabSkeleton />
          ) : (
            <CustomerOrdersPage customerId={customer.id} />
          ))}

        {tab === 2 &&
          (tabLoading ? (
            <TabSkeleton />
          ) : (
            <CustomerRefundsPage customerId={customer.id} />
          ))}

        {tab === 3 &&
          (tabLoading ? (
            <TabSkeleton />
          ) : (
            <CustomerPaymentsPage customer={customer} />
          ))}
      </div>
    </div>
  );
};

export default CustomerDetails;
