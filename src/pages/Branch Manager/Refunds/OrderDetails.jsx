
import OrderInformation from "./OrderInformation";
import CustomerInformation from "./CustomerInformation";
import OrderItemTable from "@/pages/common/Order/OrderItemTable";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import ReturnMode from "./ReturnMode";
import { useState } from "react";
const OrderDetails = ({ selectedOrder }) => {
  
    // const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    // const [showReceiptDialog, setShowReceiptDialog] = useState(false);


  // const total = useSelector(selectTotal);

  // const dispatch = useDispatch();


  

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <OrderInformation selectedOrder={selectedOrder} />
        <CustomerInformation selectedOrder={selectedOrder} />
      </div>
      <Card className={"mb-2"}>
<div className="flex w-full px-4">
  <span className="w-full">CASH: LKR{selectedOrder?.cash?.toFixed(2)}</span>
  <span className="w-full">CREDIT: LKR{selectedOrder?.credit?.toFixed(2)}</span>
</div></Card>
       <Card>
        <CardContent className="p-4">
          <div>


            {/* <ReturnMode 
        showPaymentDialog={showPaymentDialog}
        setShowPaymentDialog={setShowPaymentDialog}
        setShowReceiptDialog={false}
        selectedOrder={selectedOrder}
        /> */}


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
