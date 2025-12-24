import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateQuotationMutation } from "@/Redux Toolkit/features/quotation/quotationApi";
import QuotationItemsTable from "./QuotationItemsTable";

const QuotationForm = () => {
  const [createQuotation, { isLoading }] = useCreateQuotationMutation();

  const branchId = 52; // Single branch

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discount, setDiscount] = useState(0);

  const [items, setItems] = useState([{ productName: "", quantity: 1, unitPrice: 0 }]);

  const addItem = () =>
    setItems([...items, { productName: "", quantity: 1, unitPrice: 0 }]);

  const totalAmount = items.reduce(
    (acc, item) => acc + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );
  const netAmount = totalAmount - (discount || 0);

  const submit = async () => {
    if (!customerName) return alert("Customer Name is required");

    try {
      await createQuotation({
        branchId,
        customerName,
        customerPhone,
        discount,
        items: items.map((i) => ({
          productName: i.productName || "",
          quantity: i.quantity || 1,
          unitPrice: i.unitPrice || 0,
        })),
      }).unwrap();

      // Reset form
      setCustomerName("");
      setCustomerPhone("");
      setDiscount(0);
      setItems([{ productName: "", quantity: 1, unitPrice: 0 }]);
    } catch (error) {
      console.error(error);
      alert("Failed to create quotation");
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-lg">
      <h2 className="text-lg font-semibold">New Quotation</h2>

      <p>Branch: {branchId}</p>

      <Input
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      <Input
        placeholder="Customer Phone"
        value={customerPhone}
        onChange={(e) => setCustomerPhone(e.target.value)}
      />

      <QuotationItemsTable items={items} setItems={setItems} />

      <Button variant="outline" onClick={addItem}>
        Add Item
      </Button>

      <Input
        type="number"
        placeholder="Discount"
        value={discount}
        onChange={(e) => setDiscount(Number(e.target.value))}
      />

      <div className="flex justify-between font-semibold">
        <span>Total: {totalAmount}</span>
        <span>Net: {netAmount}</span>
      </div>

      <Button onClick={submit} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Quotation"}
      </Button>
    </div>
  );
};

export default QuotationForm;
