import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

import { getProductsByStore } from "@/Redux Toolkit/features/product/productThunks";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import ProductSearch from "./ProductSearch";
import ProductDetails from "./ProductDetails";

export default function Products() {
  const dispatch = useDispatch();
  const { products, loading, error, searchResults } = useSelector(
    (state) => state.product
  );
  const { store } = useSelector((state) => state.store);

  const [dialogOpen, setDialogOpen] = useState(false); // unified add/edit dialog
  const [currentProduct, setCurrentProduct] = useState(null); // null = add, object = edit
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    if (!store?.id) return;
    try {
      await dispatch(getProductsByStore(store.id)).unwrap();
    } catch (err) {
      toast({
        title: "Error",
        description: err || "Failed to fetch products",
        variant: "destructive",
      });
    }
  }, [dispatch, store]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update displayed products when products or search changes
  useEffect(() => {
    setDisplayedProducts(
      isSearchActive && searchResults.length > 0 ? searchResults : products
    );
  }, [products, searchResults, isSearchActive]);

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
    setIsSearchActive(false);
  };

  const handleOpenDialog = (product = null) => {
    setCurrentProduct(product);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentProduct(null);
  };

  const handleFormSubmit = () => {
    handleCloseDialog();
  };

  const handleOpenView = (product) => {
    setCurrentProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleSearch = (results) => {
    if (!results) {
      setIsSearchActive(false);
      setDisplayedProducts(products);
    } else {
      setIsSearchActive(true);
      setDisplayedProducts(results);
    }
  };

  // Unified dialog render
  const renderFormDialog = () => (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>
            {currentProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <ProductForm
          initialValues={currentProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseDialog}
          isEditing={!!currentProduct}
        />
      </DialogContent>
    </Dialog>
  );

  // View dialog render
  const renderViewDialog = () => (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        <ProductDetails product={currentProduct} />
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>

        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => handleOpenDialog()}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search & Refresh */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <ProductSearch onSearch={handleSearch} />
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
          className="ml-auto"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Search Results Notice */}
      {isSearchActive && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-md flex justify-between items-center">
          <span>
            Showing search results ({displayedProducts.length}{" "}
            {displayedProducts.length === 1 ? "product" : "products"} found)
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSearch(null)}
            className="text-amber-800 hover:text-amber-900 hover:bg-amber-100"
          >
            Show all products
          </Button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* Product Table */}
      <Card>
        <CardContent className="p-0">
          <ProductTable
            products={displayedProducts}
            loading={loading || refreshing}
            onEdit={handleOpenDialog}
            onView={handleOpenView}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      {renderFormDialog()}
      {renderViewDialog()}
    </div>
  );
}
