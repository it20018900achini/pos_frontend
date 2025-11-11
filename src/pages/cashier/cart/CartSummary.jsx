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

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(amount);

  return (
    <div className="border-t bg-muted p-4 sticky bottom-0 z-10">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {tax > 0 && (
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>{formatPrice(tax)}</span>
          </div>
        )}
        {discountAmount > 0 && (
          <div className="flex justify-between">
            <span>Discount:</span>
            <span className="text-red-600">- {formatPrice(discountAmount)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-green-600">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CartSummary);
