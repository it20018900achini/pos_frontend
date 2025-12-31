"use client";
import React, { useMemo, useState } from "react";
import { useGetJournalsQuery, useGetChartOfAccountsQuery } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatDistanceToNow } from "date-fns";
import {  useDeleteJournalMutation } from "@/Redux Toolkit/features/accounting/accountingApi";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

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
  
  const [deleteId, setDeleteId] = useState(null);

  const [deleteJournal, { isLoading: deleting }] = useDeleteJournalMutation();
  const [selectedAccount, setSelectedAccount] = useState(null);

  const { data: journals = [], isLoading: loadingJournals, refetch } = useGetJournalsQuery();

  if ( loadingJournals) return <p>Loading...</p>;

  const filteredJournals = selectedAccount
    ? journals.filter(journal =>
        journal.lines.some(line => line.account?.code === selectedAccount)
      )
    : journals;

  const confirmDelete = async () => {
    try {
      await deleteJournal(deleteId).unwrap();
     
    } finally {
      setDeleteId(null);
    }
  };
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
          <div key={journal.id}>
            <div>
              <pre>
                {/* {JSON.stringify(journal)} */}
              </pre>
            </div>
            <div>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th></th>
                    <th className="border border-gray-300 p-2 text-left" >Account</th>
                    <th className="border border-gray-300 p-2 text-right">Debit</th>
                    <th className="border border-gray-300 p-2 text-right">Credit</th>
                  </tr>
                </thead>
                <tbody>
  {journal.lines
    .filter(
      (line) => !selectedAccount || line.account?.code === selectedAccount
    )
    .map((line, idx, arr) => (
      <tr key={idx} className="hover:bg-gray-50">
        {/* Journal info column (only once) */}
        {idx === 0 && (
          <td
            rowSpan={arr.length}
            className="border border-gray-300 p-2 align-top text-sm text-gray-600"
          >
            <div className="font-semibold text-gray-800">
              {journal.description}
            </div>
            <div className="text-xs mt-1">
              {formatDate(new Date(journal.entryDate), "yyyy-MM-dd")}
            </div>
            <div className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(journal.entryDate), {
                addSuffix: true,
              })}
            </div>

{journal.id&&<Button
                  size="sm"
                  variant="link"
                  className="ml-2 cursor-pointer text-red-500 hover:text-red-600"
                  onClick={() => setDeleteId(journal.id)}
                >
                  <Trash2/>
                </Button>}

          </td>
        )}

        <td className="border border-gray-300 p-2">
          {line.account?.name || "N/A"}
        </td>

        <td className="border border-gray-300 p-2 text-right text-green-700">
          {(line.debit || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </td>

        <td className="border border-gray-300 p-2 text-right text-red-600">
          {(line.credit || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </td>
      </tr>
    ))}
</tbody>

              </table>
            </div>
          </div>
        ))
      )}
      
            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Delete Journal Entry?</DialogTitle>
                </DialogHeader>
      
                
      
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                  <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
                    {deleting ? "Deleting…" : "Confirm Delete"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
    </div>
  );
}
