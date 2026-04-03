"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PanelRightClose, 
  PanelRightOpen, 
  ShoppingCart, 
  Store,
  User,
  Clock,
  LayoutDashboard,
  Zap,
  ChevronRight,
  X
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

// POS Components
import ProductSection from "./product/ProductSection";
import CartSection from "./cart/CartSection";
import CartSummary from "./cart/CartSummary";
import CustomerPaymentSection from "./payment/CustomerPaymentSection";

// Dialogs
import PaymentDialog from "./payment/PaymentDialog";
import HeldOrdersDialog from "./components/HeldOrdersDialog";
import CustomerDialog from "./customer/CustomerDialog";
import InvoiceDialog from "./order/OrderDetails/InvoiceDialog";

import { useGetAllCustomersQuery } from "@/Redux Toolkit/features/customer/customerApi";

const CreateOrderPage = () => {
  const { toast } = useToast();
  const searchInputRef = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showHeldOrdersDialog, setShowHeldOrdersDialog] = useState(false);

  const { data: customers = [], isLoading, isError, error, refetch } = useGetAllCustomersQuery();
  const selectedCustomer = useSelector((state) => state.cart?.selectedCustomer);
  const cartItems = useSelector((state) => state.cart?.items || []);

  // Keyboard Shortcut Logic
  const handleKeyDown = useCallback((e) => {
    if (e.key === "F2") { e.preventDefault(); setShowCustomerDialog(true); }
    if (e.key === "F3") {
      e.preventDefault();
      if (selectedCustomer) setShowPaymentDialog(true);
      else toast({ title: "Select Customer", description: "Press F2 to assign a customer first.", variant: "destructive" });
    }
    if (e.key === "F4") { e.preventDefault(); setIsSidebarOpen((prev) => !prev); }
  }, [selectedCustomer, toast]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex h-screen w-full bg-[#f1f5f9] dark:bg-slate-950 overflow-hidden font-sans antialiased">
      
      {/* --- COLUMN A: PRODUCT CATALOG (MAIN) --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 shadow-sm z-0 relative">
        <header className="flex items-center justify-between px-4 lg:px-8 py-4 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3 lg:gap-5">
            <div className="bg-indigo-600 p-2 rounded-xl lg:p-2.5 lg:rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none">
              <Store className="h-4 w-4 lg:h-5 lg:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm lg:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none mb-1">Terminal Main</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Node: LK-01</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <Button 
              variant="outline" 
              className="hidden sm:flex gap-2 rounded-xl h-9 px-3 lg:h-10 lg:px-4 bg-slate-50/50 hover:bg-white"
              onClick={() => setShowHeldOrdersDialog(true)}
            >
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-[10px] lg:text-xs font-bold text-slate-600">Held Orders</span>
            </Button>

            <Separator orientation="vertical" className="hidden sm:block h-6" />

            {/* ALWAYS VISIBLE TOGGLE FOR MOBILE */}
            <Button 
              variant={isSidebarOpen ? "secondary" : "default"} 
              size="icon" 
              className="rounded-xl h-9 w-9 lg:h-10 lg:w-10 shadow-sm relative"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
              {!isSidebarOpen && cartItems.length > 0 && (
                 <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                   {cartItems.length}
                 </span>
              )}
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/40 dark:bg-transparent p-4 lg:p-8">
          <ProductSection searchInputRef={searchInputRef} />
        </div>
      </main>

      {/* --- COLUMN B: RESPONSIVE SIDEBAR (50% Desktop / 100% Mobile) --- */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            className={`
              fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900
              lg:relative lg:inset-auto lg:z-10 lg:w-1/2 lg:border-l lg:border-slate-200 
              lg:shadow-[-40px_0_70px_rgba(0,0,0,0.03)]
            `}
          >
            {/* SIDEBAR HEADER */}
            <div className="overflow-scroll h-16 px-6 flex items-center justify-between border-b bg-white dark:bg-slate-900 shrink-0">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                     <ShoppingCart className="h-3.5 w-3.5 text-indigo-600" />
                     <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Basket</span>
                     <Badge className="h-5 px-1.5 bg-indigo-600 rounded font-black text-[10px]">{cartItems.length}</Badge>
                  </div>
                  <ChevronRight className="hidden sm:block h-3 w-3 text-slate-300" />
                  <span className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-slate-400">Checkout</span>
               </div>
               
               {/* Mobile Close Button */}
               <Button variant="ghost" size="icon" className="lg:hidden rounded-full" onClick={() => setIsSidebarOpen(false)}>
                  <X className="h-5 w-5" />
               </Button>
               
               {/* Desktop ID */}
               <div className="hidden lg:block text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border">TRX_{Date.now().toString().slice(-6)}</div>
            </div>

            <div className="flex-1 flex min-h-0 overflow-y-auto">
              
              {/* 1. NAV RAIL (60px) - Hidden on smallest mobile */}
              

              {/* 2. ITEM LISTING (Main Cart Area) */}
              <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
                 <div className="flex-1 overflow-hidden">
                    <CartSection setShowHeldOrdersDialog={setShowHeldOrdersDialog} />
                 </div>
              </div>

              {/* 3. CHECKOUT & CUSTOMER (300px) - Responsive Stack on mobile */}
              <div className="hidden xl:flex w-[300px] flex-col bg-slate-50/30 dark:bg-slate-900/50">
                <div className="p-6 bg-white dark:bg-slate-900 border-b">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Customer Profile</h4>
                  {selectedCustomer ? (
                    <div className="group relative p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 transition-all hover:border-indigo-200">
                      <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-xs font-black text-slate-900 dark:text-white truncate uppercase tracking-tight leading-none mb-1.5">
                            {selectedCustomer.fullName || selectedCustomer.name}
                          </p>
                          <p className="text-[11px] font-bold text-slate-500 tabular-nums">
                            {selectedCustomer.phone || "No Phone"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full h-16 border-dashed border-2 rounded-2xl flex flex-col gap-2 hover:bg-indigo-50 hover:border-indigo-300 transition-all group"
                      onClick={() => setShowCustomerDialog(true)}
                    >
                      <User className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
                      <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-indigo-600">Assign (F2)</span>
                    </Button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto">
                  <CartSummary />
                </div>

                <div className="p-6 bg-white dark:bg-slate-900 border-t">
                  <CustomerPaymentSection 
                    setShowCustomerDialog={setShowCustomerDialog}
                    setShowPaymentDialog={setShowPaymentDialog}
                  />
                </div>
              </div>
            </div>

            {/* --- MOBILE/TABLET FOOTER (When 3-col 3rd-pane is hidden) --- */}
            <div className="xl:hidden flex flex-col border-t bg-white dark:bg-slate-900 p-4 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
               <div className="mb-4">
                 <CartSummary />
               </div>
               <CustomerPaymentSection 
                  setShowCustomerDialog={setShowCustomerDialog}
                  setShowPaymentDialog={setShowPaymentDialog}
               />
            </div>

          </motion.aside>
        )}
      </AnimatePresence>

      {/* DIALOGS */}
      <CustomerDialog showCustomerDialog={showCustomerDialog} setShowCustomerDialog={setShowCustomerDialog} customers={customers} loading={isLoading} refetchCustomers={refetch} />
      <PaymentDialog showPaymentDialog={showPaymentDialog} setShowPaymentDialog={setShowPaymentDialog} setShowReceiptDialog={setShowReceiptDialog} />
      <InvoiceDialog showInvoiceDialog={showReceiptDialog} setShowInvoiceDialog={setShowReceiptDialog} />
      <HeldOrdersDialog showHeldOrdersDialog={showHeldOrdersDialog} setShowHeldOrdersDialog={setShowHeldOrdersDialog} />
    </div>
  );
};

export default CreateOrderPage;