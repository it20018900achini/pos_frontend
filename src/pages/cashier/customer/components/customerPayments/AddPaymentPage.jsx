import axios from "axios";
import { PaymentForm } from "./PaymentForm";

export default function AddPaymentPage() {
  const handleSubmit = async (data) => {
    await axios.post("/api/customer-payments", data);
    alert("Payment recorded successfully!");
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Record Customer Payment</h1>
      <PaymentForm onSubmit={handleSubmit} />
    </div>
  );
}
