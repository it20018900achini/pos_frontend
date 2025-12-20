
// import OrderInformation from "./OrderInformation";
// import CustomerInformation from "./CustomerInformation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReturnMode from "./ReturnMode";
import { useState } from "react";
// import OrderItemTable from "@/common/Order/OrderItemTable";

import { getFlattenedRefundSummaryWithTotals } from "./getFlattenedRefundSummaryWithTotals";
import OrderItemTable from "../../common/Order/OrderItemTable";
const OrderDetails = ({ selectedOrder }) => {
  const totals=getFlattenedRefundSummaryWithTotals(selectedOrder)?.totals
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    // const [showReceiptDialog, setShowReceiptDialog] = useState(false);


  // const total = useSelector(selectTotal);

  // const dispatch = useDispatch();

  const handlePayment = () => {
    // if (cartItems.length === 0) {
    //   toast({
    //     title: "Empty Cart",
    //     description: "Please add items to cart before proceeding to payment",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    // Check if customer is selected
    // if (!selectedCustomer) {
    //   toast({
    //     title: "Customer Required",
    //     description: "Please select a customer before proceeding to payment",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    setShowPaymentDialog(true);
  };

  

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* <OrderInformation selectedOrder={selectedOrder} />
        <CustomerInformation selectedOrder={selectedOrder} /> */}
      </div>
      <Card className={"mb-2"}>
<div className="flex w-full px-4">
  <span className="w-full">CASH: <br/>LKR{selectedOrder?.cash?.toFixed(2)}</span>
  <span className="w-full">CREDIT: <br/>LKR{selectedOrder?.credit?.toFixed(2)}</span>
</div></Card>
       <Card>
        <CardContent className="p-4">
          <div className="flex justify-end mb-1">

{totals?.totalAvailableQuantity>0?


<Button
            className={`py-3 text-lg font-semibold `}
            size={`sm`}
            onClick={handlePayment}
            // disabled={cartItems.length === 0}
          >
            
            
          
            Refund
          </Button>:<span className="text-red-500">All Refunded</span>}

          

            <ReturnMode 
        showPaymentDialog={showPaymentDialog}
        setShowPaymentDialog={setShowPaymentDialog}
        setShowReceiptDialog={false}
        selectedOrder={selectedOrder}
        />


          </div>
          {/* <Separator/> */}<hr/>
          <h3 className="font-semibold mb-2">Order Items</h3>
      {/* <pre>{JSON.stringify(selectedOrder, null, 2)}</pre>     */}
          <OrderItemTable selectedOrder={selectedOrder} />
        </CardContent>



      </Card>

     
    </div>
  );
};

export default OrderDetails;
