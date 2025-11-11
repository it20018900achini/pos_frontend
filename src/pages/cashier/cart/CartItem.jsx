import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartItem = ({ item, updateCartItemQuantity, removeFromCart }) => {
  // Format prices nicely
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(price);

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateCartItemQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => updateCartItemQuantity(item.id, item.quantity + 1);

  return (
    <Card key={item.id} className="border-l-4 border-l-green-700">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          {/* Item Info */}
          <div className="flex-1">
            <h3 className="font-medium flex items-center space-x-2">
              {item.name}
              {item.isNew && <Badge variant="secondary">New</Badge>}
            </h3>
            <p className="text-sm text-muted-foreground">{item.sku}</p>
          </div>

          {/* Quantity & Actions */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center border rounded">
              <Button
                aria-label="Decrease quantity"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleDecrease}
                disabled={item.quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>

              <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
                {item.quantity}
              </span>

              <Button
                aria-label="Increase quantity"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleIncrease}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-right">
              <p className="font-medium">{formatPrice(item.sellingPrice)}</p>
              <p className="text-sm font-bold text-green-600">
                {formatPrice(item.sellingPrice * item.quantity)}
              </p>
            </div>

            <Button
              aria-label="Remove item from cart"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
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
