import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download, Filter } from "lucide-react";
import StoreTable from "./StoreTable";
import StoreDetailDrawer from "./StoreDetailDrawer";
import { useToast } from "@/components/ui/use-toast";
import ContentLayout from "../../Dashboard/ContentLayout";
// import { useToast } from "../../hooks/use-toast";

export default function StoreListPage() {
  const [selectedStore, setSelectedStore] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { toast } = useToast();

  const handleViewDetails = (store) => {
    setSelectedStore(store);
    setDrawerOpen(true);
  };

  const handleBlockStore = (storeId) => {
    console.log("Store blocked:", storeId);
    toast({
      title: "Store Blocked",
      description: "The store has been successfully blocked.",
    });
  };

  const handleActivateStore = (storeId) => {
    console.log("Store activated:", storeId);
    toast({
      title: "Store Activated",
      description: "The store has been successfully activated.",
    });
  };

  const handleEditStore = (store) => {
    toast({
      title: "Edit Store",
      description: `Editing store: ${store.name}`,
    });
  };



  return (
    <ContentLayout title={"Stores"} subTitle={"Manage all registered stores and their status"}>
      
    <div className="space-y-6">
      

      <Card>
        <CardHeader>
          <CardTitle>All Stores</CardTitle>
        </CardHeader>
        <CardContent>
          <StoreTable
            onViewDetails={handleViewDetails}
            onBlockStore={handleBlockStore}
            onActivateStore={handleActivateStore}
          />
        </CardContent>
      </Card>

      <StoreDetailDrawer
        store={selectedStore}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onBlockStore={handleBlockStore}
        onActivateStore={handleActivateStore}
        onEditStore={handleEditStore}
      />
    </div>
    </ContentLayout>
  );
} 