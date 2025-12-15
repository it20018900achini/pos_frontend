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
import { useSelector } from "react-redux";
// import {  useSelector } from "react-redux";
// import { getCustomerSummaryById } from "../../../../../../Redux Toolkit/features/customerSummary/customerSummaryThunks";

export default function CustomerPaymentForm({
  initialData,
  onSave,
  onCancel,
  customer,
  user
}) {
  const { userProfile } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    customerId: customer?.id,
    cashierId:userProfile?.id,
    amount: "",
    paymentMethod: "CASH",
    reference: "",
    note: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  // Fill form when editing
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setIsOpen(true);
    }
  }, [initialData]);

  // Fetch user profile
  // useEffect(() => {
  //   const jwt = localStorage.getItem("jwt");
  //   if (jwt && !userProfile) dispatch(getUserProfile(jwt));
  //    setUserData(res.user);
  // }, [dispatch, userProfile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    resetForm();

// dispatch(getCustomerSummaryById(customerId))
//  const dispatch = useDispatch();
  // const { summary, loading, error } = useSelector(
  //   (state) => state.customerSummary
  // );

  };

  const resetForm = () => {
    setForm({
      customerId: customer?.id,
      cashierId: userProfile?.id,
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
        <div className="flex justify-end">    <Button onClick={() => setIsOpen(true)} className="mb-4">
          Add Payment
        </Button></div>
        
        
    
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[100vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit Payment" : "Add Payment"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            
              <Input
                type="number"
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                required
                className="hidden"
              />
              <Input
                type="number"
                value={form.cashierId}
                onChange={(e) => setForm({ ...form, cashierId: e.target.value })}
                required
                                className="hidden"

              />
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
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
              {/* <Input
                type="text"
              /> */}
              <textarea className="border w-full" 
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}></textarea>
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
