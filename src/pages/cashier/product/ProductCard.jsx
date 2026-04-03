import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { useDispatch } from "react-redux";
import { useToast } from "../../../components/ui/use-toast";
import { addToCart } from "../../../Redux Toolkit/features/cart/cartSlice";
import { CircleSlash, Package, Layers } from "lucide-react";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { toast } = useToast(); // Destructure properly from hook

  const variant = product?.productVariant;
  const stock = product?.inventory?.quantity ?? 0;
  const isOutOfStock = stock <= 0;

  const handleAddToCart = (e) => {
    // Prevent click if out of stock
    if (isOutOfStock) {
      toast({
        title: "Stock Alert",
        description: "This item is currently out of stock.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    dispatch(addToCart(variant));
    // toast({
    //   title: "Added to Cart",
    //   description: `${variant?.name} added successfully.`,
    //   duration: 1000,
    // });
  };

  return (
    <Card
      onClick={handleAddToCart}
      className={`
        relative group overflow-hidden border-none transition-all duration-300 select-none
        ${isOutOfStock 
          ? "opacity-60 cursor-not-allowed grayscale-[0.5]" 
          : "cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:shadow-xl active:scale-95"}
        bg-white dark:bg-[#121214] shadow-sm ring-1 ring-neutral-200 dark:ring-white/5
      `}
    >
      {/* Stock Overlay for Pro Look */}
      {isOutOfStock && (
        <div className="absolute inset-0 z-10 bg-white/40 dark:bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
          <Badge variant="destructive" className="font-black tracking-widest uppercase py-1 px-3 shadow-lg">
            Out of Stock
          </Badge>
        </div>
      )}

      <CardContent className="p-3">
        {/* Header: Stock & Category */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-indigo-500" />
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight truncate max-w-[80px]">
              {variant?.category || "General"}
            </span>
          </div>
          
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${stock < 10 && stock > 0 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" : "bg-neutral-100 dark:bg-white/5 text-neutral-500"}`}>
            <Package className="w-3 h-3" />
            <span className="text-[10px] font-black">{stock}</span>
          </div>
        </div>

        {/* Media Wrapper */}
        <div className="relative aspect-square mb-3 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 ring-1 ring-black/5">
          <img
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={variant?.imageUrl || "https://placehold.co/400x400?text=No+Image"}
            alt={variant?.name}
          />
         
          
          {/* Subtle Price Overlay on Image */}
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[11px] font-black shadow-lg">
            LKR {Number(variant?.sellingPrice || variant?.price).toLocaleString()}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-0.5">
          <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 leading-tight truncate group-hover:text-indigo-600 transition-colors">
            {variant?.name}
          </h3>
          <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            {variant?.sku || "NO-SKU"}
          </p>
        </div>
 <pre>
            {JSON.stringify(variant,2,null)}
          </pre>
        {/* Action Indicator (Visible on Hover) */}
        {!isOutOfStock && (
          <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center justify-center">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              + Quick Add
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;