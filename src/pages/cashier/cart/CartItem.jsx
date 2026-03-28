import React, { useRef } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Minus, Plus, Trash2, Package } from "lucide-react";

const CartItem = ({ item, updateCartItemQuantity, removeFromCart }) => {
  const inputRef = useRef(null);

  // Pro Currency Formatter - ensures consistent spacing
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(price);

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateCartItemQuantity({ id: item.id, quantity: item.quantity - 1 });
    }
  };

  const handleIncrease = () => {
    updateCartItemQuantity({ id: item.id, quantity: item.quantity + 1 });
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    // Handles empty input or non-numbers gracefully in a Pro POS
    if (e.target.value === "") {
      updateCartItemQuantity({ id: item.id, quantity: "" }); 
      return;
    }
    if (!isNaN(value)) {
      updateCartItemQuantity({ id: item.id, quantity: Math.max(0, value) });
    }
  };

  // Auto-select text on focus for faster editing
  const handleFocus = () => inputRef.current?.select();

  return (
    <Card 
      className="group relative border-none bg-white dark:bg-[#121214] shadow-sm ring-1 ring-neutral-200 dark:ring-white/5 overflow-hidden mb-2 transition-all hover:ring-indigo-500/50"
    >
      {/* Subtle Side Accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-neutral-200 dark:bg-neutral-800 group-hover:bg-indigo-600 transition-colors" />

      <CardContent className="p-3 pl-4">
        <div className="flex items-center gap-4">
          
          {/* 1. PRODUCT INFO */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
                {item.name}
              </h3>
              {item.isNew && (
                <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-none text-[9px] h-4 px-1.5 font-black uppercase">
                  New
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                {item.sku}
              </span>
              <span className="text-[10px] text-neutral-300 dark:text-neutral-700">|</span>
              <span className="text-[10px] font-medium text-neutral-500">
                {formatPrice(item.price || item.sellingPrice)}
              </span>
            </div>
          </div>

          {/* 2. QUANTITY CONTROL (Terminal Style) */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-900 rounded-xl p-1 ring-1 ring-neutral-200 dark:ring-white/5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg hover:bg-white dark:hover:bg-neutral-800 hover:text-red-500"
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </Button>

            <input
              ref={inputRef}
              type="number"
              value={item.quantity}
              onChange={handleChange}
              onFocus={handleFocus}
              className="w-10 bg-transparent text-center text-sm font-black text-neutral-900 dark:text-neutral-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg hover:bg-white dark:hover:bg-neutral-800 hover:text-indigo-600"
              onClick={handleIncrease}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* 3. TOTAL & REMOVE */}
          <div className="flex items-center gap-4 min-w-[120px] justify-end">
            <div className="text-right">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter leading-none mb-1">
                Subtotal
              </p>
              <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                {formatPrice((item.price || item.sellingPrice) * item.quantity)}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-neutral-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
              onClick={() => removeFromCart(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(CartItem);