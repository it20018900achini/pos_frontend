import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export function PaymentTable({ payments }) {
  return (<>
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
      No payment records
    </TableCell>
  </TableRow>
) : (
  payments.map((p) => (
    <TableRow key={p.id}>
      <TableCell>{p.customerId}</TableCell>
      <TableCell>{p.cashierId}</TableCell>
      <TableCell>Rs {p.amount}</TableCell>
      <TableCell>{p.paymentMethod}</TableCell>
      <TableCell>
        {p.paidAt ? new Date(p.paidAt).toLocaleString() : "—"}
      </TableCell>
    </TableRow>
  ))
)}
      </TableBody>
    </Table></>
  );
}
