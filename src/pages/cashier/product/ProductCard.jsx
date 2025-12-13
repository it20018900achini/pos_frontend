import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { useDispatch } from "react-redux";
import { useToast } from "../../../components/ui/use-toast";
import { addToCart } from "../../../Redux Toolkit/features/cart/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast({
      title: "Added to cart",
      description: `${product.name} added to cart`,
      duration: 1200,
    });
  };

  return (
    <Card
      key={product.id}
      className="
        cursor-pointer 
        bg-white dark:bg-gray-800 
        border border-slate-200 dark:border-gray-700
        rounded-xl
        shadow-sm 
        transition-all duration-300 
        hover:shadow-md 
        hover:border-indigo-300 dark:hover:border-indigo-500
        hover:scale-[1.015]
      "
      onClick={() => handleAddToCart(product)}
    >
      <CardContent className="p-3">
        {/* Image Wrapper */}
        <div
          className="
            aspect-square 
            bg-slate-100 dark:bg-gray-700
            rounded-lg 
            mb-3
            flex items-center justify-center 
            overflow-hidden
          "
        >
          <img
            className="h-full w-full object-cover rounded-md"
            src={product.image}
            alt={product.name}
          />
        </div>

        {/* Name */}
        <h3 className="font-semibold text-sm text-slate-800 dark:text-gray-200 truncate">
          {product.name}
        </h3>

        {/* SKU */}
        <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">{product.sku}</p>

        {/* Price + Category */}
        <div className="flex items-center justify-between mt-1">
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            LKR {product.sellingPrice || product.price}
          </span>

          <Badge
            variant="secondary"
            className="text-[10px] rounded-full px-2 bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200"
          >
            {product.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
