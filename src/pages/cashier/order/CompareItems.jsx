
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import OrderInformation from "./OrderDetails/OrderInformation";
import { format } from "date-fns";
import { Timer } from "lucide-react";

export default function CompareItems({ data }) {
  const orderItems = data[0].order.items;
  const items = data[0].items;

  return (
    <div className="space-y-4">

      <div className="grid grid-cols-2 gap-4 mb-4">
        
  <Card className={`bg-green-600 text-green-50`}>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Order Information</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-end">
                <span className="font-semibold">#{data?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Date:{data?.order?.createdAt}</span>
                <span>{(data?.createdAt)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-semibold">Payment Method:</span>
                <span>{(data?.paymentType)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-semibold">
                  LKR {data?.totalAmount?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
<div>
    
       <Card className={'border-red-600 p-0'}>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Customer Information</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span>
                  {data?.customer?.fullName || "Walk-in Customer"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span>{data?.customer?.phone || "N/A"}</span>
              </div>
                 <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{data?.customer?.email || "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative mt-1 bg-red-500 text-white px-2">
            #R ID {data[0]?.id}<br/>
            LKR {data[0]?.totalAmount.toFixed(2)}<br/>

<div className="absolute bottom-1 right-2 flex gap-1 text-sm items-center justify-end ">
        <Timer className="w-3 h-3"/> {format(new Date(data[0]?.createdAt), "yyyy-MM-dd hh:mm a")  }

    </div>           
        </Card>
</div>
      </div>
      {orderItems.map((orderItem) => {
        const matched = items.find(
          (item) => item.productId === orderItem.productId
        );

        // Calculate match score
        let score = 0; // 0 = missing, 0.5 = mismatch, 1 = perfect match
        if (!matched) score = 0;
        else if (
          orderItem.quantity !== matched.quantity ||
          orderItem.price !== matched.price
        )
          score = 1;
        else score = 0;

        // Map score to color
        const getColor = (score) => {
          if (score === 0) return "bg-red-400 text-white";
          if (score === 0.5) return "bg-yellow-300 text-black";
          return "bg-red-500 text-white";
        };

        const color = getColor(score);

        return (
          <Card key={orderItem.id} className={` shadow-md`}>
  <CardHeader className="flex items-center space-x-4">
    <img
      src={orderItem.product.image}
      alt={orderItem.product.name}
      className="w-16 h-16 object-cover rounded"
    />
    <div>        
    <CardTitle>{orderItem.product.name}</CardTitle>
     <div className="">
      <div>Ordered Price: LKR {orderItem?.product?.sellingPrice.toFixed(2)}</div>
    </div>
      {matched?.quantity>0?<div className={`px-2 ${matched?.quantity>0?color:""}`}>
        
        Refunded {matched?.quantity ? matched?.quantity : 0} from {orderItem.quantity}
      </div>:"Quantity: "+orderItem.quantity}
    </div>
  </CardHeader>
  {/* <CardContent className="flex flex-col md:flex-row md:justify-between md:items-center">
   
  </CardContent> */}
</Card>
        );
      })}
    </div>
  );
}
