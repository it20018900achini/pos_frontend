import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, CircleSlash } from "lucide-react";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { addToCart } from "@/Redux Toolkit/features/cart/cartSlice";

const ProductListRow = ({ product }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Extract variant for cleaner code
  const variant = product?.productVariant;
  const isOutOfStock = product?.inventory?.quantity == null || product?.inventory?.quantity <= 0;

  const handleAddToCart = (e) => {
    // Prevent double triggering if clicked on the button specifically
    if (e) e.stopPropagation();
    
    // Check if stock exists before adding
    if (isOutOfStock) {
      toast({
        title: "Out of Stock",
        description: `${variant?.name} is currently unavailable.`,
        variant: "destructive",
        duration: 1200,
      });
      return;
    }

    dispatch(addToCart(variant));
    toast({
      title: "Added to cart",
      description: `${variant?.name} added to cart`,
      duration: 1200,
    });
  };

  return (
    <div
      className={`
        flex items-center justify-between p-3 border rounded-lg
        bg-white dark:bg-gray-800
        border-gray-200 dark:border-gray-700
        transition-all duration-200
        ${isOutOfStock ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-indigo-200"}
      `}
      onClick={handleAddToCart}
    >
      {/* Left side: Info */}
      <div className="flex items-center gap-3">
        {/* Out of stock indicator */}
        {isOutOfStock && <CircleSlash className="w-4 h-4 text-red-500" />}
        
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-200">
            {variant?.name}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SKU: {variant?.sku || "-"}
            </p>
            {/* Small stock count indicator */}
            <span className="text-[10px] text-gray-400">
              ({product?.inventory?.quantity || 0} in stock)
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Price & Action */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          LKR {Number(variant?.sellingPrice || variant?.price || 0).toFixed(2)}
        </span>

        <Button
          size="sm"
          variant="ghost"
          disabled={isOutOfStock}
          className="hover:bg-indigo-50 dark:hover:bg-indigo-900"
          onClick={handleAddToCart}
        >
          <Plus className={`w-4 h-4 ${isOutOfStock ? "text-gray-400" : "text-indigo-600 dark:text-indigo-400"}`} />
        </Button>
      </div>
    </div>
  );
};

export default ProductListRow;