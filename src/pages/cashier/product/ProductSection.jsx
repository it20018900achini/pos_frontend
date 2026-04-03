import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Loader2, Search, X, LayoutGrid, List, Grid, 
  PackageSearch, Command 
} from "lucide-react";
import {
  useGetProductVariantsByBranchQuery,
  useSearchProductsQuery,
} from "@/Redux Toolkit/features/product/productApi";
import ProductCard from "./ProductCard";
import ProductSmallCard from "./ProductSmallCard";
import ProductListRow from "./ProductListRow";
import { useToast } from "@/components/ui/use-toast";

const ProductSection = ({ searchInputRef }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [view, setView] = useState("card");

  // Pulling IDs from your Redux User State
  const { selectedBranchId, userProfile } = useSelector((state) => state.user);
  const storeId = userProfile?.user?.store?.id; 

  // 1. Debounce: Wait 300ms after user stops typing to trigger API
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 2. Data Fetching: Standard Branch Products
  const { data: products = [], isLoading, isError } =
    useGetProductVariantsByBranchQuery(selectedBranchId, { skip: !selectedBranchId });

  // 3. Data Fetching: Store-wide Search
  const { data: searchResults = [], isFetching: isSearching } = useSearchProductsQuery(
    { storeId, query: debouncedTerm },
    { skip: debouncedTerm.trim() === "" || !storeId }
  );

  // 4. Result Logic: Show search results if typing, otherwise show branch inventory
  const displayProducts = useMemo(() => 
    debouncedTerm.trim() ? searchResults : products
  , [debouncedTerm, searchResults, products]);

  // ---------------- POS Keyboard Support ----------------
  const handleKeyDown = useCallback((e) => {
    if (e.key === "F1") {
      e.preventDefault();
      searchInputRef?.current?.focus();
    }
    if (e.key === "F2") {
      e.preventDefault();
      const views = ["card", "smallCard", "list"];
      setView(prev => views[(views.indexOf(prev) + 1) % views.length]);
    }
    if (e.key === "Escape") {
      setSearchTerm("");
    }
  }, [searchInputRef]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="w-full  flex flex-col bg-neutral-50 dark:bg-[#09090b] border-r border-neutral-200 dark:border-neutral-800">
      
      {/* HEADER: Search & View Controls */}
      <div className="p-4 space-y-4 bg-white dark:bg-[#09090b] border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <PackageSearch className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">Inventory</h2>
          </div>
          
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
            <ViewBtn active={view === "card"} onClick={() => setView("card")} Icon={LayoutGrid} />
            <ViewBtn active={view === "smallCard"} onClick={() => setView("smallCard")} Icon={Grid} />
            <ViewBtn active={view === "list"} onClick={() => setView("list")} Icon={List} />
          </div>
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
            ) : (
              <Search className="w-5 h-5 text-neutral-400 group-focus-within:text-indigo-500 transition-colors" />
            )}
          </div>
          <Input
            ref={searchInputRef}
            placeholder="Search all variants or scan barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-12 py-7 text-base font-medium rounded-2xl border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-4 focus:ring-indigo-500/10 transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {!searchTerm && (
              <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-white dark:bg-neutral-800 px-1.5 font-mono text-[10px] font-black text-neutral-400">
                F1
              </kbd>
            )}
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full">
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BODY: Product Canvas */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {isLoading ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-40 py-20">
            <PackageSearch className="w-12 h-12" />
            <p className="font-bold text-sm uppercase tracking-widest">
              {searchTerm ? `No results for "${searchTerm}"` : "Inventory is empty"}
            </p>
          </div>
        ) : (
          <div className={`
            animate-in fade-in slide-in-from-bottom-2 duration-500
            ${view === "card" && "grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4"}
            ${view === "smallCard" && "grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2"}
            ${view === "list" && "space-y-1"}
          `}>
            {displayProducts.map((product) => (
              <ProductRenderer key={product.id || product.productVariant?.id} view={view} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Internal Pro Components
const ViewBtn = ({ active, onClick, Icon }) => (
  <Button
    size="sm"
    variant="ghost"
    className={`h-8 w-10 rounded-lg transition-all ${active ? "bg-white dark:bg-neutral-700 shadow-sm text-indigo-600" : "text-neutral-500"}`}
    onClick={onClick}
  >
    <Icon className="w-4 h-4" />
  </Button>
);

const ProductRenderer = ({ view, product }) => {
  if (view === "card") return <ProductCard product={product} />;
  if (view === "smallCard") return <ProductSmallCard product={product} />;
  return <ProductListRow product={product} />;
};

export default ProductSection;