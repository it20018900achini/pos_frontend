import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../../../components/ui/use-toast";
import {
  holdOrder,
  loadHeldOrdersFromStorage,
  selectCartItems,
  selectSelectedCustomer,
  selectTotal,
  selectHeldOrders,
} from "../../../Redux Toolkit/features/cart/cartSlice";
import { Button } from "../../../components/ui/button";
import { CircleX, CreditCard, Pause, History } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

const PaymentSection = ({ setShowPaymentDialog, selectedBranchId }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Selectors
  const cartItems = useSelector(selectCartItems);
  const selectedCustomer = useSelector(selectSelectedCustomer);
  const total = useSelector(selectTotal);
  const heldOrders = useSelector(selectHeldOrders);

  // Sync with LocalStorage on component mount/branch change
  useEffect(() => {
    if (selectedBranchId) {
      dispatch(loadHeldOrdersFromStorage({ selectedBranchId }));
    }
  }, [selectedBranchId, dispatch]);

  const handlePayment = useCallback(() => {
    if (cartItems.length === 0) {
      return toast({
        title: "Empty Cart",
        description: "Please add items to cart before proceeding",
        variant: "destructive",
      });
    }
    if (!selectedCustomer) {
      return toast({
        title: "Customer Required",
        description: "Please select a customer for this transaction",
        variant: "destructive",
      });
    }
    setShowPaymentDialog(true);
  }, [cartItems, selectedCustomer, toast, setShowPaymentDialog]);

  const handleHoldOrder = useCallback(() => {
    if (cartItems.length === 0) return;

    dispatch(holdOrder({ selectedBranchId, total }));
    
    toast({ 
      title: "Order Held", 
      description: `Order saved to branch ${selectedBranchId} storage.` 
    });
  }, [cartItems, dispatch, toast, selectedBranchId, total]);

  return (
    <div className="flex-1 p-4 flex flex-col justify-end bg-background border-t">
      <div className="space-y-4">
        {/* Held Orders Quick Info */}
        {heldOrders.length > 0 && (
          <div className="flex items-center justify-between px-2 py-1 bg-muted/50 rounded-lg">
            <span className="text-xs flex items-center text-muted-foreground">
              <History className="w-3 h-3 mr-1" /> Held Orders
            </span>
            <Badge variant="secondary" className="text-[10px]">
              {heldOrders.length} Pending
            </Badge>
          </div>
        )}

        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-1">
            LKR {total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            Total Amount Due
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button
            size="lg"
            className="w-full h-14 text-lg font-bold shadow-lg transition-all active:scale-95"
            onClick={handlePayment}
            disabled={cartItems.length === 0}
          >
            {selectedCustomer ? (
              <CreditCard className="w-5 h-5 mr-2 text-emerald-400" />
            ) : (
              <CircleX className="w-5 h-5 mr-2 text-rose-400" />
            )}
            Pay Now
          </Button>

          <Button
            variant="outline"
            className="w-full h-12 border-dashed border-2 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950"
            onClick={handleHoldOrder}
            disabled={cartItems.length === 0}
          >
           - {selectedBranchId}-
            <Pause className="w-4 h-4 mr-2" />
            Hold Transaction
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;