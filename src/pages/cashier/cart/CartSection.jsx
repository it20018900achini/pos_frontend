import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Pause, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { useToast } from "../../../components/ui/use-toast";

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
  const toast = useToast();

  // Handlers wrapped in useCallback for performance
  const handleUpdateCartItemQuantity = useCallback(
    (id, newQuantity) => {
      dispatch(updateCartItemQuantity({ id, quantity: newQuantity }));
    },
    [dispatch]
  );

  const handleRemoveFromCart = useCallback(
    (id) => {
      dispatch(removeFromCart(id));
    },
    [dispatch]
  );

  const handleClearCart = () => {
    if (cartItems.length === 0) return;

    dispatch(clearCart());
    toast({
      title: "Cart Cleared",
      description: "All items removed from cart",
    });
  };

  return (
    <div className="w-2/5 flex flex-col bg-card border-r">
      {/* Header */}
      <div className="p-4 border-b bg-muted">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart ({cartItems.length} items)
          </h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHeldOrdersDialog(true)}
            >
              <Pause className="w-4 h-4 mr-1" />
              Held ({heldOrders.length})
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearCart}>
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto relative">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
            <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Cart is empty</p>
            <p className="text-sm">Add products to start an order</p>
            <Button variant="secondary" className="mt-4">
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                updateCartItemQuantity={handleUpdateCartItemQuantity}
                removeFromCart={handleRemoveFromCart}
              />
            ))}
          </div>
        )}
        {/* Scroll Shadow */}
        {cartItems.length > 0 && (
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-b from-gray-200/50 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Cart Summary (Sticky) */}
      {cartItems.length > 0 && (
        <div className="sticky bottom-0 z-10 bg-card border-t">
          <CartSummary />
        </div>
      )}
    </div>
  );
};

export default CartSection;
