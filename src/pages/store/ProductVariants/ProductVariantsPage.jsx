"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Package, 
  Filter, 
  RefreshCcw,
  Search
} from "lucide-react";

// UI Components (Assuming shadcn/ui pathing)
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Layout & Custom Components
import ContentLayout from "../../Dashboard/ContentLayout";
import VariantForm from "./VariantForm";

// Redux Actions & APIs
import { 
  useDeleteProductVariantMutation, 
  useFilterProductVariantsQuery 
} from "../../../Redux Toolkit/features/product/productApi";
import { GetProductsByStore } from "../../../Redux Toolkit/features/product/productThunks";
import { toast } from "sonner";

export default function ProductVariantsPage() {
  const dispatch = useDispatch();

  // --- REDUX STATE ---
  const { selectedBranchId, userProfile } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.product);

  // --- LOCAL STATE ---
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    isActive: "any",
    isFeatured: "any",
    productId: "all",
  });
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVariant, setEditVariant] = useState(null);

  // --- FETCH PRODUCTS FOR DROPDOWN ---
  const fetchProducts = useCallback(async () => {
    const storeId = userProfile?.user?.store?.id;
    if (!storeId) return;
    try {
      await dispatch(GetProductsByStore(storeId)).unwrap();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load product list for filters",
        variant: "destructive",
      });
    }
  }, [dispatch, userProfile, toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- QUERY PARAMS CONSTRUCTION ---
  const queryParams = {
    branchId: selectedBranchId,
    productId: filters.productId === "all" ? undefined : filters.productId,
    keyword: search || undefined,
    page,
    size: 10,
    sortBy: "id",
    sortDir: "asc",
    ...(filters.isActive !== "any" && { isActive: filters.isActive === "yes" }),
    ...(filters.isFeatured !== "any" && { isFeatured: filters.isFeatured === "yes" }),
  };

  const { data, isLoading, isFetching } = useFilterProductVariantsQuery(queryParams);
  const [deleteVariant] = useDeleteProductVariantMutation();

  // --- HANDLERS ---
  const openModal = (variant = null) => {
    setEditVariant(variant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditVariant(null);
    setIsModalOpen(false);
  };

  const handleResetFilters = () => {
    setSearch("");
    setFilters({ isActive: "any", isFeatured: "any", productId: "all" });
    setPage(0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      try {
        await deleteVariant(id).unwrap();
        toast({ title: "Deleted", description: "Variant removed successfully" });
      } catch (err) {
        toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
      }
    }
  };

  return (
    <ContentLayout
      title="Product Variants"
      subTitle="Manage detailed specifications for each product"
      right={
        <Button onClick={() => openModal()} className="bg-primary hover:bg-primary/90">
          + Add New Variant
        </Button>
      }
    >
      <div className="space-y-6">
        
        {/* --- PREMIUM TOP FILTER BAR --- */}
        <div className="bg-card p-5 rounded-xl border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Filter size={16} /> Quick Filters
            </div>
            <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-8 text-xs gap-1">
              <RefreshCcw size={14} /> Reset
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* 1. Keyword Search */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="SKU or Name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-background border rounded-md text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            {/* 2. Base Product Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Base Product</label>
              <Select
                value={filters.productId}
                onValueChange={(val) => setFilters((f) => ({ ...f, productId: val }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {products?.map((prod) => (
                    <SelectItem key={prod.id} value={prod.id.toString()}>
                      {prod.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 3. Status Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Visibility</label>
              <Select
                value={filters.isActive}
                onValueChange={(val) => setFilters((f) => ({ ...f, isActive: val }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Status</SelectItem>
                  <SelectItem value="yes">Active Only</SelectItem>
                  <SelectItem value="no">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Featured Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Highlight</label>
              <Select
                value={filters.isFeatured}
                onValueChange={(val) => setFilters((f) => ({ ...f, isFeatured: val }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="yes">Featured</SelectItem>
                  <SelectItem value="no">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 5. Apply Button */}
            <Button variant="secondary" className="w-full font-semibold" onClick={() => setPage(0)}>
              Apply Filters
            </Button>
          </div>
        </div>

        {/* --- PREMIUM DATA TABLE --- */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 border-b text-muted-foreground font-semibold uppercase text-[11px]">
                <tr>
                  <th className="p-4 w-16 text-center">Image</th>
                  <th className="p-4">Variant Info</th>
                  <th className="p-4">Logistics (SKU)</th>
                  <th className="p-4">Pricing</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {(isLoading || isFetching) ? (
                  <tr><td colSpan={6} className="p-12 text-center animate-pulse text-muted-foreground font-medium">Updating results...</td></tr>
                ) : data?.content.length === 0 ? (
                  <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">No variants found matching your criteria.</td></tr>
                ) : data?.content.map((variant) => (
                  <tr key={variant.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4">
                      {variant.imageUrl ? (
                        <img src={variant.imageUrl} alt={variant.name} className="w-12 h-12 rounded-lg object-cover shadow-sm border bg-white" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground"><Package size={18} /></div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        {variant.name}
                        {variant.isFeatured && <Star size={12} className="fill-yellow-500 text-yellow-500" />}
                      </div>
                      <div className="text-[11px] text-muted-foreground">ID: #{variant.id}</div>
                    </td>
                    <td className="p-4">
                      <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase font-mono">
                        {variant.sku || "NO-SKU"}
                      </code>
                      <div className="text-[10px] mt-1.5 flex gap-2 text-muted-foreground italic">
                        {variant.weight && <span>{variant.weight}kg</span>}
                        {variant.length && <span>{variant.length}×{variant.width}×{variant.height}</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-primary">${variant.sellingPrice.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground line-through italic">Cost: ${variant.costPrice}</div>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={variant.isActive ? "default" : "secondary"} className="text-[10px] px-2 h-5">
                        {variant.isActive ? <CheckCircle2 size={10} className="mr-1"/> : <XCircle size={10} className="mr-1"/>}
                        {variant.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-primary" onClick={() => openModal(variant)}>
                          <Edit size={14} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-destructive text-destructive/70" onClick={() => handleDelete(variant.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- PAGINATION --- */}
          <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
             <div className="text-xs text-muted-foreground font-medium italic">
              Page {page + 1} of {data?.totalPages || 1}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-8 px-4" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button size="sm" variant="outline" className="h-8 px-4" disabled={page + 1 >= data?.totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- FORM MODAL --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{editVariant ? "Update Variant Details" : "Create New Product Variant"}</DialogTitle>
          </DialogHeader>
          <VariantForm 
            variant={editVariant} 
            onSuccess={closeModal} 
            // Optional: Pass pre-selected product if one is active in filters
            defaultProductId={filters.productId !== 'all' ? filters.productId : null}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}