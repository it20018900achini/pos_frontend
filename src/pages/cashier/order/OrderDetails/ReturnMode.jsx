import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectNote,
  selectPaymentMethod,
  selectSelectedCustomer,
  selectTotal,
  setCurrentOrder,
  setPaymentMethod,
} from "@/Redux Toolkit/features/cart/cartSlice";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch } from "react-redux";
import { createRefund } from "@/Redux Toolkit/features/refund/refundThunks";
import { Input } from "@/components/ui/input";

const ReturnMode = ({
  showPaymentDialog,
  setShowPaymentDialog,
  setShowReceiptDialog,
}) => {
  const total = useSelector(selectTotal);
  const [value, setValue] = useState(total);

  const paymentMethod = useSelector(selectPaymentMethod);
  const { toast } = useToast();
  const cart = useSelector(selectCartItems);
  const branch = useSelector((state) => state.branch);
  const { userProfile } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const selectedCustomer = useSelector(selectSelectedCustomer);

  const note = useSelector(selectNote);
  const [loading, setLoading] = React.useState(false);

  const processPayment = async () => {
    


    try {
      setLoading(true);

      // Prepare order data according to OrderDTO structure
      const orderData = {
    "cash": "130.00",
    "credit": "0.00",
    "totalAmount": 130,
    "cashierId": 13,
    "orderId": 62,
    "customer": {
        "id": 2,
        "fullName": "Nuwan",
        "email": "",
        "phone": "704238939",
        "createdAt": "2025-10-29T15:10:55.658543",
        "updatedAt": "2025-10-29T15:10:55.658543"
    },
    "items": [
        {
            "productId": 52,
            "quantity": 1,
            "total": null
        }
    ],
    "paymentType": "CASH",
    "note": ""
};

      console.log("Creating order:", orderData);

      // Create order
      const createdOrder = await dispatch(createRefund(orderData)).unwrap();
      dispatch(setCurrentOrder(createdOrder));

      setShowPaymentDialog(false);

      setShowReceiptDialog(true);

      toast({
        title: "Order Created Successfully",
        description: `Order #${createdOrder.id} created and payment processed`,
      });

      setLoading(false);
    } catch (error) {
      console.error("Failed to create order:", error);
      toast({
        title: "Order Creation Failed",
        description: error || "Failed to create order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentMethod = (method) => dispatch(setPaymentMethod(method));
  function handleChange(e) {
    setValue(e.target.value);
  }
  useEffect(() => {
    setValue(total)
  }, [total])
  
//   git config --global user.name "it20018900achini"
// git config --global user.email "achininirupama98@gmail.com"


  return (
    <Dialog
      open={showPaymentDialog}
      onOpenChange={(showPaymentDialog) => {
        setShowPaymentDialog(showPaymentDialog);
        setValue(total);
        ()=>dispatch(setPaymentMethod("CASH"))
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment1111</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              LKR {total.toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">Amount to be paid</p>
          </div>

          <div className="space-y-2">
            {[
    { key: 'CASH', label: '💵 Cash / Credit', display: 'cash' },
    // { key: 'CARD', label: '💳 Card', display: 'card' },
  ].map((method) => (
              <div key={method.key}>
                {method.key == "CASH" ? (
                  <div className="">
                    <div className="mb-2">
                      CASH AMOUNT
                    <div className="w-full flex items-center gap-2 ">
                      <Input
                        type={`text`}
                        className={`border-green-500`}
                        value={value}
                        onChange={handleChange}
                      />
                      <span className={`text-center border px-2 rounded-md ${
                        (total - value) <= 0 ?  'bg-green-200 text-green-800 border-green-400': 'bg-red-200 text-red-800 border-red-400'
                      }`}>
                        <span className="text-xs">CREDIT</span>
                        <br />
                        {(total - value).toFixed(2)}
                      </span>
                    </div>
                    </div>
                    <Button
                      key={method.key}
                      variant={
                        paymentMethod === method.key ? "default" : "outline"
                      }
                      className="w-full justify-start"
                      onClick={() => handlePaymentMethod(method.key)}
                    >
                      {method.label}
                    </Button>
                  </div>
                ) : (
                  <Button
                    key={method.key}
                    variant={
                      paymentMethod === method.key ? "default" : "outline"
                    }
                    className="w-full justify-start"
                    onClick={() => handlePaymentMethod(method.key)}
                  >
                    {method.label}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
            Cancel
          </Button>
          {loading ? (
            <Button disabled>Processing...</Button>
          ) : (
            <Button onClick={processPayment}>Complete Payment</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnMode;
