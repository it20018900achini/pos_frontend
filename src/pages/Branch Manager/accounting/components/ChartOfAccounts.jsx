"use client";
import React, { useState } from "react";
import {
  useGetChartOfAccountsQuery,
  useCreateChartOfAccountMutation,
} from "@/Redux Toolkit/features/accounting/accountingApi";

export default function ChartOfAccounts() {
  const { data: accounts, isLoading, isError, refetch } = useGetChartOfAccountsQuery();
  const [createAccount, { isLoading: isCreating }] = useCreateChartOfAccountMutation();

  const [newAccount, setNewAccount] = useState({ code: "", name: "" });

  const handleCreate = async () => {
    if (!newAccount.code || !newAccount.name) return;
    try {
      await createAccount(newAccount).unwrap();
      setNewAccount({ code: "", name: "" });
      refetch(); // Refresh the list after creation
    } catch (err) {
      console.error("Failed to create account:", err);
    }
  };

  if (isLoading) return <p>Loading Chart of Accounts...</p>;
  if (isError) return <p>Error loading accounts</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Chart of Accounts</h2>
      <ul>
        {accounts?.map(acc => (
          <li key={acc.id}>{acc.code} - {acc.name}</li>
        ))}
      </ul>

      <div className="mt-4 flex gap-2">
        <input
          placeholder="Code"
          value={newAccount.code}
          onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
          className="border p-1"
        />
        <input
          placeholder="Name"
          value={newAccount.name}
          onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
          className="border p-1"
        />
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="bg-green-500 text-white px-3 rounded"
        >
          {isCreating ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}
