"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, PlayCircle, Loader2 } from "lucide-react";

// UI Components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// POS Components
import POSHeader from "./components/POSHeader";
import ProductSection from "./product/ProductSection";
import CartSection from "./cart/CartSection";
import CustomerPaymentSection from "./payment/CustomerPaymentSection";

// Dialogs & Forms
import PaymentDialog from "./payment/PaymentDialog";
import HeldOrdersDialog from "./components/HeldOrdersDialog";
import CustomerDialog from "./customer/CustomerDialog";
import InvoiceDialog from "./order/OrderDetails/InvoiceDialog";
import StartShiftForm from "./ShiftSummary/shifts/StartShiftForm";

import { useGetAllCustomersQuery } from "@/Redux Toolkit/features/customer/customerApi";
import { fetchCurrentShift } from "@/Redux Toolkit/features/shift/shiftSlice";

const CreateOrderPage = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const searchInputRef = useRef(null);

  // 1. Selectors
  const { selectedBranchId } = useSelector((state) => state.user);
  const { currentShift, loading: shiftLoading } = useSelector((state) => state.shift);
  const selectedCustomer = useSelector((state) => state.cart.selectedCustomer);

  // 2. Dialog States
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showHeldOrdersDialog, setShowHeldOrdersDialog] = useState(false);
  const [openStartShift, setOpenStartShift] = useState(false);

  // 3. RTK Query for customers
  const {
    data: customers = [],
    isLoading: customersLoading,
    isError,
    error: customerError,
    refetch,
  } = useGetAllCustomersQuery();

  // 4. Shift Availability Logic
  const isShiftActive = currentShift && currentShift.status === "OPEN";

  // Fetch current shift on branch change
  useEffect(() => {
    if (selectedBranchId) {
      dispatch(fetchCurrentShift(selectedBranchId));
    }
  }, [dispatch, selectedBranchId]);

  // Auto-focus search input if shift becomes active
  useEffect(() => {
    if (isShiftActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isShiftActive]);

  // 5. Keyboard Shortcuts (F2/F3)
  const handleKeyDown = useCallback((e) => {
    if (e.key === "F2") {
      e.preventDefault();
      setShowCustomerDialog(true);
    }

    if (e.key === "F3") {
      e.preventDefault();
      if (!isShiftActive) {
        toast({
          title: "Shift Required",
          description: "Please start a shift before processing payments.",
          variant: "destructive",
        });
        return;
      }
      if (selectedCustomer) {
        setShowPaymentDialog(true);
      } else {
        toast({
          title: "No Customer Selected",
          description: "Please select a customer first (F2).",
          variant: "destructive",
        });
      }
    }
  }, [selectedCustomer, toast, isShiftActive]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="h-full flex flex-col bg-background ml-20 md:ml-0 overflow-hidden relative">
      
      {/* --- BRANCH SWITCHING LOADER --- */}
      {shiftLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px]">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-2" />
          <p className="text-sm font-semibold text-slate-600">Validating Branch Shift...</p>
        </div>
      )}

      {/* --- SHIFT STATUS ALERT --- */}
      {!shiftLoading && !isShiftActive && (
        <div className="p-4">
          <Alert variant="destructive" className="flex items-center justify-between border-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-1" />
              <div>
                <AlertTitle className="font-bold">No Active Shift Found</AlertTitle>
                <AlertDescription>
                  Transactions are currently locked for this branch.
                </AlertDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setOpenStartShift(true)}
              className="bg-white text-destructive hover:bg-red-50 ml-auto border-destructive font-bold"
            >
              <PlayCircle className="mr-2 h-4 w-4" /> Start Shift Now
            </Button>
          </Alert>
        </div>
      )}

      {/* --- MAIN POS INTERFACE --- */}
      <div 
        className={`flex-1 flex overflow-hidden transition-all duration-500 ${
          (!isShiftActive || shiftLoading) ? "opacity-30 grayscale pointer-events-none blur-[1px]" : "opacity-100"
        }`}
      >
        <ProductSection searchInputRef={searchInputRef} />
        <CartSection setShowHeldOrdersDialog={setShowHeldOrdersDialog} />
        <CustomerPaymentSection
          setShowCustomerDialog={setShowCustomerDialog}
          setShowPaymentDialog={setShowPaymentDialog}
        />
      </div>

      {/* --- DIALOGS --- */}
      <StartShiftForm
        open={openStartShift}
        onClose={() => setOpenStartShift(false)}
        branchId={selectedBranchId}
      />

      <CustomerDialog
        showCustomerDialog={showCustomerDialog}
        setShowCustomerDialog={setShowCustomerDialog}
        customers={customers}
        loading={customersLoading}
        refetchCustomers={refetch}
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