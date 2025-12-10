import React from "react";
import { Separator } from "../../../components/ui/separator";
import { useSelector } from "react-redux";
import {
  selectDiscountAmount,
  selectSubtotal,
  selectTax,
  selectTotal,
} from "../../../Redux Toolkit/features/cart/cartSlice";

const CartSummary = () => {
  const subtotal = useSelector(selectSubtotal);
  const tax = useSelector(selectTax);
  const discountAmount = useSelector(selectDiscountAmount);
  const total = useSelector(selectTotal);

  return (
    <div className="border-t bg-muted p-4">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>LKR {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax :</span>
          <span>LKR {tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount:</span>
          <span className="text-red-600">- LKR {discountAmount.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-indigo-600">LKR {total?.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
