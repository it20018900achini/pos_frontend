// ProductSmallCard.jsx
"use client";

import React from "react";

const ProductSmallCard = ({ product }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 flex flex-col items-center justify-center shadow hover:shadow-md cursor-pointer transition">
      {/* Optional: product image */}
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-md mb-1"
        />
      )}

      {/* Product Name */}
      <p className="text-sm font-medium text-center truncate w-full">
        {product.name || product.productVariant?.name}
      </p>

      {/* Price */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        LKR {Number(product.sellingPrice || product.price || 0).toFixed(2)}
      </p>

      {/* Optional: Quantity */}
      {product.quantity != null && (
        <p className="text-xs text-gray-400 mt-1">
          Qty: {product.quantity}
        </p>
      )}
    </div>
  );
};

export default ProductSmallCard;
