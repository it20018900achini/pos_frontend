"use client";

import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";

import { setSelectedCustomer } from "@/Redux Toolkit/features/cart/cartSlice";
import { useGetAllCustomersQuery } from "@/Redux Toolkit/features/customer/customerApi";
import CustomerForm from "./CustomerForm";

const CustomerDialog = ({ showCustomerDialog, setShowCustomerDialog }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  // ✅ RTK Query
  const { data: customers = [], isLoading, isError, error, refetch } = useGetAllCustomersQuery();

  if (isError) {
    toast({
      title: "Error",
      description: error?.data?.message || "Failed to fetch customers",
      variant: "destructive",
    });
  }

  // Safe filtering
  const filteredCustomers = useMemo(() =>
    customers.filter((customer) =>
      (customer.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone || "").includes(searchTerm)
    ),
    [customers, searchTerm]
  );

  const handleCustomerSelect = (customer) => {
    if (!customer) {
      toast.error("Customer not found");
      return;
    }
    dispatch(setSelectedCustomer(customer));
    setShowCustomerDialog(false);
  };

  return (
    <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
      <DialogContent className="sm:max-w-[80%] max-h-[99vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Customer</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="mb-4">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Customer Table */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p>Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-2">
              <p className="text-gray-500">
                {searchTerm ? "No customers found matching your search." : "No customers available."}
              </p>
              <Button onClick={() => setShowCustomerForm(true)}>Add New Customer</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleCustomerSelect(customer)}
                        aria-label={`Select ${customer.fullName}`}
                        className="mr-2"
                      >
                        Select
                      </Button>
                      {customer.fullName || "Unknown Name"}
                    </TableCell>
                    <TableCell>{customer.phone || "N/A"}</TableCell>
                    <TableCell>{customer.email || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Nested CustomerForm */}
        {showCustomerForm && (
          <CustomerForm
            showCustomerForm={showCustomerForm}
            setShowCustomerForm={setShowCustomerForm}
            onCustomerCreated={refetch} // refresh list after creation
          />
        )}

        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => setShowCustomerDialog(false)}>Cancel</Button>
          <Button onClick={() => setShowCustomerForm(true)}>Add New Customer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;
