"use client";

import React, { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Hash } from "lucide-react";

const CartItem = ({ item, updateCartItemQuantity, removeFromCart }) => {
  const inputRef = useRef(null);

  // Pro Currency Formatter for LKR
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(price);

  const handleQtyChange = (delta) => {
    const newQty = Math.max(1, (item.quantity || 1) + delta);
    updateCartItemQuantity(item.id, newQty);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      updateCartItemQuantity(item.id, "");
      return;
    }
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      updateCartItemQuantity(item.id, Math.max(0, parsed));
    }
  };

  return (
    <div className="group grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-slate-100 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-150">
      
      {/* 1. PRODUCT INFORMATION (6/12 Columns) */}
      <div className="col-span-6 flex items-center gap-4">
        {/* Modern Image/Icon Box */}
        <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-1 shadow-xs flex-shrink-0 relative overflow-hidden">
          <div className="h-full w-full bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center font-black text-slate-400 text-xs">
            {item.image ? (
              <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
            ) : (
              item.name.charAt(0).toUpperCase()
            )}
          </div>
          {item.isNew && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white dark:border-slate-800" />
          )}
        </div>

        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate uppercase tracking-tight leading-tight mb-1">
            {item.name}
          </h4>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[9px] font-mono border-slate-200 dark:border-slate-700 text-slate-500 py-0 h-4 px-1.5">
              {formatPrice(item.price || item.sellingPrice)}
            </Badge>
            {item.sku && (
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Hash className="h-2.5 w-2.5 opacity-50" /> {item.sku}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. QUANTITY CONTROLS (3/12 Columns) */}
      <div className="col-span-3 flex justify-center">
        <div className="flex items-center p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg hover:bg-white dark:hover:bg-slate-700 shadow-xs text-slate-500"
            onClick={() => handleQtyChange(-1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="w-3.5 h-3.5" />
          </Button>
          
          <input
            ref={inputRef}
            type="number"
            value={item.quantity}
            onChange={handleChange}
            onFocus={() => inputRef.current?.select()}
            className="w-10 bg-transparent text-center text-sm font-black text-slate-900 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg hover:bg-white dark:hover:bg-slate-700 shadow-xs text-slate-500"
            onClick={() => handleQtyChange(1)}
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* 3. LINE TOTAL & DELETE (3/12 Columns) */}
      <div className="col-span-3 flex items-center justify-end gap-5">
        <div className="text-right">
          <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1 tracking-widest">Subtotal</p>
          <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
            {formatPrice((item.price || item.sellingPrice) * item.quantity)}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
          onClick={() => removeFromCart(item.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default React.memo(CartItem);