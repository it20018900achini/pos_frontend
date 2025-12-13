import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, X } from "lucide-react";
import { useGetProductsByStoreQuery, useSearchProductsQuery } from "@/Redux Toolkit/features/product/productApi";
import ProductCard from "./ProductCard";
import { useToast } from "@/components/ui/use-toast";

const ProductSection = ({ searchInputRef, storeId = 2 }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all products for the store
  const { data: products = [], isLoading, isError } = useGetProductsByStoreQuery(storeId);

  // Search products
  const { data: searchResults = [] } = useSearchProductsQuery(
    { storeId, query: searchTerm },
    { skip: searchTerm.trim() === "" }
  );

  const displayProducts = searchTerm.trim() ? searchResults : products;

  // Handle errors
  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    }
  }, [isError, toast]);

  // ---------------------------
  // POS Keyboard Support (F1 focus)
  // ---------------------------
  const handleKeyDown = useCallback((e) => {
    if (e.key === "F1") {
      e.preventDefault();
      if (searchInputRef?.current) {
        searchInputRef.current.focus();
      }
    }
  }, [searchInputRef]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="w-2/5 flex flex-col bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-lg">
      {/* Search */}
      <div className="p-4 border-b bg-gray-100 dark:bg-gray-800 backdrop-blur">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300" />
          <Input
            ref={searchInputRef}
            placeholder="Search products or scan barcode (F1)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 text-lg rounded-xl shadow-sm focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400"
            disabled={isLoading}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setSearchTerm("")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Products grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-3">
            <Loader2 className="animate-spin w-8 h-8 text-gray-500 dark:text-gray-400" />
            <p className="text-gray-500 dark:text-gray-300">Loading products...</p>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Search className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? "No matching products found" : "No products available"}
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 animate-in fade-in">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSection;
