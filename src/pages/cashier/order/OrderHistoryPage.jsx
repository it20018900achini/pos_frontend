import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

import { SearchIcon, Loader2, RefreshCw, Download, PrinterIcon } from "lucide-react";

import POSHeader from "../components/POSHeader";
import OrderTable from "./OrderTable";
import OrderDetails from "./OrderDetails/OrderDetails";

import { getOrdersByCashier } from "@/Redux Toolkit/features/order/orderThunks";
import { handleDownloadOrderPDF } from "./pdf/pdfUtils";

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { userProfile } = useSelector((state) => state.user);
  const { orders, pageInfo, loading, error } = useSelector((state) => state.order);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchText, setSearchText] = useState("");

  const loadOrders = (start = startDate, end = endDate, search = searchText) => {
    if (!userProfile?.id) return;

    const startISO = start ? new Date(start).toISOString() : undefined;
    const endISO = end ? new Date(end).toISOString() : undefined;

    dispatch(
      getOrdersByCashier({
        cashierId: userProfile.id,
        page,
        size,
        sort: "id,desc",
        start: startISO,
        end: endISO,
        search: search || undefined,
      })
    );
  };

  useEffect(() => {
    loadOrders();
  }, [userProfile, page, size]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error Loading Orders",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsDialog(true);
  };

  // Ultra-compact thermal receipt printing
  const handlePrintInvoice = (order, storeName = "STORE NAME", storeLogoUrl) => {
    if (!order) return;

    const printWindow = window.open("", "_blank", "width=300,height=600");
    if (!printWindow) return;

    const formatCurrency = (amount) => Number(amount).toFixed(2);
    const totalAmount = order.items.reduce(
      (sum, item) => sum + (item.product?.sellingPrice || 0) * item.quantity,
      0
    );
    const cashPaid = Number(order.cash || 0);
    const creditPaid = Number(order.credit || 0);
    const changeDue = Math.max(cashPaid + creditPaid - totalAmount, 0);
    const notes = order.note || "";
    const barcodeUrl = `https://chart.googleapis.com/chart?cht=code128&chs=200x50&chl=${order.id}`;

    const truncate = (str, max = 20) => (str.length > max ? str.slice(0, max - 3) + "..." : str);

    const fontSize = order.items.length > 15 ? 8 : 10;

    const htmlContent = `
      <html>
        <head>
          <title>Receipt #${order.id}</title>
          <style>
            body { font-family: monospace; font-size: ${fontSize}px; padding:2px; width:200px; line-height:1.1; white-space:pre-wrap; }
            @media print { @page { margin:0.15in; size:58mm auto; } body{ margin:0; } }
            p, th, td, .line, .center, .right { margin:0; padding:0; }
            .center { text-align:center; }
            .right { text-align:right; }
            .line { border-top:1px dashed #000; margin:2px 0; }
            table { width:100%; border-collapse:collapse; }
            th, td { padding:1px 0; vertical-align:top; }
            td.item { max-width:100px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
            img.barcode, img.logo { display:block; margin:3px auto; }
          </style>
        </head>
        <body>
          <div  className="center">
            ${storeLogoUrl ? `<img  className="logo" src="${storeLogoUrl}" width="80" />` : ""}
            <p style="font-weight:bold;">${storeName}</p>
            <p style="margin-top:2px;">Invoice #${order.id}</p>
            <p style="margin-top:2px;">${new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <p>Customer: ${order.customer?.name || "Walk-in"}</p>
          <div  className="line"></div>

          <table>
            <thead>
              <tr><th>Item</th><th>Qty</th><th  className="right">Total</th></tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td  className="item">${truncate(item.product?.name || item.name)}</td>
                  <td>${item.quantity}</td>
                  <td  className="right">${formatCurrency((item.product?.sellingPrice || 0) * item.quantity)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div  className="line"></div>
          <p  className="right">TOTAL: ${formatCurrency(totalAmount)}</p>
          <p  className="right">CASH: ${formatCurrency(cashPaid)}</p>
          <p  className="right">CREDIT: ${formatCurrency(creditPaid)}</p>
          <p  className="right">CHANGE: ${formatCurrency(changeDue)}</p>

          ${notes ? `<div  className="line"></div><p>Notes: ${notes}</p>` : ""}
          <div  className="line"></div>

          <div  className="center">
            <img  className="barcode" src="${barcodeUrl}" />
            <p>Invoice #${order.id}</p>
          </div>

          <p  className="center">Thank you for your purchase!</p>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleDownloadPDF = async () => {
    if (selectedOrder) await handleDownloadOrderPDF(selectedOrder, toast);
  };

  const handleInitiateReturn = (order) => {
    toast({
      title: "Initiate Return",
      description: `Return process started for order ${order.id}.`,
    });
  };

  const handleRefreshOrders = () => {
    loadOrders();
    toast({ title: "Refreshing Orders", description: "Please wait..." });
  };

  const resetFilters = () => {
    setStartDate(""); setEndDate(""); setSearchText(""); setPage(0); loadOrders("", "", "");
  };

  const nextPage = () => { if (pageInfo && page < pageInfo.totalPages - 1) setPage(page + 1); };
  const prevPage = () => { if (page > 0) setPage(page - 1); };

  return (
    <div className="h-full flex flex-col">
      <POSHeader />

      <div className="p-4 bg-card border-b flex justify-between items-center">        <h1 className="text-2xl font-bold flex items-center gap-3"><span className="w-4 h-4 bg-green-500"></span>Order  History</h1>

        <Button variant="outline" onClick={handleRefreshOrders} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <div className="p-4 md:flex gap-2 items-center flex-wrap">
        <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-1 m-1" placeholder="Start Date" />
        <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-1 m-1" placeholder="End Date" />
        <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="border p-1 m-1" placeholder="Search by ID or Customer" />
        <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="border p-1 m-1">
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
        <Button onClick={() => loadOrders()} disabled={loading} size="sm" className="m-1">Filter</Button>
        <Button variant="outline" onClick={resetFilters} disabled={loading} size="sm" className="m-1">Reset</Button>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Loader2 className="animate-spin h-16 w-16 text-primary" />
            <p className="mt-4">Loading orders...</p>
          </div>
        ) : orders && orders.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div className="text-sm">
                Showing {pageInfo ? page * size + 1 : 0} - {pageInfo ? Math.min((page + 1) * size, pageInfo.totalElements) : 0} of {pageInfo?.totalElements || 0} orders
              </div>
              <div className="flex gap-2 items-center">
                <Button variant="outline" disabled={page === 0 || loading} onClick={prevPage}>Prev</Button>
                {pageInfo && Array.from({ length: pageInfo.totalPages }, (_, i) => i)
                  .slice(Math.max(0, page - 2), Math.min(pageInfo.totalPages, page + 3))
                  .map((i) => (
                    <Button key={i} variant={i === page ? "default" : "outline"} onClick={() => setPage(i)} disabled={loading}>{i + 1}</Button>
                  ))}
                <Button variant="outline" disabled={pageInfo?.page === pageInfo?.totalPages - 1 || loading} onClick={nextPage}>Next</Button>
              </div>
            </div>

            <OrderTable
              orders={orders}
              handleViewOrder={handleViewOrder}
              handlePrintInvoice={handlePrintInvoice}
              handleInitiateReturn={handleInitiateReturn}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <SearchIcon size={48} strokeWidth={1} />
            <p className="mt-4">No orders found</p>
            <p className="text-sm">Try refreshing or adjusting filters</p>
          </div>
        )}
      </div>

      <Dialog open={showOrderDetailsDialog} onOpenChange={setShowOrderDetailsDialog}>
        {selectedOrder && (
          <DialogContent className="bg-white max-h-screen overflow-y-scroll max-w-[800px]">
            <DialogHeader><DialogTitle>Order Details - Invoice</DialogTitle></DialogHeader>
            <OrderDetails selectedOrder={selectedOrder} />
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleDownloadPDF}><Download className="h-4 w-4 mr-2" />Download PDF</Button>
              <Button onClick={() => handlePrintInvoice(selectedOrder)}><PrinterIcon className="h-4 w-4 mr-2" />Print Invoice</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default OrderHistoryPage;
