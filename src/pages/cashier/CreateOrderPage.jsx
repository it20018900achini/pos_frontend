"use client";

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

// Import components
import POSHeader from "./components/POSHeader";
import ProductSection from "./product/ProductSection";
import CartSection from "./cart/CartSection";
import CustomerPaymentSection from "./payment/CustomerPaymentSection";

import PaymentDialog from "./payment/PaymentDialog";
import HeldOrdersDialog from "./components/HeldOrdersDialog";
import CustomerDialog from "./customer/CustomerDialog";
import InvoiceDialog from "./order/OrderDetails/InvoiceDialog";

import { useGetAllCustomersQuery } from "@/Redux Toolkit/features/customer/customerApi";

const CreateOrderPage = () => {
  const { toast } = useToast();
  const searchInputRef = useRef(null);

  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showHeldOrdersDialog, setShowHeldOrdersDialog] = useState(false);

  // ✅ RTK Query for customers
  const {
    data: customers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllCustomersQuery();

  // Handle errors
  useEffect(() => {
    if (isError) {
      toast({
        title: "Customer Fetch Error",
        description: error?.data?.message || "Failed to load customers",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  // Auto-focus search input
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <div className="h-full flex flex-col bg-background">
      <POSHeader />

      <div className="flex-1 flex overflow-hidden">
        <ProductSection searchInputRef={searchInputRef} />
        <CartSection setShowHeldOrdersDialog={setShowHeldOrdersDialog} />
        <CustomerPaymentSection
          setShowCustomerDialog={setShowCustomerDialog}
          setShowPaymentDialog={setShowPaymentDialog}
        />
      </div>

      <CustomerDialog
        showCustomerDialog={showCustomerDialog}
        setShowCustomerDialog={setShowCustomerDialog}
        customers={customers}
        loading={isLoading}
        refetchCustomers={refetch} // optional: refresh after adding a customer
      />

      <PaymentDialog
        showPaymentDialog={showPaymentDialog}
        setShowPaymentDialog={setShowPaymentDialog}
        setShowReceiptDialog={setShowReceiptDialog}
      />

      <InvoiceDialog
        showInvoiceDialog={showReceiptDialog}
        setShowInvoiceDialog={setShowReceiptDialog}
      />

      <HeldOrdersDialog
        showHeldOrdersDialog={showHeldOrdersDialog}
        setShowHeldOrdersDialog={setShowHeldOrdersDialog}
      />
    </div>
  );
};

export default CreateOrderPage;
