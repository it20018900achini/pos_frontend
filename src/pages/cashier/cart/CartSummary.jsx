"use client";

import React from "react";
import { useSelector } from "react-redux";
import { Separator } from "../../../components/ui/separator";
import {
  selectDiscountAmount,
  selectSubtotal,
  selectTax,
  selectTotal,
} from "../../../Redux Toolkit/features/cart/cartSlice";

const CartSummary = () => {
  const subtotal = useSelector(selectSubtotal) || 0;
  const tax = useSelector(selectTax) || 0;
  const discountAmount = useSelector(selectDiscountAmount) || 0;
  const total = useSelector(selectTotal) || 0;

  const hasDiscount = discountAmount > 0;

  return (
    <div className="border-t bg-neutral-50/50 dark:bg-[#09090b] p-6 space-y-4">
      <div className="space-y-2.5">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-neutral-500 dark:text-neutral-400 tracking-tight">
            Subtotal
          </span>
          <span className="font-bold text-neutral-800 dark:text-neutral-200">
            LKR {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-neutral-500 dark:text-neutral-400 tracking-tight">
            Tax (GST 0%)
          </span>
          <span className="font-bold text-neutral-800 dark:text-neutral-200">
            LKR {tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Discount Section */}
        {hasDiscount && (
          <div className="flex justify-between items-center text-sm animate-in fade-in slide-in-from-bottom-1 duration-300">
            <span className="font-medium text-emerald-600 dark:text-emerald-500 tracking-tight flex items-center gap-1.5">
              Promotion Applied
            </span>
            <span className="font-black text-emerald-600 dark:text-emerald-500">
              - LKR {discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>

      <Separator className="bg-neutral-200 dark:bg-white/5" />

      {/* Grand Total */}
      <div className="space-y-1">
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
            Total Payable
          </span>
          <div className="text-right">
            <span className="text-2xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400">
              LKR {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Pro Tip: Visual "Savings" Badge */}
        {hasDiscount && (
          <div className="flex justify-end">
            <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              You saved LKR {discountAmount.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSummary;