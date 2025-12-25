import React, { useState } from "react";
import { useGetChartOfAccountsQuery, useCreateChartOfAccountMutation } from "@/Redux Toolkit/features/accounting/apiSlice";

export default function ChartOfAccountTable() {
  const { data, isLoading } = useGetChartOfAccountsQuery();
  const [createAccount] = useCreateChartOfAccountMutation();
  const [name, setName] = useState("");

  if (isLoading) return <p>Loading accounts...</p>;

  const handleAdd = async () => {
    if (!name) return;
    await createAccount({ name });
    setName("");
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Chart of Accounts</h2>
      <div className="flex gap-2 mb-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Account Name"
          className="border p-2 rounded"
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>
      <ul className="border p-2 rounded">
        {data?.map((acc) => (
          <li key={acc.id} className="py-1 border-b">{acc.name}</li>
        ))}
      </ul>
    </div>
  );
}
