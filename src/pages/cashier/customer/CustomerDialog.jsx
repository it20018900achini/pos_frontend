import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDispatch } from 'react-redux';
import { setSelectedCustomer } from '../../../Redux Toolkit/features/cart/cartSlice';
import CustomerForm from './CustomerForm';

const CustomerDialog = ({ showCustomerDialog, setShowCustomerDialog, customers, loading }) => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const filteredCustomers = useMemo(
    () =>
      customers?.filter(customer =>
        customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
      ),
    [customers, searchTerm]
  );

  const handleCustomerSelect = (customer) => {
    dispatch(setSelectedCustomer(customer));
    setShowCustomerDialog(false);
  };

  return (
    <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
      <DialogContent className="sm:max-w-[80%] max-h-[99vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Customer</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">Loading customers...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-2">
              <p className="text-gray-500">
                {searchTerm ? 'No customers found matching your search.' : 'No customers available.'}
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

        <CustomerForm
          showCustomerForm={showCustomerForm}
          setShowCustomerForm={setShowCustomerForm}
        />

        <DialogFooter className="flex justify-between">
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
