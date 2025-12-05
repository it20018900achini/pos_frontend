import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, getPaymentModeLabel,  } from './data1'
import { Badge } from '@/components/ui/badge'

const OrderInformation = ({selectedOrder}) => {
  return (
     <Card className={`bg-red-500 text-green-50`}>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Order Information</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-end">
                <span className="font-semibold">#{selectedOrder?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Date:</span>
                <span>{formatDate(selectedOrder.createdAt)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-semibold">Payment Method:</span>
                <span>{getPaymentModeLabel(selectedOrder.paymentType)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-semibold">
                  LKR {selectedOrder.totalAmount?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
  )
}

export default OrderInformation