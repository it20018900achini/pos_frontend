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
  { key: "CASH", label: "Cash", icon: "💵" },
  { key: "CARD", label: "Card", icon: "💳" },
  { key: "QR", label: "QR Pay", icon: "📱" },
  { key: "WALLET", label: "Wallet", icon: "🪙" },
];

const PaymentDialog = ({ showPaymentDialog, setShowPaymentDialog, setShowReceiptDialog }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const cart = useSelector(selectCartItems);
  const total = useSelector(selectTotal);
  const discount = useSelector(selectDiscount);
  const note = useSelector(selectNote);
  const selectedCustomer = useSelector(selectSelectedCustomer);
  const branch = useSelector((state) => state.branch);
  const { userProfile } = useSelector((state) => state.user);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const givenRef = useRef(null);

  // ---------------- INIT DEFAULT CASH ----------------
  useEffect(() => {
    if (!showPaymentDialog) return;

    setPayments([
      {
        id: Date.now(),
        paymentMethod: "CASH",
        amount: Number(total || 0),
      },
    ]);

    setTimeout(() => {
      givenRef.current?.focus();
      givenRef.current?.select();
    }, 100);
  }, [showPaymentDialog, total]);

  const totalPaid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const changeDue = Math.max(totalPaid - total, 0);
  const remaining = Math.max(total - totalPaid, 0);

  // ---------------- PRINT RECEIPT ----------------
  const printPOSReceipt = useCallback(
    (order) => {
      const printWindow = window.open("", "Print", "width=380,height=700");
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: monospace; font-size: 12px; padding: 10px; }
              .center { text-align: center; }
              .item { display: flex; justify-content: space-between; }
              .bold { font-weight: bold; }
              hr { border-top: 1px dashed #000; margin: 5px 0; }
            </style>
          </head>
          <body>
            <p class="center bold">🧾 RECEIPT</p>
            <p>Order #: ${order.id}</p>
            <p>Customer: ${order.customer?.name || "Walk-in"}</p>
            <hr />
            ${order.items
              .map(
                (i) => `
              <div class="item">
                <span>${i.product?.name || i.productVariant?.name} x${i.quantity}</span>
                <span>LKR ${Number(i.price).toFixed(2)}</span>
              </div>
            `
              )
              .join("")}
            <hr />
            <div class="item bold">
              <span>Subtotal</span>
              <span>LKR ${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div class="item">
              <span>Discount</span>
              <span>LKR ${Number(order.discountAmount || 0).toFixed(2)}</span>
            </div>
            <div class="item bold">
              <span>Total</span>
              <span>LKR ${Number(order.netAmount).toFixed(2)}</span>
            </div>
            ${order.payments
              .map(
                (p) => `
              <div class="item">
                <span>${p.paymentMethod}</span>
                <span>LKR ${Number(p.amount).toFixed(2)}</span>
              </div>
            `
              )
              .join("")}
            <div class="item">
              <span>Change</span>
              <span>LKR ${Number(changeDue).toFixed(2)}</span>
            </div>
            <hr />
            <p class="center">Thank you!</p>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    },
    [changeDue]
  );

  // ---------------- PROCESS PAYMENT ----------------
  const processPayment = useCallback(async () => {
    if (!cart.length)
      return toast({ title: "Empty Cart", description: "Add items first", variant: "destructive" });
    if (!selectedCustomer)
      return toast({ title: "Customer Required", description: "Select a customer", variant: "destructive" });

    if (totalPaid < total)
      return toast({
        title: "Payment Incomplete",
        description: `Remaining: LKR ${remaining.toFixed(2)}`,
        variant: "destructive",
      });

    try {
      setLoading(true);

      const orderData = {
        branchId: branch.id,
        cashierId: userProfile.id,
        customer: {
          id: selectedCustomer.id,
          name: selectedCustomer.name,
          phone: selectedCustomer.phone,
        },
        subtotal: Number(total || 0),
        discountAmount: Number(discount || 0),
        netAmount: Number(total - (discount || 0)),
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
      printPOSReceipt(created);
      dispatch(resetOrder());
      setShowPaymentDialog(false);
      setShowReceiptDialog(true);

      toast({ title: "Payment Successful", description: `Order #${created.id} created` });
    } catch (e) {
      toast({ title: "Payment Failed", description: e?.message || "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [cart, selectedCustomer, payments, total, discount, totalPaid, remaining, branch.id, userProfile.id, dispatch, printPOSReceipt, toast, setShowPaymentDialog, setShowReceiptDialog]);

  return (
    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
      <DialogContent className="sm:max-w-[700px] max-h-[95vh] w-[850px] p-0 overflow-hidden rounded-3xl shadow-2xl border border-white/40 bg-gradient-to-br from-slate-50 to-slate-200 backdrop-blur-xl flex flex-col">
        <DialogHeader className="px-8 py-2 border-b bg-white/50 backdrop-blur-md">
          <DialogTitle className="font-bold text-slate-800 flex items-center gap-3">
            <span className="text-3xl">🧾</span> Payment Summary
          </DialogTitle>
        </DialogHeader>

        <div className="flex overflow-hidden w-full">
          {/* Left Panel */}
          <div className="w-full p-8 py-4 border-r bg-white/40 backdrop-blur-lg flex flex-col overflow-y-auto">
            <div className="rounded-2xl p-2 bg-white shadow-inner border border-slate-200 text-center mb-6 flex-shrink-0">
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Total Amount</p>
              <div className="text-2xl font-extrabold mt-1 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                LKR {Number(total || 0).toFixed(2)}
              </div>
            </div>

            <div className="space-y-4">
              <p className="font-semibold">Payments</p>
              {payments.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-3">
                  <select
                    className="h-12 px-3 rounded-lg border border-slate-300"
                    value={p.paymentMethod}
                    onChange={(e) => {
                      const newPayments = [...payments];
                      newPayments[idx].paymentMethod = e.target.value;
                      setPayments(newPayments);
                    }}
                  >
                    {paymentMethodsList.map((m) => (
                      <option key={m.key} value={m.key}>
                        {m.label}
                      </option>
                    ))}
                  </select>

                  <Input
                    type="number"
                    className="h-12 w-32"
                    value={p.amount}
                    onChange={(e) => {
                      const newPayments = [...payments];
                      newPayments[idx].amount = Number(e.target.value) || 0;
                      setPayments(newPayments);
                    }}
                  />

                  {idx > 0 && (
                    <Button
                      variant="destructive"
                      onClick={() => setPayments(payments.filter((_, i) => i !== idx))}
                      className="h-12 w-12 flex items-center justify-center"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                onClick={() =>
                  setPayments([...payments, { id: Date.now(), paymentMethod: "CASH", amount: remaining }])
                }
                className="mt-2 h-10 flex items-center gap-2"
              >
                <Plus size={16} /> Add Payment
              </Button>

              <p className="text-sm font-bold">
                Total Paid: LKR {totalPaid.toFixed(2)} | Remaining: LKR {remaining.toFixed(2)}
              </p>
              <p className="text-sm font-bold text-green-700">Change: LKR {changeDue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-white/70 backdrop-blur-md px-8 py-5 flex justify-end gap-4 flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => setShowPaymentDialog(false)}
            className="h-12 px-6 text-lg rounded-xl border-slate-300 hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            onClick={processPayment}
            disabled={loading || totalPaid < total}
            className="h-12 px-6 text-lg rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 shadow-xl"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
            {loading ? "Processing…" : "Confirm Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
