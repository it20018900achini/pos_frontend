"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { addToCart } from "@/Redux Toolkit/features/cart/cartSlice";
import { CircleSlash } from "lucide-react";

const ProductSmallCard = ({ product }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Unified data access to match your ProductCard/ListRow structure
  const variant = product?.productVariant;
  const inventoryQty = product?.inventory?.quantity;
  const isOutOfStock = inventoryQty == null || inventoryQty <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast({
        title: "Out of Stock",
        description: "This item cannot be added.",
        variant: "destructive",
        duration: 1000,
      });
      return;
    }

    dispatch(addToCart(variant));
    toast({
      title: "Added",
      description: `${variant?.name} added to cart`,
      duration: 1000,
    });
  };

  return (
    <div
      onClick={handleAddToCart}
      className={`
        relative group flex flex-col items-center justify-center p-2 
        bg-white dark:bg-gray-800 rounded-lg shadow-sm border
        transition-all duration-200 
        ${isOutOfStock 
          ? "opacity-60 cursor-not-allowed border-gray-100 dark:border-gray-700" 
          : "cursor-pointer hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 hover:scale-[1.02]"
        }
      `}
    >
      {/* Out of Stock Icon Overlay */}
      {isOutOfStock && (
        <CircleSlash className="absolute top-1 right-1 w-4 h-4 text-red-500 z-10" />
      )}

      {/* Product Image */}
      <div className="w-16 h-16 bg-neutral-100 dark:bg-gray-700 rounded-md mb-2 overflow-hidden">
        <img
          src={variant?.imageUrl || "/api/placeholder/64/64"}
          alt={variant?.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Name */}
      <p className="text-xs font-semibold text-center truncate w-full text-gray-800 dark:text-gray-200">
        {variant?.name}
      </p>

      {/* Price */}
      <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
        LKR {Number(variant?.sellingPrice || variant?.price || 0).toFixed(0)}
      </p>

      {/* Inventory Label */}
      <div className="mt-1">
        {isOutOfStock ? (
          <span className="text-[9px] text-red-500 font-medium">Out of Stock</span>
        ) : (
          <span className="text-[9px] text-gray-400">Stock: {inventoryQty}</span>
        )}
      </div>
    </div>
  );
};

export default ProductSmallCard;