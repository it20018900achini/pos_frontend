import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import {
  getAllCustomers,
} from "@/Redux Toolkit/features/customer/customerThunks";
import {
  getOrdersByCustomer,
} from "@/Redux Toolkit/features/order/orderThunks";
import {
  filterCustomers,
  validatePoints,
  calculateCustomerStats,
} from "./utils/customerUtils";
import {
  CustomerSearch,
  CustomerList,
  CustomerDetails,
  PurchaseHistory,
  AddPointsDialog,
} from "./components";
import { clearCustomerOrders } from "../../../Redux Toolkit/features/order/orderSlice";
import CustomerForm from "./CustomerForm";
import POSHeader from "../components/POSHeader";
import { PaymentTablePagination } from "./components/customerPayments/PaymentTablePagination";
import { Button } from "../../../components/ui/button";
import RefundHistory from "./components/RefundHistory";
import { getRefundsByCustomer } from "../../../Redux Toolkit/features/refund/refundThunks";
import { clearCustomerRefunds } from "../../../Redux Toolkit/features/refund/refundSlice";

const CustomerLookupPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { customers, loading: customerLoading, error: customerError } = useSelector((state) => state.customer);
  const { customerOrders, loading: ordersLoading, error: orderError } = useSelector((state) => state.order);
  const { customerRefunds, loadingR, error: refundError } = useSelector((state) => state.refund);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddPointsDialog, setShowAddPointsDialog] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(0);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  // Load customers
  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (customerError) toast({ title: "Error", description: customerError, variant: "destructive" });
    if (orderError) toast({ title: "Error", description: orderError, variant: "destructive" });
    if (refundError) toast({ title: "Error", description: refundError, variant: "destructive" });
  }, [customerError, orderError, refundError, toast]);

  const filteredCustomers = filterCustomers(customers, searchTerm);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    dispatch(clearCustomerOrders());
    dispatch(clearCustomerRefunds());
    if (customer.id) {
      dispatch(getOrdersByCustomer(customer.id));
      dispatch(getRefundsByCustomer(customer.id));
    }
  };

  const handleAddPoints = () => {
    const error = validatePoints(pointsToAdd);
    if (error) return toast({ title: "Invalid Points", description: error, variant: "destructive" });

    toast({
      title: "Points Added",
      description: `${pointsToAdd} points added to ${selectedCustomer.fullName || selectedCustomer.name}'s account`,
    });

    setShowAddPointsDialog(false);
    setPointsToAdd(0);
  };

  // Re-fetch orders/refunds when selected customer changes
  useEffect(() => {
    if (selectedCustomer?.id) {
      dispatch(getOrdersByCustomer(selectedCustomer.id));
      dispatch(getRefundsByCustomer(selectedCustomer.id));
    }
  }, [selectedCustomer, dispatch]);

  const customerStats = selectedCustomer ? calculateCustomerStats(customerOrders) : null;
  const displayCustomer = selectedCustomer ? { ...selectedCustomer, ...customerStats } : null;

  return (
    <div className="h-full flex flex-col">
      <POSHeader />
      <div className="p-4 bg-card border-b">
        <h1 className="text-2xl font-bold">Customer Management</h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column */}
        <div className="w-1/3 border-r flex flex-col">
          <CustomerSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddCustomer={() => setShowCustomerForm(true)}
          />
          <CustomerList
            customers={filteredCustomers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={handleSelectCustomer}
            loading={customerLoading}
          />
        </div>

        {/* Right Column */}
        <div className="w-2/3 flex flex-col overflow-y-auto">
          <CustomerDetails
            customer={displayCustomer}
            onAddPoints={() => setShowAddPointsDialog(true)}
            loading={ordersLoading}
          />


          {/* {selectedCustomer && (
            tab1 ? (
              <>
                <RefundHistory refunds={customerRefunds} loading={loadingR} />
                <PurchaseHistory orders={customerOrders} loading={ordersLoading} />
              </>
            ) : (
              <PaymentTablePagination customerId={selectedCustomer?.id} />
            )
          )} */}
        </div>
      </div>

      {/* Dialogs */}
      <AddPointsDialog
        isOpen={showAddPointsDialog}
        onClose={() => setShowAddPointsDialog(false)}
        customer={selectedCustomer}
        pointsToAdd={pointsToAdd}
        onPointsChange={setPointsToAdd}
        onAddPoints={handleAddPoints}
      />
      <CustomerForm
        showCustomerForm={showCustomerForm}
        setShowCustomerForm={setShowCustomerForm}
      />
    </div>
  );
};

export default CustomerLookupPage;
