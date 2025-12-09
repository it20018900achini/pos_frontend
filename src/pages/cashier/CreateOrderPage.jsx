import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
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

import { getAllCustomers } from "@/Redux Toolkit/features/customer/customerThunks";

const CreateOrderPage = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const searchInputRef = useRef(null);
  const { error: orderError } = useSelector((state) => state.order);
  const { customers, loading } = useSelector((state) => state.customer);

  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showHeldOrdersDialog, setShowHeldOrdersDialog] = useState(false);

  // Fetch all customers ONCE when page loads
  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (orderError) {
      toast({
        title: "Order Error",
        description: orderError,
        variant: "destructive",
      });
    }
  }, [orderError, toast]);

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
        loading={loading}
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
