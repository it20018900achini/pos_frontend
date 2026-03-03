"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { getAllBranchesByStore } from "@/Redux Toolkit/features/branch/branchThunks";

import {
  selectCartItems,
  selectDiscount,
  selectNote,
  selectSelectedCustomer,
  selectTotal,
  setCurrentOrder,
  resetOrder,
} from "@/Redux Toolkit/features/cart/cartSlice";

import { createOrder } from "@/Redux Toolkit/features/order/orderThunks";

const paymentMethodsList = [
  { key: "CASH", label: "Cash" },
  { key: "CREDIT", label: "Credit" },
  { key: "CARD", label: "Card" },
  { key: "BANK_TRANSFER", label: "Bank Transfer" },
  { key: "MOBILE_PAYMENT", label: "Mobile Pay" },
  { key: "CHEQUE", label: "Cheque" },
];

const PaymentDialog = ({
  showPaymentDialog,
  setShowPaymentDialog,
  setShowReceiptDialog,
}) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const cart = useSelector(selectCartItems);
  const total = useSelector(selectTotal);
  const discount = useSelector(selectDiscount);
  const note = useSelector(selectNote);
  const selectedCustomer = useSelector(selectSelectedCustomer);

  const { store } = useSelector((state) => state.store);
  const { userProfile , selectedBranchId} = useSelector((state) => state.user);
  const { branches, loading, error } = useSelector((state) => state.branch);

  const [errorMsg, setErrorMsg] = useState("");
  const [payments, setPayments] = useState([]);
  const [loadingMain, setLoadingMain] = useState(false);

  const givenRef = useRef(null);

  // ================= FETCH BRANCHES =================
  useEffect(() => {
    if (store?.id) {
      dispatch(
        getAllBranchesByStore({
          storeId: store.id,
          jwt: localStorage.getItem("jwt"),
        })
      );
    }
  }, [dispatch, store]);



  // ================= SAFE NUMBERS =================
  const safeTotal = Number(total || 0);

  const discountValue =
    typeof discount === "object"
      ? Number(discount?.value || 0)
      : Number(discount || 0);

  const netTotal = safeTotal - discountValue;

  const totalPaid = payments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );

  const changeDue = Math.max(totalPaid - netTotal, 0);
  const remaining = Math.max(netTotal - totalPaid, 0);

  // ================= INIT DEFAULT CASH =================
  useEffect(() => {
    if (!showPaymentDialog) return;

    setPayments([
      {
        id: Date.now(),
        paymentMethod: "CASH",
        amount: netTotal,
      },
    ]);

    setTimeout(() => {
      if (givenRef.current) {
        givenRef.current.focus();
        givenRef.current.select();
      }
    }, 100);
  }, [showPaymentDialog, netTotal]);

  // ================= AUTO HIDE ERROR =================
  useEffect(() => {
    if (!errorMsg) return;

    const timer = setTimeout(() => {
      setErrorMsg("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [errorMsg]);

  // ================= PROCESS PAYMENT =================
  const processPayment = useCallback(async () => {
    if (!cart.length)
      return toast({
        title: "Empty Cart",
        description: "Add items first",
        variant: "destructive",
      });

    if (!selectedCustomer)
      return toast({
        title: "Customer Required",
        description: "Select a customer",
        variant: "destructive",
      });

    const branchId =       selectedBranchId;

    if (!branchId)
      return toast({
        title: "Branch Required",
        description: "Select a branch",
        variant: "destructive",
      });

    if (!userProfile?.user?.id)
      return toast({
        title: "User Missing",
        description: "User not loaded",
        variant: "destructive",
      });

    if (totalPaid < netTotal)
      return toast({
        title: "Payment Incomplete",
        description: `Remaining: LKR ${(netTotal - totalPaid).toFixed(2)}`,
        variant: "destructive",
      });

    try {
      setLoadingMain(true);

      const orderData = {
        branchId: Number(branchId),
        cashierId: userProfile.user.id,
        customer: {
          id: selectedCustomer.id,
          name: selectedCustomer.name,
          phone: selectedCustomer.phone,
        },
        subtotal: safeTotal,
        discountAmount: discountValue,
        netAmount: netTotal,
        note: note,
        items: cart.map((i) => ({
          productId: i.productId,
          productVariantId: i.id,
          quantity: i.quantity,
          unitPrice: Number(i.price),
          totalPrice: Number(i.price * i.quantity),
        })),
        payments: payments.map((p) => ({
          paymentMethod: p.paymentMethod,
          amount: Number(p.amount),
        })),
        status: "PENDING",
      };

      const created = await dispatch(createOrder(orderData)).unwrap();

      dispatch(setCurrentOrder(created));
      dispatch(resetOrder());

      setShowPaymentDialog(false);
      setShowReceiptDialog(true);

      toast({
        title: "Payment Successful",
        description: `Order #${created.id} created`,
      });
    } catch (e) {
      const message =
        typeof e === "string"
          ? e
          : e?.message || "Something went wrong";

      setErrorMsg(message);

      toast({
        title: "Payment Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoadingMain(false);
    }
  }, [
    cart,
    selectedCustomer,
    payments,
    total,
    discount,
    userProfile,
    selectedBranchId,
    dispatch,
    toast,
    setShowPaymentDialog,
    setShowReceiptDialog,
  ]);

  return (
    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
      <DialogContent className="z-60 sm:max-w-[90%] w-[90%] max-h-[95vh] p-0 overflow-scroll rounded-3xl bg-gradient-to-br from-neutral-50 to-neutral-200 flex flex-col">
        <DialogHeader className="px-8 py-3 border-b bg-white/60">
          <DialogTitle className="text-xl font-bold">
            🧾 Payment Summary
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT – PAYMENTS */}
          <div className="w-[55%] p-8 py-4 border-r bg-white/50 overflow-y-auto">
            {/* Branch Selector */}
            <div className="flex items-center gap-2 mb-4">
              {selectedBranchId ? (
                <span className="w-4 h-4 bg-green-500 rounded-full"></span>
              ) : (
                <span className="w-4 h-4 bg-red-500 rounded-full"></span>
              )}

              
            </div>

            <div className="rounded-2xl p-3 bg-white text-center mb-6 shadow-inner">
              <p className="text-sm text-neutral-500 uppercase">
                Total Amount
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                LKR {netTotal.toFixed(2)}
              </p>
            </div>

            <p className="font-semibold mb-3">Payments</p>

            {payments.map((p, idx) => (
              <div key={p.id} className="flex w-full items-center gap-3 mb-3">
                <select
                  className="h-11 px-3 rounded-lg border"
                  value={p.paymentMethod}
                  onChange={(e) => {
                    const list = [...payments];
                    list[idx].paymentMethod = e.target.value;
                    setPayments(list);
                  }}
                >
                  {paymentMethodsList.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.label}
                    </option>
                  ))}
                </select>

                <Input
                  ref={idx === 0 ? givenRef : null}
                  type="number"
                  className="h-11 w-full"
                  value={p.amount}
                  onChange={(e) => {
                    const list = [...payments];
                    list[idx].amount = Number(e.target.value) || 0;
                    setPayments(list);
                  }}
                />

                {idx > 0 && (
                  <Button
                    variant="destructive"
                    className="h-11 w-11"
                    onClick={() =>
                      setPayments(payments.filter((_, i) => i !== idx))
                    }
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))}

            <Button
              variant="outline"
              className="mt-2"
              onClick={() =>
                setPayments([
                  ...payments,
                  {
                    id: Date.now(),
                    paymentMethod: "CASH",
                    amount: remaining,
                  },
                ])
              }
            >
              <Plus size={16} className="mr-2" /> Add Payment
            </Button>

            <div className="mt-4 text-sm font-semibold">
              <p>Total Paid: LKR {totalPaid.toFixed(2)}</p>
              <p>Remaining: LKR {remaining.toFixed(2)}</p>
              <p className="text-green-700">
                Change: LKR {changeDue.toFixed(2)}
              </p>
            </div>
          </div>

          {/* RIGHT – ITEMS */}
          <div className="w-[45%] p-6 bg-white/70 overflow-y-auto">
            <p className="font-semibold mb-4">Items</p>

            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-3 mb-3 border shadow-sm"
              >
                <p className="font-medium">
                  {item.product?.name || item.productVariant?.name}
                </p>
                <p className="text-xs text-neutral-500">
                  Qty: {item.quantity} × LKR{" "}
                  {Number(item.sellingPrice).toFixed(2)}
                </p>
                <p className="font-semibold mt-1">
                  LKR {(item.quantity * item.sellingPrice).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="border-t pt-4 mt-4 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>LKR {safeTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Discount</span>
                <span>- LKR {discountValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>LKR {netTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-8 py-4 bg-white/80 flex items-center">
          <div className="text-red-500 flex-1">{errorMsg}</div>

          <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
            Cancel
          </Button>

          <Button
            onClick={processPayment}
            disabled={loadingMain || totalPaid < netTotal}
            className="bg-indigo-600 text-white"
          >
            {loadingMain && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;