
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
    // const [showReceiptDialog, setShowReceiptDialog] = useState(false);


  // const total = useSelector(selectTotal);

  // const dispatch = useDispatch();


  

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


"":<span className="text-red-500">All Refunded</span>}

          


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
