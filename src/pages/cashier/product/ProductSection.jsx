import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Barcode, Loader2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";

import {
  getProductsByStore,
  searchProducts,
} from "../../../Redux Toolkit/features/product/productThunks";
import { getBranchById } from "../../../Redux Toolkit/features/branch/branchThunks";
import { clearSearchResults } from "@/Redux Toolkit/features/product/productSlice";

const ProductSection = ({ searchInputRef }) => {
  const dispatch = useDispatch();
  const { branch } = useSelector((state) => state.branch);
  const { userProfile } = useSelector((state) => state.user);

  const { products, searchResults, loading, error: productsError } =
    useSelector((state) => state.product);

  const [searchTerm, setSearchTerm] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);

  const { toast } = useToast();

  const getDisplayProducts = () => {
    if (searchTerm.trim() && searchResults.length > 0) return searchResults;
    return products || [];
  };

  /** -------------------------------------------------------
   * INITIAL PRODUCT LOAD
   ------------------------------------------------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      if (branch?.storeId && localStorage.getItem("jwt")) {
        try {
          await dispatch(getProductsByStore(branch.storeId)).unwrap();
          setInitialLoad(false);
        } catch (error) {
          toast({
            title: "Error",
            description: error || "Failed to fetch products",
            variant: "destructive",
          });
        }
      } else if (userProfile?.branchId && localStorage.getItem("jwt") && !branch) {
        try {
          await dispatch(
            getBranchById({
              id: userProfile.branchId,
              jwt: localStorage.getItem("jwt"),
            })
          ).unwrap();
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load branch information",
            variant: "destructive",
          });
        }
      }
    };

    fetchProducts();
  }, [dispatch, branch, userProfile, toast]);

  /** -------------------------------------------------------
   * DEBOUNCED SEARCH
   ------------------------------------------------------- */
  const debouncedSearch = useCallback(() => {
    let timer;
    return (query) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (query.trim() && branch?.storeId && localStorage.getItem("jwt")) {
          dispatch(
            searchProducts({
              query: query.trim(),
              storeId: branch.storeId,
            })
          ).catch(() => {
            toast({
              title: "Search Error",
              description: "Failed to search products",
              variant: "destructive",
            });
          });
        }
      }, 450);
    };
  }, [dispatch, branch, toast])();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) debouncedSearch(value);
    else dispatch(clearSearchResults());
  };

  /** -------------------------------------------------------
   * ERROR TOAST
   ------------------------------------------------------- */
  useEffect(() => {
    if (productsError) {
      toast({
        title: "Error",
        description: productsError,
        variant: "destructive",
      });
    }
  }, [productsError, toast]);

  const displayProducts = getDisplayProducts();

  return (
    <div className="w-2/5 flex flex-col bg-card border-r shadow-lg">
      {/* -------------------------------------------
          SEARCH BAR
      -------------------------------------------- */}
      <div className="p-4 border-b bg-muted/70 backdrop-blur">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 
            text-muted-foreground group-focus-within:text-primary transition" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search products or scan barcode (F1)"
            className="pl-12 pr-4 py-3 text-lg rounded-xl shadow-sm focus:ring-primary"
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={loading}
          />
        </div>

        {/* Search Controls */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-muted-foreground">
            {loading
              ? "Loading..."
              : searchTerm.trim()
              ? `Found ${displayProducts.length}`
              : `${displayProducts.length} products`}
          </span>

          <div className="flex gap-2">
            {searchTerm.trim() && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs rounded-full"
                onClick={() => {
                  setSearchTerm("");
                  dispatch(clearSearchResults());
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="text-xs rounded-full"
            >
              <Barcode className="w-4 h-4 mr-1" />
              Scan
            </Button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------
          INITIAL LOADING
      -------------------------------------------- */}
      {initialLoad && (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
          <Loader2 className="animate-spin h-8 w-8 mb-4" />
          <p>Loading products…</p>
        </div>
      )}

      {/* -------------------------------------------
          PRODUCTS GRID
      -------------------------------------------- */}
      {!initialLoad && (
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-3">
              <Loader2 className="animate-spin w-8 h-8" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
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
      )}
    </div>
  );
};

export default ProductSection;
