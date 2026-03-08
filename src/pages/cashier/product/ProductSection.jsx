import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, X, LayoutGrid, List, Grid } from "lucide-react";
import {
  useGetProductVariantsByBranchQuery,
  useSearchProductsQuery,
} from "@/Redux Toolkit/features/product/productApi";
import ProductCard from "./ProductCard";
import ProductSmallCard from "./ProductSmallCard"; // new small card component
import ProductListRow from "./ProductListRow";
import { useToast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";

const ProductSection = ({ searchInputRef}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("card"); // card | smallCard | list
  const {selectedBranchId}=useSelector((state)=>state.user)

  const { data: products = [], isLoading, isError } =
    useGetProductVariantsByBranchQuery(selectedBranchId);

  const { data: searchResults = [] } = useSearchProductsQuery(
    { selectedBranchId, query: searchTerm },
    { skip: searchTerm.trim() === "" }
  );

  const displayProducts = searchTerm.trim() ? searchResults : products;

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    }
  }, [isError, toast]);

  // ---------------- POS Keyboard Support ----------------
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        searchInputRef?.current?.focus();
      }
      if (e.key === "F2") {
        e.preventDefault();
        setView((v) =>
          v === "card" ? "smallCard" : v === "smallCard" ? "list" : "card"
        );
      }
      if (e.key === "F3") {
        e.preventDefault();
        setView((v) => (v === "list" ? "card" : "list"));
      }
    },
    [searchInputRef]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="w-2/5 flex flex-col bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-lg">
      {/* Search + View Toggle */}
      <div className="p-4 border-b bg-gray-100 dark:bg-gray-800 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            ref={searchInputRef}
            placeholder="Search or scan barcode (F1)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 text-lg rounded-xl"
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

        {/* View Toggle */}
        <div className="flex gap-1">
          <Button
            size="icon"
            variant={view === "card" ? "default" : "outline"}
            onClick={() => setView("card")}
            title="Card View"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant={view === "smallCard" ? "default" : "outline"}
            onClick={() => setView("smallCard")}
            title="Small Card View"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
            title="List View"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Products */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No products found
          </div>
        ) : view === "card" ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
            {displayProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        ) : view === "smallCard" ? (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
            {displayProducts.map((product) => (
              <ProductSmallCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {displayProducts.map((product) => (
              <ProductListRow key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSection;
