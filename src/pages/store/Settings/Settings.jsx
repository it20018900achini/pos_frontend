"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStore, getStoreById } from "@/Redux Toolkit/features/store/storeThunks";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Save, Store, Loader2, Globe, ShieldCheck } from "lucide-react";

import SettingsContent from "./components/SettingsContent";
import ContentLayout from "../../Dashboard/ContentLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function Settings() {
  const dispatch = useDispatch();
  const { store, loading } = useSelector((state) => state.store);
  const { userProfile } = useSelector((state) => state.user);
  
  const storeId = userProfile?.user?.store?.id;
  const [isSaving, setIsSaving] = useState(false);

  const [storeSettings, setStoreSettings] = useState({
    storeName: "",
    storeEmail: "",
    storePhone: "",
    storeAddress: "",
    storeDescription: "",
    storeType: "",
  });

  useEffect(() => {
    if (storeId) {
      dispatch(getStoreById(storeId));
    }
  }, [dispatch, storeId]);

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
    setIsSaving(true);
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
        title: "Profile Updated",
        description: "Your store configuration has been saved successfully.",
      });
    } catch (err) {
      toast({
        title: "Update Failed",
        description: err || "Something went wrong while saving.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <SettingsSkeleton />;

  return (
    <ContentLayout
      title="Store Settings"
      subTitle="Configure your brand identity and contact details"
      right={
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none h-10 px-6 transition-all active:scale-95"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      }
    >
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        
        {/* --- BRAND STATUS CARD --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
             <SettingsContent
              storeSettings={storeSettings}
              onStoreSettingsChange={handleChange}
            />
          </div>

          {/* SIDEBAR INFO - High-End Touch */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                Store Verification
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Your store information is visible to customers on invoices and the digital storefront. Ensure your contact details are up to date to maintain trust.
              </p>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-medium">
                  <span className="text-slate-400 uppercase">Status</span>
                  <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-medium">
                  <span className="text-slate-400 uppercase">Store ID</span>
                  <span className="text-slate-900 dark:text-white font-mono">#{storeId}</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
               <Globe className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform duration-700" />
               <h4 className="text-sm font-bold mb-2">Need Help?</h4>
               <p className="text-xs text-indigo-100 mb-4 leading-relaxed">
                 Need to change your store type or transfer ownership? Contact our support team.
               </p>
               <Button variant="secondary" size="sm" className="w-full rounded-xl bg-white/10 hover:bg-white/20 border-none text-white text-xs">
                 Support Center
               </Button>
            </div>
          </div>
        </div>

      </div>
    </ContentLayout>
  );
}

/**
 * Modern Loading State
 */
function SettingsSkeleton() {
  return (
    <ContentLayout title="Store Settings" subTitle="Loading...">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
           <Skeleton className="h-[400px] w-full rounded-3xl" />
        </div>
        <div className="space-y-6">
           <Skeleton className="h-[200px] w-full rounded-3xl" />
           <Skeleton className="h-[150px] w-full rounded-3xl" />
        </div>
      </div>
    </ContentLayout>
  );
}