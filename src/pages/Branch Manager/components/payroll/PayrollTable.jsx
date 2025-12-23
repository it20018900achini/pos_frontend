import { Button } from "@/components/ui/button";

export default function PayrollTable({ payrolls, onApprove, onPay }) {
  if (!payrolls || payrolls.length === 0) return <p>No payrolls to display</p>;

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Employee</th>
          <th className="border p-2">Total Amount</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {payrolls.map((p) => (
          <tr key={p.id} className="text-center">
            <td className="border p-2">{p.employee.fullName}</td>
            <td className="border p-2">{p.totalAmount}</td>
            <td className="border p-2">{p.status}</td>
            <td className="border p-2 flex gap-2 justify-center">
              {p.status === "PENDING" && (
                <Button onClick={() => onApprove(p.id)}>Approve</Button>
              )}
              {p.status === "APPROVED" && (
                <Button onClick={() => onPay(p.id)}>Pay</Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
