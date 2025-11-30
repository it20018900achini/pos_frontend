import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function CustomerPaymentForm({
  initialData,
  onSave,
  onCancel,
  customer,
  user,
}) {
  const [form, setForm] = useState({
    customerId: customer?.customer?.id || "",
    cashierId: user?.id || "",
    amount: "",
    paymentMethod: "CASH",
    reference: "",
    note: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  // Fill form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        customerId: initialData.customerId || customer?.customer?.id,
        cashierId: initialData.cashierId || user?.id,
      });
      setIsOpen(true);
    }
  }, [initialData, customer, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      customerId: customer?.customer?.id || "",
      cashierId: user?.id || "",
      amount: "",
      paymentMethod: "CASH",
      reference: "",
      note: "",
    });
    setIsOpen(false);
    onCancel?.();
  };

  return (
    <>
      {!initialData && (
        <div className="flex justify-end">
          <Button onClick={() => setIsOpen(true)} className="mb-4">
            Add Payment
          </Button>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit Payment" : "Add Payment"}
            </DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Hidden IDs using type="hidden" to avoid browser errors */}
            <input type="hidden" value={form.customerId} name="customerId" />
            <input type="hidden" value={form.cashierId} name="cashierId" />

            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                min={0}
              />
            </div>

            <div>
              <Label>Payment Method</Label>
              <Select
                value={form.paymentMethod}
                onValueChange={(val) =>
                  setForm({ ...form, paymentMethod: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="ONLINE">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Reference</Label>
              <Input
                type="text"
                value={form.reference}
                onChange={(e) => setForm({ ...form, reference: e.target.value })}
              />
            </div>

            <div>
              <Label>Note</Label>
              <textarea
                className="border w-full p-2 rounded"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
