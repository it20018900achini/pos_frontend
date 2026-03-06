"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStoreByAdmin, updateStore } from "@/Redux Toolkit/features/store/storeThunks";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

import SettingsContent from "./components/SettingsContent";
import ContentLayout from "../../Dashboard/ContentLayout";

export default function Settings() {
  const dispatch = useDispatch();
  const { store, loading } = useSelector((state) => state.store);

  const [storeSettings, setStoreSettings] = useState({
    storeName: "",
    storeEmail: "",
    storePhone: "",
    storeAddress: "",
    storeDescription: "",
    storeType: "",
  });

  useEffect(() => {
    dispatch(getStoreByAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (store) {
      setStoreSettings({
        storeName: store.brand || "",
        storeEmail: store.contact?.email || "",
        storePhone: store.contact?.phone || "",
        storeAddress: store.contact?.address || "",
        storeDescription: store.description || "",
        storeType: store.storeType || "",
      });
    }
  }, [store]);

  const handleChange = (field, value) => {
    setStoreSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await dispatch(
        updateStore({
          id: store.id,
          storeData: {
            brand: storeSettings.storeName,
            storeType: storeSettings.storeType,
            description: storeSettings.storeDescription,
            contact: {
              email: storeSettings.storeEmail,
              phone: storeSettings.storePhone,
              address: storeSettings.storeAddress,
            },
          },
        })
      ).unwrap();

      toast({
        title: "Success",
        description: "Store updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err || "Failed to update store",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="p-6">Loading store settings...</div>;

  return (
    <ContentLayout
      title="Store Settings"
      subTitle="Manage your store information"
    >
      <div className="space-y-6">
        <SettingsContent
          storeSettings={storeSettings}
          onStoreSettingsChange={handleChange}
        />

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </ContentLayout>
  );
}