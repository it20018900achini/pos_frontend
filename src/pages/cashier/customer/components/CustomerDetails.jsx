// import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarIcon, PlusIcon, Loader2, UserIcon, ArrowBigLeft } from 'lucide-react';
// import PaymentsDashboard from './customerPayments/PaymentsDashboard';
// import { PaymentTablePagination } from './customerPayments/PaymentTablePagination';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCustomers } from '../../../../Redux Toolkit/features/customer/customerThunks';
import RefundHistory from './RefundHistory';
import PurchaseHistory from './PurchaseHistory';
import { toast } from 'sonner';
import CustomerPaymentsPage from './customerPayments/components/CustomerPaymentsPage';
import CustomerOrderHistory from '../orders/CustomerOrderHistory';
import CustomerOrdersPage from '../orders/CustomerOrdersPage';
import CustomerSummary from './customerPayments/components/CustomerSummary';
import CustomerRefundsPage from '../refunds/CustomerRefundsPage';

const CustomerDetails = ({ customer, onAddPoints, loading = false }) => {
  const [tab,setTab]=useState(0)
  const dispatch = useDispatch();

  const { customerOrders, loading: ordersLoading, error: orderError } = useSelector((state) => state.order);
  const { customerRefunds, loadingR, error: refundError } = useSelector((state) => state.refund);

  // Handle errors
  useEffect(() => {
    if (orderError) toast({ title: "Error", description: orderError, variant: "destructive" });
    if (refundError) toast({ title: "Error", description: refundError, variant: "destructive" });
  }, [ orderError, refundError, ]);

  // Load customers
  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);



  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
        <UserIcon size={48} strokeWidth={1} />
        <p className="mt-4">Select a customer to view details</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
        <Loader2 className="animate-spin h-8 w-8 mb-4" />
        <p>Loading customer details...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="md:flex justify-between items-start mb-6">
        <div className='md:flex'>
          <div>
            
          <h2 className="text-2xl font-bold">{customer.fullName || 'Unknown Customer'}</h2>
          <p className="text-muted-foreground">{customer.phone || 'N/A'}</p>
          <p className="text-muted-foreground">{customer.email || 'N/A'}</p>
          
          </div>
        {/* <Button varient="secondary" size="sm" onClick={onAddPoints} className="bg-orange-500  hover:bg-orange-600 flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Points
        </Button> */}
        </div>
        
        <div className=' md:flex  gap-2'>
         {tab!==0&&<Button  onClick={()=>{setTab(0)}}  variant="secondary"><ArrowBigLeft/></Button>} 
        <Button onClick={()=>{setTab(1)}}  variant={tab==1?"secondary":"default"} className="flex items-center gap-2 border">
          Orders
        </Button>
        <Button onClick={()=>{setTab(2)}} variant={tab==2?"secondary":"default"}  className="flex items-center gap-2 border">
          Refunds
        </Button>
        <Button  onClick={()=>{setTab(3)}}  variant={tab==3?"secondary":"default"}  className="flex items-center gap-2 border">
          Customer Payments
        </Button>
        </div>
      </div>
      
      <div>



        {tab==0 &&<>
         <div className="w-full">
        <CustomerSummary customerId={customer?.id}/>
      </div>


        </>}

     



</div>


 {customer && (
            tab==1 ? (
              <>
              <CustomerOrdersPage customerId={customer?.id}/>
              {/* <CustomerOrdersPage/> */}
              {/* {JSON.stringify(customer)} */}
                {/* <CustomerOrderHistory customerId={customer?.id}/> */}
                {/* <PurchaseHistory orders={customerOrders} loading={ordersLoading} /> */}
              </>
            ) : tab==2?
                          <CustomerRefundsPage customerId={customer?.id}/>
:
              
              tab==3?
              <CustomerPaymentsPage customer={customer}/>
              :""
            
          )}

    </div>
  );
};

export default CustomerDetails; 