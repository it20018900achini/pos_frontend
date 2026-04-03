"use client";

import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  ShoppingCart, 
  Pause, 
  Trash2, 
  Minus, 
  Plus, 
  Info,
  PackageSearch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

import {
  clearCart,
  removeFromCart,
  selectCartItems,
  selectHeldOrders,
  updateCartItemQuantity,
} from "../../../Redux Toolkit/features/cart/cartSlice";

const CartSection = ({ setShowHeldOrdersDialog }) => {
  const cartItems = useSelector(selectCartItems);
  const heldOrders = useSelector(selectHeldOrders);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleUpdateQty = useCallback((id, newQuantity) => {
    dispatch(updateCartItemQuantity({ id, quantity: Math.max(0, newQuantity) }));
  }, [dispatch]);

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    dispatch(clearCart());
    toast({ title: "Cart Cleared", description: "All items removed from active session." });
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-950">
      
      {/* 1. HEADER: ACTION BAR */}
      <div className="px-6 py-4 border-b bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Active Cart</h2>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">
              {cartItems.length} Products Registered
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg border-slate-200 dark:border-slate-800 text-xs font-semibold gap-1.5"
            onClick={() => setShowHeldOrdersDialog(true)}
          >
            <Pause className="w-3.5 h-3.5 text-amber-500" />
            Held ({heldOrders.length})
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg"
            onClick={handleClearCart}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Wipe
          </Button>
        </div>
      </div>

      {/* 2. TRIPLE COLUMN HEADER */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10">
        <div className="col-span-6 flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">01. Product Information</span>
          <Info className="w-3 h-3 text-slate-300" />
        </div>
        <div className="col-span-3 text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">02. Quantity</span>
        </div>
        <div className="col-span-3 text-right">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">03. Line Total</span>
        </div>
      </div>

      {/* 3. SCROLLABLE DATA ROWS */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/20">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <PackageSearch className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Ready for scanning</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Add products from the catalog to begin the checkout process.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="group grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-white dark:hover:bg-slate-900 transition-all duration-150"
              >
                {/* Product Info (Col 1) */}
                <div className="col-span-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white border border-slate-100 dark:border-slate-800 p-1 shadow-xs flex-shrink-0">
                    <div className="h-full w-full bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center font-bold text-slate-400 text-xs">
                      {item.image ? <img src={item.image} alt="" className="object-contain" /> : item.name.charAt(0)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate uppercase tracking-tight leading-none mb-1.5">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[9px] font-mono border-slate-200 text-slate-500 py-0 h-4">
                        Rs {Number(item.price).toLocaleString()}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-medium tracking-tight">ID: {item.id.toString().slice(-5)}</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Stepper (Col 2) */}
                <div className="col-span-3 flex justify-center">
                  <div className="flex items-center p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg hover:bg-white dark:hover:bg-slate-700 shadow-xs"
                      onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-10 text-center text-sm font-black text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg hover:bg-white dark:hover:bg-slate-700 shadow-xs"
                      onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Line Total (Col 3) */}
                <div className="col-span-3 flex items-center justify-end gap-5">
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">Subtotal</p>
                    <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                      Rs {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-opacity opacity-0 group-hover:opacity-100"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. FOOTER SHADOW OVERLAY (Optional placeholder for CartSummary) */}
      <div className="h-2 bg-linear-to-t from-slate-100/50 to-transparent pointer-events-none" />
    </div>
  );
};

export default CartSection;