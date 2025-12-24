import React from "react";
import { useGetChequesQuery, useDeleteChequeMutation } from "@/Redux Toolkit/features/cheque/chequeApi";
import { Button } from "@/components/ui/button";

const ChequeList = ({ type, status }) => {
  const { data, isLoading } = useGetChequesQuery({ branchId: 52, type, status }); // ✅ Hardcoded
  const [deleteCheque] = useDeleteChequeMutation();

  if (isLoading) return <p>Loading...</p>;

  return (
    <table className="w-full text-sm border rounded-lg mt-4">
      <thead className="bg-muted">
        <tr>
          <th className="p-2">Cheque #</th>
          <th className="p-2">Bank</th>
          <th className="p-2">Payee</th>
          <th className="p-2">Amount</th>
          <th className="p-2">Type</th>
          <th className="p-2">Status</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((c) => (
          <tr key={c.id} className="border-t">
            <td className="p-2">{c.chequeNumber}</td>
            <td className="p-2">{c.bankName}</td>
            <td className="p-2">{c.payee}</td>
            <td className="p-2">{c.amount}</td>
            <td className="p-2">{c.type}</td>
            <td className="p-2">{c.status}</td>
            <td className="p-2">
              <Button variant="destructive" size="sm" onClick={() => deleteCheque(c.id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ChequeList;
