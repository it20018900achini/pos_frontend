"use client";
import React, { useState } from "react";
import { useGetJournalsQuery, useGetChartOfAccountsQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function JournalByAccount() {
  const { data: accounts = [], isLoading: loadingAccounts } = useGetChartOfAccountsQuery();
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Fetch all journals (we can filter client-side or call endpoint by account)
  const { data: journals = [], isLoading: loadingJournals, refetch } = useGetJournalsQuery();

  if (loadingAccounts || loadingJournals) return <p>Loading...</p>;

  // Filter journals by selected account
  const filteredJournals = selectedAccount
    ? journals.filter(journal =>
        journal.lines.some(line => line.account?.code === selectedAccount)
      )
    : journals;

  return (
    <div className="space-y-4 ">
      <h2 className="text-2xl font-bold">Journal Entries</h2>

      {/* Select account */}
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
        <Button onClick={refetch} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Journal List */}
      {filteredJournals.length === 0 ? (
        <p className="text-gray-500">No journal entries for this account</p>
      ) : (
        filteredJournals.map(journal => (
          <Card key={journal.id}>
            <CardHeader>
              <CardTitle>{journal.description}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="pl-4 list-disc">
                {journal.lines
                  .filter(line => !selectedAccount || line.account?.code === selectedAccount)
                  .map((line, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{line.account?.name || "N/A"}</span>
                      <span>
                        Debit: {line.debit?.toLocaleString() || 0} | Credit: {line.credit?.toLocaleString() || 0}
                      </span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
