import React from 'react'
import { useSelector } from 'react-redux';
import { selectSelectedCustomer } from '../../../Redux Toolkit/features/cart/cartSlice';
import { User } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

const CustomerSection = ({setShowCustomerDialog}) => {
    const selectedCustomer = useSelector(selectSelectedCustomer);
  return (
         <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Customer
        </h2>
        {selectedCustomer ? (
          <Card className="border-indigo-200 bg-indigo-50 dark:bg-indigo-950 dark:border-indigo-800">
            <CardContent className="p-3">
              <h3 className="font-medium text-indigo-800 dark:text-indigo-200">
                {selectedCustomer.fullName}
              </h3>
              <p className="text-sm text-indigo-600 dark:text-indigo-300">
                {selectedCustomer.phone}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => setShowCustomerDialog(true)}
              >
                Change Customer
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Button
            variant="outline"
            className="w-full overflow-hidden " 
            onClick={() => setShowCustomerDialog(true)}
          >
            <User className="w-4 h-4 mr-2" />
            Select Customer
          </Button>
        )}
      </div>
  )
}

export default CustomerSection