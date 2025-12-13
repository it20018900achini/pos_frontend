"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  CustomerSearch,
  CustomerList,
  CustomerDetails,
  AddPointsDialog,
} from "./components";
import CustomerForm from "./CustomerForm";
import POSHeader from "../components/POSHeader";
import { filterCustomers, validatePoints, calculateCustomerStats } from "./utils/customerUtils";
import { useGetAllCustomersQuery } from "@/Redux Toolkit/features/customer/customerApi";

const CustomerLookupPage = () => {
  const { toast } = useToast();

  // RTK Query to fetch all customers
  const {
    data: customers = [],
    isLoading,
    isError,
    error,
    refetch, // can manually trigger refetch if needed
  } = useGetAllCustomersQuery();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddPointsDialog, setShowAddPointsDialog] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(0);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  if (isError) {
    toast({
      title: "Error",
      description: error?.data?.message || "Failed to fetch customers",
      variant: "destructive",
    });
  }

  const filteredCustomers = filterCustomers(customers, searchTerm);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleAddPoints = () => {
    const error = validatePoints(pointsToAdd);
    if (error)
      return toast({
        title: "Invalid Points",
        description: error,
        variant: "destructive",
      });

    toast({
      title: "Points Added",
      description: `${pointsToAdd} points added to ${selectedCustomer.fullName}'s account`,
    });

    setShowAddPointsDialog(false);
    setPointsToAdd(0);
  };

  const customerStats = selectedCustomer
    ? calculateCustomerStats(selectedCustomer.orders || [])
    : null;

  const displayCustomer = selectedCustomer
    ? { ...selectedCustomer, ...customerStats }
    : null;

  return (
    <div className="h-full flex flex-col">
      <POSHeader />
      <div className="p-4 bg-card border-b">
        <h1 className="text-2xl font-bold">Customer Management</h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Search + Customer List */}
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
            loading={isLoading}
          />
        </div>

        {/* Right Column: Customer Details */}
        <div className="w-2/3 flex flex-col overflow-y-auto">
          {displayCustomer ? (
            <CustomerDetails customer={displayCustomer} customerId={displayCustomer?.id} />
          ) : (
            <p className="text-muted-foreground p-4">Select a customer to see details</p>
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
        branchId={null} // replace with selected branch ID if needed
        onCustomerCreated={refetch} // automatically refresh customer list
      />
    </div>
  );
};

export default CustomerLookupPage;
