import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";

import { createRefund } from "@/Redux Toolkit/features/refund/refundThunks";
import { setCurrentOrder, setPaymentMethod } from "@/Redux Toolkit/features/cart/cartSlice";

import Todo from "./returnComponents/Todo";
import OrderInformation from "./OrderInformation";
import CustomerInformation from "./CustomerInformation";

const ReturnMode = ({ showPaymentDialog, setShowPaymentDialog, selectedOrder }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);

  // Payment states
  const [paymentType, setPaymentType] = useState("CASH");
  const [cash, setCash] = useState(0);
  const [credit, setCredit] = useState(0);
  const [errors, setErrors] = useState({ cash: "", credit: "", totalMismatch: "" });

  const cashRef = useRef(null);
  const creditRef = useRef(null);

  // Total refund amount
  const totalAmount = useMemo(
    () => todos.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0),
    [todos]
  );

  // Sync todos when selected order changes
  useEffect(() => {
    if (!selectedOrder?.items) {
      setTodos([]);
      return;
    }
    setTodos(
      selectedOrder.items.map((item) => ({
        id: item.product?.id || item.id,
        quantity: item.quantity,
        name: item.product?.name,
        sellingPrice: item.product?.sellingPrice,
      }))
    );
  }, [selectedOrder]);

  // Reset todos
  const resetTodos = () => {
    if (!selectedOrder?.items) return;
    setTodos(
      selectedOrder.items.map((item) => ({
        id: item.product?.id || item.id,
        quantity: item.quantity,
        name: item.product?.name,
        sellingPrice: item.product?.sellingPrice,
      }))
    );
  };

  // Update todo quantity
  const updateTodo = (id, updatedQuantity) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, quantity: updatedQuantity } : todo))
    );
  };

  // Remove todo item
  const removeTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // Utility: clean number, no negative, 2 decimals
  const clean = (val) => {
    const num = Number(val) || 0;
    return Math.max(0, Number(num.toFixed(2)));
  };

  // Auto-set fields when paymentType changes
  useEffect(() => {
    if (paymentType === "CASH") {
      setCash(totalAmount);
      setCredit(0);
      setTimeout(() => cashRef.current?.focus(), 50);
    }
    if (paymentType === "CREDIT") {
      setCash(0);
      setCredit(totalAmount);
      setTimeout(() => creditRef.current?.focus(), 50);
    }
    if (paymentType === "MIX") {
      setCash(totalAmount);
      setCredit(0);
      setTimeout(() => cashRef.current?.focus(), 50);
    }
  }, [paymentType, totalAmount]);

  // Validate inputs
  useEffect(() => {
    let newErrors = { cash: "", credit: "", totalMismatch: "" };
    if (cash < 0) newErrors.cash = "Cash cannot be negative";
    if (credit < 0) newErrors.credit = "Credit cannot be negative";
    if (paymentType === "MIX" && (cash + credit).toFixed(2) !== totalAmount.toFixed(2)) {
      newErrors.totalMismatch = `Cash + Credit must equal total Rs ${totalAmount.toFixed(2)}`;
    }
    setErrors(newErrors);
  }, [cash, credit, paymentType, totalAmount]);

  // Handlers
  const handleCashChange = (val) => {
    const newCash = clean(val);
    setCash(newCash);
    if (paymentType === "MIX") {
      const remaining = totalAmount - newCash;
      setCredit(clean(remaining));
    }
  };

  const handleCreditChange = (val) => {
    const newCredit = clean(val);
    setCredit(newCredit);
    if (paymentType === "MIX") {
      const remaining = totalAmount - newCredit;
      setCash(clean(remaining));
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (field === "paymentType") {
        if (paymentType === "CASH") cashRef.current?.focus();
        else if (paymentType === "CREDIT") creditRef.current?.focus();
        else cashRef.current?.focus();
      } else if (field === "cash") {
        if (paymentType === "MIX") creditRef.current?.focus();
        else !errors.cash && processPayment();
      } else if (field === "credit") {
        if (paymentType === "MIX") cashRef.current?.focus();
        else !errors.credit && processPayment();
      }
    } else if (e.key === "Escape") {
      setShowPaymentDialog(false);
    }
  };

  // Process refund
  const processPayment = async () => {
    if (!selectedOrder) return;

    try {
      setLoading(true);

      const orderData = {
        cash,
        credit,
        totalAmount,
        paymentType,
        cashierId: 13,
        orderId: selectedOrder.id,
        customer: selectedOrder.customer,
        items: todos.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          total: item.sellingPrice * item.quantity,
        })),
        note: "",
      };

      const createdRefund = await dispatch(createRefund(orderData)).unwrap();
      dispatch(setCurrentOrder(createdRefund));
      setShowPaymentDialog(false);

      toast({
        title: "Refund Created Successfully",
        description: `Refund #${createdRefund.id} created successfully`,
      });
    } catch (error) {
      console.error("Refund error:", error);
      toast({
        title: "Refund Creation Failed",
        description: error?.message || "Failed to create refund. Try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={showPaymentDialog}
      onOpenChange={(open) => {
        setShowPaymentDialog(open);
        dispatch(setPaymentMethod("CASH"));
      }}
    >
      <DialogContent className="max-h-screen overflow-y-scroll ">
        <DialogHeader>
          <DialogTitle>Refund</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <OrderInformation selectedOrder={selectedOrder} />
          <CustomerInformation selectedOrder={selectedOrder} />
        </div>

        <div className="flex justify-end mb-2">
          <Button onClick={resetTodos}>RESET</Button>
        </div>

        {/* Refund items */}
        <ul className="border ">
          {todos.map((todo) => {
            const itemTotal = todo.sellingPrice * todo.quantity;
            return (
              <div key={todo.id} className="flex justify-between items-center border-b py-2">
                <Todo todo={todo} updateTodo={updateTodo} removeTodo={removeTodo} />
                <div className="font-semibold w-24 text-right">Rs. {itemTotal.toFixed(2)}</div>
              </div>
            );
          })}
        </ul>

        {/* Whole Total */}
        <div className="flex justify-between bg-gray-100 rounded mt-3 text-lg font-semibold">
          <span>Total Refund Amount:</span>
          <span>Rs. {totalAmount.toFixed(2)}</span>
        </div>

        {/* Payment Section */}
        <div className="border rounded-lg space-y-5 mt-4">
          {/* Payment Type */}
          <div className="space-y-2">
            <label className="font-medium">Payment Type</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "paymentType")}
              className="border p-2 rounded-md"
            >
              <option value="CASH">Cash</option>
              <option value="CREDIT">Credit</option>
              <option value="MIX">Mixed</option>
            </select>
          </div>

          {/* Cash */}
          <div className="space-y-1">
            <label className="font-medium">Cash Amount</label>
            <input
              ref={cashRef}
              type="number"
              value={cash}
              disabled={paymentType === "CREDIT"}
              onChange={(e) => handleCashChange(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "cash")}
              className={`border rounded-md p-2 ${errors.cash ? "border-red-500" : ""} disabled:bg-gray-200`}
            />
            {errors.cash && <p className="text-red-500 text-sm">{errors.cash}</p>}
          </div>

          {/* Credit */}
          <div className="space-y-1">
            <label className="font-medium">Credit Amount</label>
            <input
              ref={creditRef}
              type="number"
              value={credit}
              disabled={paymentType === "CASH"}
              onChange={(e) => handleCreditChange(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "credit")}
              className={`border rounded-md p-2 ${errors.credit ? "border-red-500" : ""} disabled:bg-gray-200`}
            />
            {errors.credit && <p className="text-red-500 text-sm">{errors.credit}</p>}
          </div>

          {/* Total mismatch error */}
          {errors.totalMismatch && <p className="text-red-500 text-sm">{errors.totalMismatch}</p>}
        </div>

        {/* Footer */}
        <DialogFooter className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={processPayment}
            disabled={
              loading ||
              errors.cash !== "" ||
              errors.credit !== "" ||
              errors.totalMismatch !== ""
            }
          >
            {loading ? "Processing..." : "Complete Refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnMode;
