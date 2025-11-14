import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingBagIcon, CalendarIcon, DollarSignIcon } from 'lucide-react';
import { formatDate, getStatusColor } from '../../refund/data';

const RefundHistory = ({ refunds, loading }) => {
  // Normalize refunds to always be an array
  const refundList = Array.isArray(refunds) ? refunds : refunds?.refunds || [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
        <Loader2 className="animate-spin h-8 w-8 mb-4" />
        <p>Loading refund history...</p>
      </div>
    );
  }

  if (refundList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
        <ShoppingBagIcon size={48} strokeWidth={1} />
        <p className="mt-4">No refund history found</p>
        <p className="text-sm">This customer hasn't made any refunds yet</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Refund History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {refundList.map((refund) => (
            <div key={refund.id} className="rounded-lg p-4 border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">Refund No #{refund.id}</h3>
                  <span className="text-sm">Order No #{refund?.refundId}</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDate(refund.createdAt)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSignIcon className="h-4 w-4" />
                    <span className="font-bold">LKR {refund.totalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  {refund.status && (
                    <Badge className={getStatusColor(refund.status)}>
                      {refund.status}
                    </Badge>
                  )}
                </div>
              </div>

              {refund.paymentMethod && (
                <div className="text-sm text-muted-foreground mb-2">
                  Payment: {refund.paymentMethod}
                </div>
              )}

              {refund.items && refund.items.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-1">Items:</h4>
                  <div className="space-y-1">
                    {refund.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.product?.name || item.productName || 'Unknown Product'}</span>
                        <span className="text-muted-foreground">
                          {item.quantity || 1} × LKR {(item.price || 0).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default RefundHistory;
