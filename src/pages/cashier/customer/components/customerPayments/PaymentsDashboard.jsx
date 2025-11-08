import { useEffect, useState } from "react";
import { createPayment, getPaymentsByCustomer } from "./services/paymentService";
import { PaymentFormModal } from "./PaymentFormModal";
import { PaymentTable } from "./PaymentTable";
// import { PaymentTable } from "@/components/payments/PaymentTable";
// import { PaymentFormModal } from "@/components/payments/PaymentFormModal";
// import { createPayment, getPaymentsByCustomer } from "@/services/paymentService";

export default function PaymentsDashboard() {
  const [payments, setPayments] = useState([]);

  const loadData = async () => {
    const res = await getPaymentsByCustomer(7); // For demo: customer 1
    setPayments(res.data);
  };

  const handleSubmit = async (data) => {
    await createPayment(data);
    await loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Customer Payments</h1>
        <PaymentFormModal onSubmit={handleSubmit} />
      </div>

      <PaymentTable payments={payments} />
    </div>
  );
}
