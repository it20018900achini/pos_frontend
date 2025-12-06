import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, UserIcon, ArrowBigLeft } from 'lucide-react';
import CustomerSummary from './customerPayments/components/CustomerSummary';
import CustomerOrdersPage from '../orders/CustomerOrdersPage';
import CustomerRefundsPage from '../refunds/CustomerRefundsPage';
import CustomerPaymentsPage from './customerPayments/components/CustomerPaymentsPage';

// Skeleton loader for any tab
const TabSkeleton = () => (
  <div className="space-y-4 animate-pulse p-4">
    <div className="h-6 w-1/3 bg-muted rounded" />
    <div className="h-6 w-1/4 bg-muted rounded" />
    <div className="h-40 w-full bg-muted rounded mt-2" />
    <div className="h-40 w-full bg-muted rounded mt-2" />
  </div>
);

const CustomerDetails = ({ customer, loading = false }) => {
  const [tab, setTab] = useState(0);
  const [tabLoading, setTabLoading] = useState(false);

  // Handle tab changes
  const handleTabChange = (newTab) => {
    setTabLoading(true);
    setTab(newTab);
    // simulate fetch delay for skeleton
    setTabLoading(false)
    // setTimeout(() => setTabLoading(false), 300); 
  };

  // Empty state
  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
        <UserIcon size={48} strokeWidth={1} />
        <p className="mt-4">Select a customer to view details</p>
      </div>
    );
  }

  // Loading state after selecting a customer
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
        <Loader2 className="animate-spin h-8 w-8 mb-4" />
        <p>Loading customer details...</p>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col space-y-4 h-full">
      {/* Header */}
      <div className="md:flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">{customer.fullName || 'Unknown Customer'}</h2>
          <p className="text-muted-foreground">{customer.phone || 'N/A'}</p>
          <p className="text-muted-foreground">{customer.email || 'N/A'}</p>
        </div>

        <div className="md:flex gap-2 mt-4 md:mt-0">
          {tab !== 0 && (
            <Button onClick={() => handleTabChange(0)} variant="secondary">
              <ArrowBigLeft />
            </Button>
          )}
          <Button
            onClick={() => handleTabChange(1)}
            variant={tab === 1 ? 'secondary' : 'default'}
            className="flex items-center gap-2"
          >
            Orders
          </Button>
          <Button
            onClick={() => handleTabChange(2)}
            variant={tab === 2 ? 'secondary' : 'default'}
            className="flex items-center gap-2"
          >
            Refunds
          </Button>
          <Button
            onClick={() => handleTabChange(3)}
            variant={tab === 3 ? 'secondary' : 'default'}
            className="flex items-center gap-2"
          >
            Customer Payments
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto shadow-inner p-2 rounded-md bg-card">
        {tab === 0 && (tabLoading ? <TabSkeleton /> : <CustomerSummary customerId={customer.id} />)}
        {tab === 1 && (tabLoading ? <TabSkeleton /> : <CustomerOrdersPage customerId={customer.id} />)}
        {tab === 2 && (tabLoading ? <TabSkeleton /> : <CustomerRefundsPage customerId={customer.id} />)}
        {tab === 3 && (tabLoading ? <TabSkeleton /> : <CustomerPaymentsPage customer={customer} />)}
      </div>
    </div>
  );
};

export default CustomerDetails;
