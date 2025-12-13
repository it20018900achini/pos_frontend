import React, { useEffect, useRef, useState } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";

import {
  selectCartItems,
  selectDiscount,
  selectNote,
  selectPaymentMethod,
  selectSelectedCustomer,
  selectTotal,
  setCurrentOrder,
  setPaymentMethod,
} from "@/Redux Toolkit/features/cart/cartSlice";

import { createOrder } from "@/Redux Toolkit/features/order/orderThunks";

const paymentMethods = [
  { key: "CASH", label: "Cash", icon: "💵", color: "from-indigo-500 to-emerald-600" },
  { key: "CARD", label: "Card", icon: "💳", color: "from-blue-500 to-indigo-600" },
  { key: "QR", label: "QR Pay", icon: "📱", color: "from-purple-500 to-fuchsia-600" },
  { key: "WALLET", label: "Wallet", icon: "🪙", color: "from-amber-500 to-yellow-600" },
  { key: "SPLIT", label: "Split Pay", icon: "➗", color: "from-cyan-500 to-teal-600" },
];

const PaymentDialog = ({ showPaymentDialog, setShowPaymentDialog, setShowReceiptDialog }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const total = useSelector(selectTotal);
  const discount = useSelector(selectDiscount);
  const paymentMethod = useSelector(selectPaymentMethod);
  const cart = useSelector(selectCartItems);
  const branch = useSelector((state) => state.branch);
  const { userProfile } = useSelector((state) => state.user);
  const selectedCustomer = useSelector(selectSelectedCustomer);
  const note = useSelector(selectNote);

  const [cashAmount, setCashAmount] = useState(total);
  const [givenAmount, setGivenAmount] = useState(total);
  const [loading, setLoading] = useState(false);

  const givenRef = useRef(null);

  useEffect(() => {
    if (showPaymentDialog) {
      setCashAmount(total);
      setGivenAmount(total);
      dispatch(setPaymentMethod("CASH"));

      setTimeout(() => {
        givenRef.current?.focus();
        givenRef.current?.select();
      }, 100);
    }
  }, [showPaymentDialog, total, dispatch]);

  const credit = Math.max(total - cashAmount, 0);
  const changeDue = Math.max(givenAmount - cashAmount, 0);

  // ✅ Print POS receipt function
  const printPOSReceipt = (order) => {
    const printWindow = window.open("", "Print", "width=300,height=600");
    printWindow.document.write(`<html><head><title>Receipt</title></head><body style="font-family: monospace; font-size:12px; line-height:1.2;">`);
    printWindow.document.write(`<h3 style="text-align:center;">Store Name</h3>`);
    printWindow.document.write(`<p>Order #${order.id}</p>`);
    printWindow.document.write(`<p>Customer: ${order.customer?.fullName || 'Walk-in'}</p>`);
    printWindow.document.write(`<hr>`);
    order.items.forEach(item => {
      printWindow.document.write(`<p>${item?.product?.name} x${item.quantity} - LKR ${item.price.toFixed(2)}</p>`);
    });
    printWindow.document.write(`<hr>`);
    printWindow.document.write(`<p>Total: LKR ${order.totalAmount.toFixed(2)}</p>`);
    printWindow.document.write(`<p>Cash: LKR ${order.cash.toFixed(2)}</p>`);
    printWindow.document.write(`<p>Change: LKR ${order.changeDue.toFixed(2)}</p>`);
    printWindow.document.write(`<hr><p style="text-align:center;">Thank you!</p>`);
    printWindow.document.write(`</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const processPayment = async () => {
    if (!cart.length) {
      toast({ title: "Empty Cart", description: "Add items first.", variant: "destructive" });
      return;
    }

    if (!selectedCustomer) {
      toast({ title: "Customer Required", description: "Please select a customer.", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        cash: parseFloat(cashAmount.toFixed(2)),
        credit: parseFloat(credit.toFixed(2)),
        totalAmount: total,
        discount,
        branchId: branch.id,
        cashierId: userProfile.id,
        customer: selectedCustomer,
        items: cart.map((i) => ({
          productId: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          total: i.price * i.quantity,
        })),
        paymentType: paymentMethod,
        note: note || "",
        givenAmount: parseFloat(givenAmount.toFixed(2)),
        changeDue: parseFloat(changeDue.toFixed(2)),
      };

      const created = await dispatch(createOrder(orderData)).unwrap();
      dispatch(setCurrentOrder(created));

      // ✅ Print POS receipt immediately
      printPOSReceipt(created);

      setShowPaymentDialog(false);
      setShowReceiptDialog(true);

      toast({ title: "Payment Successful", description: `Order #${created.id} created.` });
    } catch (e) {
      toast({ title: "Failed", description: e?.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
      <DialogContent className="sm:max-w-[700px] h-[100vh] max-h-[95vh] w-[850px] p-0 overflow-hidden rounded-3xl shadow-2xl border border-white/40 bg-gradient-to-br from-slate-50 to-slate-200 backdrop-blur-xl flex flex-col">
        <DialogHeader className="px-8 py-2 border-b bg-white/50 backdrop-blur-md">
          <DialogTitle className="font-bold text-slate-800 flex items-center gap-3">
            <span className="text-3xl">🧾</span> Payment Summary
          </DialogTitle>
        </DialogHeader>

        <div className="flex overflow-hidden w-full">
          <div className="w-full p-8 py-4 border-r bg-white/40 backdrop-blur-lg flex flex-col overflow-y-auto">
            <div className="rounded-2xl p-2 bg-white shadow-inner border border-slate-200 text-center mb-6 flex-shrink-0">
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Total Amount</p>
              <div className="text-2xl font-extrabold mt-1 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                LKR {total.toFixed(2)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Cash Amount</label>
                <Input
                  type="number"
                  className="h-14 text-lg font-semibold rounded-xl border-slate-300 shadow-sm focus:ring-2 focus:ring-purple-500 transition"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                />
                <p className={`text-sm px-3 py-1 rounded-lg w-max font-bold ${credit > 0 ? "bg-red-200 text-red-700" : "bg-indigo-200 text-indigo-700"}`}>
                  Credit: LKR {credit.toFixed(2)}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Customer Paid</label>
                <Input
                  type="number"
                  ref={givenRef}
                  className="h-14 text-lg font-semibold rounded-xl border-slate-300 shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                  value={givenAmount}
                  onChange={(e) => setGivenAmount(parseFloat(e.target.value) || 0)}
                />
                <p className="text-sm px-3 py-1 rounded-lg w-max bg-blue-200 text-blue-700 font-bold">
                  Change: LKR {changeDue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 overflow-y-auto w-[400px]">
            <div className="sticky top-0 flex flex-col gap-5">
              <p className="text-slate-700 font-semibold text-sm">Payment Options</p>
              {paymentMethods.map((pm) => (
                <button
                  key={pm.key}
                  onClick={() => dispatch(setPaymentMethod(pm.key))}
                  className={`h-16 rounded-2xl flex items-center justify-between px-6 shadow transition-all hover:scale-[1.02] text-lg font-semibold ${
                    paymentMethod === pm.key
                      ? `bg-gradient-to-r ${pm.color} text-white shadow-xl`
                      : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-2xl">{pm.icon}</span>
                  <span>{pm.label}</span>
                </button>
              ))}
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
<Button  className="h-12 px-6 text-lg rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 shadow-xl" onClick={()=>setShowReceiptDialog(true)}>
  show / print
</Button>
          <Button
            onClick={processPayment}
            disabled={loading}
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
