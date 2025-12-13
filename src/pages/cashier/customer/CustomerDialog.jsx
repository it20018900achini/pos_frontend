"use client";

import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import CustomerForm from "./CustomerForm";
import { useGetAllCustomersQuery } from "@/Redux Toolkit/features/customer/customerApi";
import { useDispatch } from "react-redux";
import { setSelectedCustomer } from "@/Redux Toolkit/features/cart/cartSlice";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

const CustomerDialog = ({ showCustomerDialog, setShowCustomerDialog }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const { data: customers = [], isLoading, error } = useGetAllCustomersQuery(null, {
    skip: !showCustomerDialog,
  });

  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        (c) =>
          c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.phone?.includes(searchTerm)
      ),
    [customers, searchTerm]
  );

  const handleCustomerSelect = (customer) => {
    dispatch(setSelectedCustomer(customer));
    setShowCustomerDialog(false);
  };

  if (error) {
    toast({ title: "Error", description: "Failed to fetch customers", variant: "destructive" });
  }

  return (
    <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
      <DialogContent className="sm:max-w-[80%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Customer</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <p>Loading customers...</p>
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
                      <Button size="sm" onClick={() => handleCustomerSelect(customer)}>
                        Select
                      </Button>{" "}
                      {customer.fullName}
                    </TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <CustomerForm showCustomerForm={showCustomerForm} setShowCustomerForm={setShowCustomerForm} />

        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => setShowCustomerDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowCustomerForm(true)}>Add New Customer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;
