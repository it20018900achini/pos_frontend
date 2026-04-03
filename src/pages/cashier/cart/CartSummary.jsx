"use client";

import React from "react";
import { useSelector } from "react-redux";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Receipt, Info } from "lucide-react";
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

  // Consistent LKR Formatter
  const formatLKR = (val) => 
    val.toLocaleString("en-LK", { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });

  return (
    <div className="bg-white dark:bg-slate-950 px-8 py-6 space-y-5 border-t border-slate-200 dark:border-slate-800">
      
      {/* 1. BREAKDOWN SECTION */}
      <div className="space-y-3">
        <div className="flex justify-between items-center group">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subtotal</span>
            <div className="h-px w-4 bg-slate-100 group-hover:w-8 transition-all" />
          </div>
          <span className="text-sm font-black text-slate-700 dark:text-slate-300 tabular-nums">
            Rs {formatLKR(subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center group">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tax (VAT 0%)</span>
            <Info className="w-3 h-3 text-slate-300 cursor-help" />
          </div>
          <span className="text-sm font-black text-slate-700 dark:text-slate-300 tabular-nums">
            Rs {formatLKR(tax)}
          </span>
        </div>

        {hasDiscount && (
          <div className="flex justify-between items-center animate-in fade-in slide-in-from-right-4 duration-500">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 text-[10px] font-black uppercase py-0 px-2 h-5">
              Savings Applied
            </Badge>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
              - Rs {formatLKR(discountAmount)}
            </span>
          </div>
        )}
      </div>

      <Separator className="bg-slate-100 dark:bg-slate-800" />

      {/* 2. GRAND TOTAL SECTION */}
      <div className="relative group">
        {/* Subtle Decorative Icon */}
        <Receipt className="absolute -left-1 opacity-5 text-slate-400 h-12 w-12 group-hover:rotate-12 transition-transform duration-500" />
        
        <div className="flex justify-between items-end relative z-10">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.25em]">
              Total Amount Payable
            </p>
            <p className="text-xs text-slate-400 font-medium">Inclusive of all duties</p>
          </div>
          
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1.5">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">LKR</span>
              <span className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white tabular-nums drop-shadow-sm">
                {formatLKR(total)}
              </span>
            </div>
          </div>
        </div>

        {/* 3. SAVINGS BADGE */}
        {hasDiscount && (
          <div className="flex justify-end mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <span className="text-[10px] font-black uppercase tracking-wider">Total Savings</span>
              <div className="w-px h-3 bg-indigo-400/50" />
              <span className="text-xs font-bold font-mono">Rs {formatLKR(discountAmount)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSummary;