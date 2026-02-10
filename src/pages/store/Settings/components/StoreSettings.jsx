import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { updateStore } from "@/Redux Toolkit/features/store/storeThunks";
import StoreSettingsForm from "./StoreSettingsForm";
import { getInitialValues } from "./formUtils";

const StoreSettings = ({ settings, onChange }) => {
  const dispatch = useDispatch();
  const { store, loading, error } = useSelector((state) => state.store);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (apiData, { setSubmitting, resetForm }) => {
    if (!store?.id) {
      toast({
        title: "Error",
        description: "Store information not found",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(updateStore({ 
        id: store.id, 
        storeData: apiData
      })).unwrap();
      
      toast({
        title: "Success",
        description: "Store settings updated successfully",
      });
      
      // Update local settings state
      Object.keys(settings).forEach(key => {
        onChange(key, settings[key]);
      });
      
      resetForm({ values: getInitialValues(store) });
    } catch (err) {
      toast({
        title: "Error",
        description: err || "Failed to update store settings",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div id="store-settings">
      
      <div>
        <StoreSettingsForm
          initialValues={settings}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting || loading}
          storeId={store?.id}
        />
      </div>
    </div>
  );
};

export default StoreSettings; 