import React from "react";
import { handleDownloadOrderPDF } from "../pdf/pdfUtils";
import { useToast } from "../../../../components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, PrinterIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import OrderDetails from "./OrderDetails";
import { resetOrder } from "../../../../Redux Toolkit/features/cart/cartSlice";

const InvoiceDialog = ({ showInvoiceDialog, setShowInvoiceDialog }) => {
  const { selectedOrder } = useSelector((state) => state.order);
  const { toast } = useToast();
  const dispatch = useDispatch();

  // PDF download handler
  const handleDownloadPDF = async () => {
    if (!selectedOrder?.items?.length) {
      toast({
        title: "No Items",
        description: "This order has no items to generate PDF.",
        variant: "destructive",
      });
      return;
    }
    await handleDownloadOrderPDF(selectedOrder, toast);
  };

  // POS-friendly invoice print
  const handlePrintInvoice = () => {
    if (!selectedOrder) return;

    const printWindow = window.open("", "_blank", "width=300,height=600");
    if (!printWindow) {
      toast({
        title: "Print Error",
        description: "Popup blocked! Allow popups for this site.",
        variant: "destructive",
      });
      return;
    }

    const line = "-".repeat(32);

    const formatText = (name, qty, price, total) => {
      const n = (name || "").toString().slice(0, 16).padEnd(16, " "); // Safe default
      const q = (qty || 0).toString().padStart(3, " ");
      const p = (price || 0).toFixed(2).padStart(6, " ");
      const t = (total || 0).toFixed(2).padStart(6, " ");
      return `${n}${q} ${p} ${t}`;
    };

    let receiptText = "";
    receiptText += `      STORE NAME\n`;
    receiptText += `        INVOICE\n`;
    receiptText += `${line}\n`;
    receiptText += `Invoice #: ${selectedOrder.id || ""}\n`;
    receiptText += `Customer: ${selectedOrder.customer?.fullName || "Walk-in"}\n`;
    receiptText += `${line}\n`;
    receiptText += `Item            QTY  PRICE  TOTAL\n`;
    receiptText += `${line}\n`;

    selectedOrder.items.forEach((item) => {
      receiptText += formatText(
        item.name,
        item.quantity,
        item.price,
        (item.price || 0) * (item.quantity || 0)
      ) + "\n";
    });

    receiptText += `${line}\n`;
    receiptText += `TOTAL:   LKR ${(selectedOrder.totalAmount || 0).toFixed(2).padStart(10, " ")}\n`;
    receiptText += `CASH:    LKR ${(selectedOrder.cash || 0).toFixed(2).padStart(10, " ")}\n`;
    receiptText += `CREDIT:  LKR ${(selectedOrder.credit || 0).toFixed(2).padStart(10, " ")}\n`;
    receiptText += `CHANGE:  LKR ${(selectedOrder.changeDue || 0).toFixed(2).padStart(10, " ")}\n`;
    receiptText += `${line}\n`;
    receiptText += `   THANK YOU! VISIT AGAIN\n`;

    printWindow.document.write(
      `<pre style="font-family: monospace; font-size:12px; line-height:1.2;">${receiptText}</pre>`
    );
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Finish order
  const finishOrder = () => {
    setShowInvoiceDialog(false);
    dispatch(resetOrder());
    toast({
      title: "Order Completed",
      description: "Receipt printed and order saved successfully",
    });
  };

  return (
    <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
      {selectedOrder && (
        <DialogContent className="bg-white max-h-screen overflow-y-scroll max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Order Details - Invoice</DialogTitle>
          </DialogHeader>
          <OrderDetails selectedOrder={selectedOrder} />
{/* <pre>{JSON.stringify(selectedOrder,null,2)}</pre>{} */}
          <DialogFooter className="gap-2 sm:gap-0 space-x-3">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={handlePrintInvoice}>
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
            <Button onClick={finishOrder}>Start New Order</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default InvoiceDialog;
