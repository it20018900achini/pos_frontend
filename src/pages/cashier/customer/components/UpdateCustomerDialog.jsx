"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateCustomerMutation } from "@/Redux Toolkit/features/customer/customerApi";

const UpdateCustomerDialog = ({ open, setOpen, customer }) => {
  const { toast } = useToast();
  const [updateCustomer, { isLoading }] = useUpdateCustomerMutation();

  // Initialize form data safely
  const [formData, setFormData] = useState({
    fullName: customer?.fullName || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
  });

  // Prefill form when customer changes
  useEffect(() => {
    if (customer) {
      setFormData({
        fullName: customer.fullName || "",
        email: customer.email || "",
        phone: customer.phone || "",
      });
    }
  }, [customer]);

  // Validation
  const isValid =
    formData.fullName?.trim() &&
    formData.email?.includes("@") &&
    formData.phone?.length >= 10;

  // Handle update
  const handleUpdate = async () => {
    if (!customer) return;

    try {
      await updateCustomer({
        id: customer.id,
        data: formData,
      }).unwrap();

      toast({
        title: "Customer updated",
        description: "Changes saved successfully",
      });

      setOpen(false);
    } catch (err) {
      toast({
        title: "Update failed",
        description: err?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <Input
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
          <Input
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Input
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleUpdate}
            disabled={!isValid || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCustomerDialog;
