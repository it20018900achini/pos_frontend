import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addSupplier, editSupplier } from "../../../Redux Toolkit/features/suppliers/supplierSlice";

const EditSupplierDialog = ({ open, onClose, supplier }) => {
  const dispatch = useDispatch();

  const isEdit = Boolean(supplier?.id);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
      });
    }
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isEdit) {
      dispatch(editSupplier({ id: supplier.id, data: form }));
    } else {
      dispatch(addSupplier(form));
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Supplier" : "Add Supplier"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            name="name"
            placeholder="Supplier name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />

          <Input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSupplierDialog;
