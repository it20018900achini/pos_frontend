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
import { getFlattenedRefundSummaryWithTotals } from "../getFlattenedRefundSummaryWithTotals";

const ReturnMode = ({ showPaymentDialog, setShowPaymentDialog, selectedOrder }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // --------------------- TRANSFORM & PREPARE PRODUCTS ---------------------
  const transformProducts = (products) =>
    products.map((item) => ({
      id: item.productId,
      quantity: item.availableStock,
      name: item.productName,
      sellingPrice: item.price,
    }));

  const availableItems = useMemo(() => {
    if (!selectedOrder) return [];
    const data = getFlattenedRefundSummaryWithTotals(selectedOrder);
    return transformProducts(data?.products || []);
  }, [selectedOrder]);

  // --------------------- STATE ---------------------
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);

  const [paymentType, setPaymentType] = useState("CASH");
  const [cash, setCash] = useState(0);
  const [credit, setCredit] = useState(0);

  const [errors, setErrors] = useState({
    cash: "",
    credit: "",
    totalMismatch: "",
  });

  const cashRef = useRef(null);
  const creditRef = useRef(null);

  // --------------------- TOTAL AMOUNT ---------------------
  const totalAmount = useMemo(
    () => todos.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0),
    [todos]
  );

  // --------------------- WHEN ORDER CHANGES ---------------------
  useEffect(() => {
    if (!selectedOrder) return;
    setTodos(availableItems);
  }, [selectedOrder, availableItems]);

  // --------------------- RESET BUTTON ---------------------
  const resetTodos = () => {
    setTodos(availableItems);
  };

  // --------------------- UPDATE ITEM ---------------------
  const updateTodo = (id, updatedQuantity) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, quantity: updatedQuantity } : todo))
    );
  };

  const removeTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // --------------------- CLEAN NUMBER ---------------------
  const clean = (val) => {
    const num = Number(val) || 0;
    return Math.max(0, Number(num.toFixed(2)));
  };

  // --------------------- AUTO SET PAYMENT INPUTS ---------------------
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

  // --------------------- VALIDATION ---------------------
  useEffect(() => {
    let newErrors = { cash: "", credit: "", totalMismatch: "" };

    if (cash < 0) newErrors.cash = "Cash cannot be negative";
    if (credit < 0) newErrors.credit = "Credit cannot be negative";

    if (paymentType === "MIX" && (cash + credit).toFixed(2) !== totalAmount.toFixed(2)) {
      newErrors.totalMismatch = `Cash + Credit must equal total Rs ${totalAmount.toFixed(2)}`;
    }

    setErrors(newErrors);
  }, [cash, credit, paymentType, totalAmount]);

  // --------------------- PAYMENT HANDLERS ---------------------
  const handleCashChange = (val) => {
    const newCash = clean(val);
    setCash(newCash);

    if (paymentType === "MIX") {
      setCredit(clean(totalAmount - newCash));
    }
  };

  const handleCreditChange = (val) => {
    const newCredit = clean(val);
    setCredit(newCredit);

    if (paymentType === "MIX") {
      setCash(clean(totalAmount - newCredit));
    }
  };

  // --------------------- KEYBOARD FLOW ---------------------
  const handleKeyDown = (e, field) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (field === "paymentType") {
        if (paymentType === "CASH") cashRef.current?.focus();
        else if (paymentType === "CREDIT") creditRef.current?.focus();
        else cashRef.current?.focus();
      }

      if (field === "cash") {
        if (paymentType === "MIX") creditRef.current?.focus();
        else !errors.cash && processPayment();
      }

      if (field === "credit") {
        if (paymentType === "MIX") cashRef.current?.focus();
        else !errors.credit && processPayment();
      }
    }

    if (e.key === "Escape") {
      setShowPaymentDialog(false);
    }
  };

  // --------------------- API SUBMIT ---------------------
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
        items: todos.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
          total: i.sellingPrice * i.quantity,
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
      toast({
        title: "Refund Failed",
        description: error?.message || "Failed to create refund",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // --------------------- UI ---------------------
  return (
    <Dialog
      open={showPaymentDialog}
      onOpenChange={(open) => {
        setShowPaymentDialog(open);
        dispatch(setPaymentMethod("CASH"));
      }}
    >
      <DialogContent className="max-h-screen overflow-y-auto overflow-x-hidden">
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

        <ul className="border">
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

        <div className="flex justify-between bg-gray-100 rounded mt-3 text-lg font-semibold">
          <span>Total Refund Amount:</span>
          <span>Rs. {totalAmount.toFixed(2)}</span>
        </div>

        {/* PAYMENT */}
        <div className="border rounded-lg space-y-5 mt-4 p-3">
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

          <div className="space-y-1">
            <label className="font-medium">Cash Amount</label>
            <input
              ref={cashRef}
              type="number"
              value={cash}
              disabled={paymentType === "CREDIT"}
              onChange={(e) => handleCashChange(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "cash")}
              className={`border p-2 rounded-md ${
                errors.cash ? "border-red-500" : ""
              } disabled:bg-gray-200`}
            />
            {errors.cash && <p className="text-red-500 text-sm">{errors.cash}</p>}
          </div>

          <div className="space-y-1">
            <label className="font-medium">Credit Amount</label>
            <input
              ref={creditRef}
              type="number"
              value={credit}
              disabled={paymentType === "CASH"}
              onChange={(e) => handleCreditChange(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "credit")}
              className={`border p-2 rounded-md ${
                errors.credit ? "border-red-500" : ""
              } disabled:bg-gray-200`}
            />
            {errors.credit && <p className="text-red-500 text-sm">{errors.credit}</p>}
          </div>

          {errors.totalMismatch && (
            <p className="text-red-500 text-sm">{errors.totalMismatch}</p>
          )}
        </div>

        <DialogFooter className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={processPayment}
            disabled={loading || errors.cash || errors.credit || errors.totalMismatch}
          >
            {loading ? "Processing..." : "Complete Refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnMode;
