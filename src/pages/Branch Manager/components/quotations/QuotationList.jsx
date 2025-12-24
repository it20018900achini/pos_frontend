import React from "react";
import { useGetQuotationsQuery } from "@/Redux Toolkit/features/quotation/quotationApi";

const QuotationList = () => {
  const { data: quotations, isLoading, isError } = useGetQuotationsQuery();

  if (isLoading) return <p>Loading quotations...</p>;
  if (isError) return <p>Error loading quotations</p>;
  if (!quotations || quotations.length === 0) return <p>No quotations found</p>;

  return (
    <div className="space-y-4">
      {quotations.map((q) => (
        <div key={q.id} className="border rounded-lg p-4">
          <div className="flex justify-between font-semibold mb-2">
            <span>Quotation #: {q.quotationNumber}</span>
            <span>Status: {q.status}</span>
          </div>
          <div className="mb-2">
            <span>Customer: {q.customerName}</span> |{" "}
            <span>Phone: {q.customerPhone}</span> |{" "}
            <span>Branch: {q.branchName}</span>
          </div>

          <table className="w-full border mb-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Product</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Unit Price</th>
                <th className="p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {q.items.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{item.productName}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{item.unitPrice}</td>
                  <td className="p-2">{item.quantity * item.unitPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end font-semibold space-x-4">
            <span>Discount: {q.discount}</span>
            <span>Total: {q.totalAmount}</span>
            <span>Net: {q.totalAmount - q.discount}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuotationList;
