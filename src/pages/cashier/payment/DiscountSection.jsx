"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectDiscount, setDiscount } from '../../../Redux Toolkit/features/cart/cartSlice';
import { Tag, Percent, Banknote } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DiscountSection = () => {
  const dispatch = useDispatch();
  const discount = useSelector(selectDiscount);

  const updateDiscount = (updates) => {
    dispatch(setDiscount({ ...discount, ...updates }));
  };

  const handleValueChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    updateDiscount({ value: val });
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center">
          <Tag className="w-3 h-3 mr-2 text-indigo-500" />
          Promo & Adjustments
        </h4>
        {discount.value > 0 && (
          <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">
            Applied
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Segmented Toggle Control (Apple Style) */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <button
            onClick={() => updateDiscount({ type: "percentage" })}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
              discount.type === "percentage" 
                ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white" 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Percent className="w-3 h-3" />
            Percentage
          </button>
          <button
            onClick={() => updateDiscount({ type: "fixed" })}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
              discount.type === "fixed" 
                ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white" 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Banknote className="w-3 h-3" />
            Fixed LKR
          </button>
        </div>

        {/* Input Wrapper */}
        <div className="relative group">
          <Input
            type="number"
            placeholder="0.00"
            value={discount.value || ""}
            onChange={handleValueChange}
            className="h-12 pl-4 pr-12 rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 focus-visible:ring-indigo-500 font-black text-slate-900 dark:text-white placeholder:text-slate-300"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className="text-xs font-black text-slate-400">
              {discount.type === "percentage" ? "%" : "LKR"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountSection;