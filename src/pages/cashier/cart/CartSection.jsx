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
      <div className="px-6 py-4 border-b bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg relative mr-2">
            <ShoppingCart className="w-4 h-4 text-white" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-slate-900">
              {cartItems.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-tight gap-1.5"
            onClick={() => setShowHeldOrdersDialog(true)}
          >
            <Pause className="w-3.5 h-3.5 text-amber-500" />
            Held ({heldOrders.length})
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 h-8 text-[10px] font-bold uppercase text-red-500 hover:bg-red-100 rounded-lg"
            onClick={handleClearCart}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Wipe
          </Button>
        </div>
      </div>



      {/* 3. SCROLLABLE ITEM LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/20 dark:bg-transparent">
        {cartItems.length === 0 ? (
          <div className="h-full  flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 rotate-3">
              <PackageSearch className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Terminal Idle</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-2 max-w-[180px] uppercase leading-relaxed tracking-wider">
              Scan barcode or select items from catalog
            </p>
          </div>
        ) : (
         <div className="space-y-4 p-4">
  {cartItems.map((item) => (
    <div
      key={item.id}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* 1. TOP SECTION: Product Details */}
      <div className="p-4 flex items-center gap-4">
        {/* Image Container with Inner Shadow */}
        <div className="relative h-14 w-14 shrink-0 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-1.5 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
          {item.image ? (
            <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-black text-lg">
              {item.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight mb-1">
                {item.name}
              </h3>
              <div className="flex items-center gap-3">
                 <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">
                   Rs {Number(item.price).toLocaleString()}
                 </span>
                 <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter">
                   REF: {item.id.toString().slice(-6)}
                 </span>
              </div>
            </div>
            
            {/* Trash Icon - Visible on hover for desktop, always available for touch */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-all duration-200"
              onClick={() => dispatch(removeFromCart(item.id))}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 2. BOTTOM SECTION: Controls & Total */}
      <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        {/* Sleek Quantity Stepper */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
          >
            <Minus className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          </Button>
          
          <span className="w-10 text-center text-sm font-black text-slate-900 dark:text-white tabular-nums">
            {item.quantity}
          </span>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
          >
            <Plus className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          </Button>
        </div>

        {/* Line Total Display */}
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1">Subtotal</p>
          <p className="text-base font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
            Rs {(item.price * item.quantity).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Visual Indicator on Hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center" />
    </div>
  ))}
</div>
        )}
      </div>

      {/* 4. BOTTOM FADE (Indicates scroll) */}
      <div className="h-4 bg-gradient-to-t from-slate-50/80 dark:from-slate-950/80 to-transparent pointer-events-none shrink-0" />
    </div>
  );
};

export default CartSection;