import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";

import POSHeader from "../components/POSHeader";
import CustomerForm from "./CustomerForm";
import {
  CustomerSearch,
  CustomerList,
  CustomerDetails,
  PurchaseHistory,
  AddPointsDialog,
  RefundHistory,
} from "./components";

import { Button } from "../../../components/ui/button";

import {
  getAllCustomers,
} from "@/Redux Toolkit/features/customer/customerThunks";

import {
  getOrdersByCustomer,
  clearCustomerOrders,
} from "@/Redux Toolkit/features/order/orderThunks";

import {
  getRefundsByCustomer,
  clearCustomerRefunds,
} from "@/Redux Toolkit/features/refund/refundThunks";

import {
  filterCustomers,
  validatePoints,
  calculateCustomerStats,
} from "./utils/customerUtils";

const CustomerLookupPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { customers, loading: customerLoading, error: customerError } = useSelector((state) => state.customer);
  const { customerOrders, loading: ordersLoading, error: orderError } = useSelector((state) => state.order);
  const { customerRefunds, loading: refundsLoading, error: refundError } = useSelector((state) => state.refund);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddPointsDialog, setShowAddPointsDialog] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(0);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [activeTab, setActiveTab] = useState("history"); // history | refunds

  // Load customer list on mount
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

    if (customer?.id) {
      // Load orders and refunds only when a customer is selected
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

  const customerStats = selectedCustomer ? calculateCustomerStats(customerOrders) : null;
  const displayCustomer = selectedCustomer ? { ...selectedCustomer, ...customerStats } : null;

  return (
    <div className="h-full flex flex-col">
      <POSHeader />

      <div className="p-4 bg-card border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        {selectedCustomer && (
          <div className="flex gap-2">
            <Button onClick={() => setShowAddPointsDialog(true)}>Add Points</Button>
            <Button variant="secondary" onClick={() => setShowCustomerForm(true)}>Edit</Button>
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Search + List */}
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

        {/* Right Column: Details + Tabs */}
        <div className="w-2/3 flex flex-col overflow-y-auto p-4 space-y-4">
          <CustomerDetails
            customer={displayCustomer}
            loading={ordersLoading || refundsLoading}
          />

          {selectedCustomer && (
            <div className="flex flex-col space-y-4">
              {/* Tabs */}
              <div className="flex gap-4 border-b pb-2">
                <button
                  className={`px-3 py-1 font-medium ${activeTab === "history" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                  onClick={() => setActiveTab("history")}
                >
                  Purchase History
                </button>
                <button
                  className={`px-3 py-1 font-medium ${activeTab === "refunds" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                  onClick={() => setActiveTab("refunds")}
                >
                  Refund History
                </button>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === "history" && selectedCustomer?.id && (
                  <PurchaseHistory orders={customerOrders} loading={ordersLoading} />
                )}
                {activeTab === "refunds" && selectedCustomer?.id && (
                  <RefundHistory refunds={customerRefunds} loading={refundsLoading} />
                )}
              </div>
            </div>
          )}
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
