"use client";
import React, { useState } from 'react';
import SupplierList from './SupplierList';
import ContentLayout from '../../Dashboard/ContentLayout';
import EditSupplierDialog from "./EditSupplierDialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

function Suppliers() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const handleOpenModal = (supplier = null) => {
    setSelectedSupplier(supplier);
    setOpenDialog(true);
  };

  return (
    <ContentLayout 
      title="Supplier Management" 
      subTitle="Manage your branch's suppliers and contact details."
      right={
        <Button onClick={() => handleOpenModal(null)} className="gap-2">
          <UserPlus size={16} /> Add Supplier
        </Button>
      }
    >
      {/* Pass the open function down so the Edit button in the table still works */}
      <SupplierList onEdit={handleOpenModal} />

      <EditSupplierDialog
        open={openDialog}
        supplier={selectedSupplier}
        onClose={() => {
          setOpenDialog(false);
          setSelectedSupplier(null);
        }}
      />
    </ContentLayout>
  );
}

export default Suppliers;