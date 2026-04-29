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
import { switchBranch } from "../../../Redux Toolkit/features/auth/authThunk";
import { setSelectedBranch } from "../../../Redux Toolkit/features/user/userSlice";

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
  onSuccess, 
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
  const [switchingBranch, setSwitchingBranch] = useState(false);

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

    const branchId = selectedBranchId;

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
      if (onSuccess) {
        onSuccess(); 
      }
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
    onSuccess,
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

  const [isVerifyingSession, setIsVerifyingSession] = useState(false);

  useEffect(() => {
    const validateBranchSession = async () => {
      if (!showPaymentDialog) return;
      const currentTokenBranchId = userProfile?.user?.branchId; 
      if (!currentTokenBranchId && selectedBranchId) {
        try {
          setIsVerifyingSession(true);
          await dispatch(switchBranch(selectedBranchId)).unwrap();
          toast({
            title: "Session Synced",
            description: "Branch context updated for payment.",
          });
        } catch (err) {
          setErrorMsg("Failed to synchronize branch session.");
        } finally {
          setIsVerifyingSession(false);
        }
      }
    };
    validateBranchSession();
  }, [showPaymentDialog, selectedBranchId, userProfile, dispatch, toast]);

  return (
    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
      <DialogContent className="z-60 sm:max-w-[90%] w-[90%] max-h-[95vh] p-0 overflow-scroll rounded-3xl bg-neutral-50 dark:bg-neutral-950 flex flex-col border-neutral-200 dark:border-neutral-800">
        <DialogHeader className="px-8 py-3 border-b dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md">
          <DialogTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            🧾 Payment Summary
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          {/* LEFT – PAYMENTS */}
          <div className="md:w-[55%] p-8 py-4 border-r dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/30 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              {selectedBranchId ? (
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              ) : (
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              )}
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Branch Session Active
              </span>
            </div>

            <div className="rounded-2xl p-4 bg-white dark:bg-neutral-900 text-center mb-6 shadow-sm border dark:border-neutral-800">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-1">
                Total Amount
              </p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                LKR {netTotal.toFixed(2)}
              </p>
            </div>

            <p className="font-semibold mb-3 text-neutral-900 dark:text-neutral-100">Payments</p>

            <div className="space-y-3">
              {payments.map((p, idx) => (
                <div key={p.id} className="flex w-full items-center gap-3">
                  <select
                    className="h-11 px-3 rounded-lg border dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-indigo-500 outline-none"
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
                    className="h-11 w-full dark:bg-neutral-900 dark:border-neutral-800"
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
                      className="h-11 w-11 shrink-0"
                      onClick={() =>
                        setPayments(payments.filter((_, i) => i !== idx))
                      }
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="mt-4 dark:border-neutral-800 dark:hover:bg-neutral-800"
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

            <div className="mt-6 p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900/50 border dark:border-neutral-800 text-sm font-semibold space-y-2">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Total Paid:</span>
                <span>LKR {totalPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Remaining:</span>
                <span>LKR {remaining.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-700 dark:text-green-400 border-t dark:border-neutral-800 pt-2 text-base">
                <span>Change Due:</span>
                <span>LKR {changeDue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* RIGHT – ITEMS */}
          <div className="md:w-[45%] p-6 bg-white/70 dark:bg-neutral-950/40 overflow-y-auto">
            <p className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100 uppercase text-xs tracking-widest">
              Cart Items ({cart.length})
            </p>

            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-neutral-900 rounded-xl p-3 border border-neutral-100 dark:border-neutral-800 shadow-sm flex gap-3 items-center"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-neutral-100 dark:border-neutral-800 flex-shrink-0 bg-neutral-50 dark:bg-neutral-800">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-product.png";
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-sm text-neutral-800 dark:text-neutral-200 truncate">
                        {item.name}
                      </p>
                      <p className="font-bold text-sm text-indigo-600 dark:text-indigo-400 ml-2">
                        LKR {(item.quantity * item.sellingPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-tight">
                        {item.quantity} × LKR {Number(item.sellingPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t dark:border-neutral-800 pt-4 mt-6 text-sm space-y-2">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Subtotal</span>
                <span>LKR {safeTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span>Discount</span>
                <span>- LKR {discountValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-neutral-900 dark:text-neutral-100 pt-2">
                <span>Total</span>
                <span>LKR {netTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-8 py-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-t dark:border-neutral-800 flex items-center">
          <div className="text-red-500 dark:text-red-400 text-sm flex-1 font-medium">{errorMsg}</div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowPaymentDialog(false)}
              className="dark:border-neutral-800 dark:hover:bg-neutral-800"
            >
              Cancel
            </Button>

            <Button
              onClick={processPayment}
              disabled={loadingMain || totalPaid < netTotal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {loadingMain && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Confirm Payment
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;