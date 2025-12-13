import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const handleDownloadOrderPDF = async (order, toastInstance, autoPrint = false) => {
  if (!order) return;

  try {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(`Invoice - Order #${order.id}`, 14, 22);

    // Customer
    doc.setFontSize(12);
    doc.text(`Customer: ${order.customer?.fullName || "Walk-in"}`, 14, 32);
    doc.text(`Payment: ${order.paymentType}`, 14, 40);

    // Table
    const tableData = order.items.map((item) => [
      item.productName || item.name,
      item.quantity,
      item.price.toFixed(2),
      (item.price * item.quantity).toFixed(2),
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["Item", "Qty", "Price", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Totals
    const finalY = doc.lastAutoTable?.finalY || 60;
    doc.text(`Total: ${order.totalAmount?.toFixed(2) || 0}`, 14, finalY + 10);
    doc.text(`Cash: ${order.cash?.toFixed(2) || 0}`, 14, finalY + 16);
    doc.text(`Change: ${order.changeDue?.toFixed(2) || 0}`, 14, finalY + 22);

    if (autoPrint) {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    } else {
      doc.save(`Invoice-${order.id}.pdf`);
    }

    toastInstance?.({
      title: autoPrint ? "Printing..." : "PDF Downloaded",
      description: autoPrint ? `Invoice #${order.id} opened for printing.` : `Invoice #${order.id} saved.`,
    });
  } catch (err) {
    toastInstance?.({
      title: "PDF Error",
      description: "Failed to generate PDF.",
      variant: "destructive",
    });
    console.error(err);
  }
};
