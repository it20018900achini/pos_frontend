"use client";
import React, { useMemo, useState } from "react";
import { useGetJournalsQuery, useGetChartOfAccountsQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ===== Flatten nested accounts helper =====
const flattenAccounts = (accounts) => {
  let result = [];
  const traverse = (accList) => {
    accList.forEach((acc) => {
      result.push(acc);
      if (acc.children?.length) traverse(acc.children);
    });
  };
  traverse(accounts);
  return result;
};
export default function JournalByAccount() {
  const { data: accountsNested = [] } = useGetChartOfAccountsQuery();
  const accounts = useMemo(() => flattenAccounts(accountsNested), [accountsNested]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const { data: journals = [], isLoading: loadingJournals, refetch } = useGetJournalsQuery();

  if ( loadingJournals) return <p>Loading...</p>;

  const filteredJournals = selectedAccount
    ? journals.filter(journal =>
        journal.lines.some(line => line.account?.code === selectedAccount)
      )
    : journals;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Journal Entries</h2>

      {/* Account Select */}
      <div className="flex gap-2 items-center">
        <Select value={selectedAccount} onValueChange={setSelectedAccount} className="border">
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Select Account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map(acc => (
              <SelectItem key={acc.id} value={acc.code}>
                {acc.name} ({acc.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={refetch} variant="outline">Refresh</Button>
      </div>

      {/* Journal Table */}
      {filteredJournals.length === 0 ? (
        <p className="text-gray-500">No journal entries for this account</p>
      ) : (
        filteredJournals.map(journal => (
          <Card key={journal.id}>
            <CardHeader>
              <CardTitle>{journal.description}</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Account</th>
                    <th className="border border-gray-300 p-2 text-right">Debit</th>
                    <th className="border border-gray-300 p-2 text-right">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {journal.lines
                    .filter(line => !selectedAccount || line.account?.code === selectedAccount)
                    .map((line, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-2">{line.account?.name || "N/A"}</td>
                        <td className="border border-gray-300 p-2 text-right">{line.debit?.toLocaleString() || 0}</td>
                        <td className="border border-gray-300 p-2 text-right">{line.credit?.toLocaleString() || 0}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
