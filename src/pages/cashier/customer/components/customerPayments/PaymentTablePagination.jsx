import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { getPaymentsByCustomer } from "./services/paymentService";
import { PaymentFormModal } from "./PaymentFormModal";


export function PaymentTablePagination({ customerId }) {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const res = await getPaymentsByCustomer(customerId, page, size, "id,desc");
      setPayments(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [page, size, customerId]);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));

  const handleSubmit = async (data) => {
    await createPayment(data);
    await loadData();
  };
  return (
    <div className="space-y-4">
                <PaymentFormModal onSubmit={handleSubmit} />
        
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button onClick={handlePrev} disabled={page === 0}>
            Prev
          </Button>
          <Button onClick={handleNext} disabled={page === totalPages - 1 || totalPages === 0}>
            Next
          </Button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span>Items per page:</span>
          <Select value={String(size)} onValueChange={(val) => { setSize(Number(val)); setPage(0); }}>
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((s) => (
                <SelectItem key={s} value={String(s)}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <p>Loading payments...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Cashier</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.customerId}</TableCell>
                  <TableCell>{p.cashierId}</TableCell>
                  <TableCell>Rs {p.amount}</TableCell>
                  <TableCell>{p.paymentMethod?.toUpperCase()}</TableCell>
                  <TableCell>{p.paidAt ? new Date(p.paidAt).toLocaleString() : "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
