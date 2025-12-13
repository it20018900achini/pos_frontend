import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../../../components/ui/use-toast";
import {
  holdOrder,
  selectCartItems,
  selectSelectedCustomer,
  selectTotal,
} from "../../../Redux Toolkit/features/cart/cartSlice";
import { Button } from "../../../components/ui/button";
import { CircleX, CreditCard, Pause } from "lucide-react";

const PaymentSection = ({ setShowPaymentDialog }) => {
  const cartItems = useSelector(selectCartItems);
  const selectedCustomer = useSelector(selectSelectedCustomer);
  const total = useSelector(selectTotal);

  const { toast } = useToast();
  const dispatch = useDispatch();

  const handlePayment = useCallback(() => {
    if (cartItems.length === 0) {
      return toast({
        title: "Empty Cart",
        description: "Please add items to cart before proceeding to payment",
        variant: "destructive",
      });
    }
    if (!selectedCustomer) {
      return toast({
        title: "Customer Required",
        description: "Please select a customer before proceeding to payment",
        variant: "destructive",
      });
    }
    setShowPaymentDialog(true);
  }, [cartItems, selectedCustomer, toast, setShowPaymentDialog]);

  const handleHoldOrder = useCallback(() => {
    if (cartItems.length === 0) {
      return toast({
        title: "Empty Cart",
        description: "No items in cart to hold",
        variant: "destructive",
      });
    }
    dispatch(holdOrder());
    toast({ title: "Order On Hold", description: "Order placed on hold" });
  }, [cartItems, dispatch, toast]);

  return (
    <div className="flex-1 p-4 flex flex-col justify-end">
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            LKR {total?.toFixed(2) || "0.00"}
          </div>
          <p className="text-sm text-muted-foreground">Total Amount</p>
        </div>

        <div className="space-y-2">
          <Button
            className="w-full py-3 text-lg font-semibold"
            onClick={handlePayment}
            disabled={cartItems.length === 0}
          >
            {selectedCustomer ? (
              <CreditCard className="w-5 h-5 mr-2" />
            ) : (
              <CircleX className="w-5 h-5 mr-2 text-red-500" />
            )}
            Process Payment
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleHoldOrder}
            disabled={cartItems.length === 0}
          >
            <Pause className="w-4 h-4 mr-2" />
            Hold Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
