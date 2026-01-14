import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { addToCart } from "@/Redux Toolkit/features/cart/cartSlice";

const ProductListRow = ({ product }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast({
      title: "Added to cart",
      description: `${product.name} added to cart`,
      duration: 1200,
    });
  };

  return (
    <div
      className="
        flex items-center justify-between p-3 border rounded-lg
        bg-white dark:bg-gray-800
        border-gray-200 dark:border-gray-700
        cursor-pointer
        hover:bg-gray-100 dark:hover:bg-gray-700
        transition-colors duration-200
      "
      onClick={() => handleAddToCart(product)}
    >
      {/* Left */}
      <div>
        <p className="font-medium text-gray-800 dark:text-gray-200">
          {product.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          SKU: {product.sku || "-"}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          LKR {Number(product.sellingPrice || product.price).toFixed(2)}
        </span>

        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(product);
          }}
        >
          <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        </Button>
      </div>
    </div>
  );
};

export default ProductListRow;
