"use client";

import React, { useMemo, useState } from "react";
import {
  useGetJournalsQuery,
  useGetChartOfAccountsQuery,
  useDeleteJournalMutation,
  useUpdateJournalEntryMutation,
} from "@/Redux Toolkit/features/accounting/accountingApi";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatDistanceToNow } from "date-fns";
import { Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useSelector } from "react-redux";

// Flatten nested accounts
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
  const [editEntry, setEditEntry] = useState(null);

  const [deleteJournal, { isLoading: deleting }] = useDeleteJournalMutation();
  const [updateJournal, { isLoading: updating }] = useUpdateJournalEntryMutation();
  const storeId = useSelector((state) => state.user.userProfile?.user?.store?.id);

  const [selectedAccount, setSelectedAccount] = useState(null);
  const { data: journals = [], isLoading: loadingJournals, refetch } = useGetJournalsQuery({
      branchId: storeId,
  });

  if (loadingJournals) return <p>Loading...</p>;

  const filteredJournals = selectedAccount
    ? journals.filter((journal) =>
        journal.lines.some((line) => line.account?.code === selectedAccount)
      )
    : journals;

  // Delete confirm
  const confirmDelete = async () => {
    try {
      await deleteJournal(deleteId).unwrap();
    } finally {
      setDeleteId(null);
    }
  };

  // Update submit
  const handleUpdate = async () => {
    try {
      await updateJournal({
        id: editEntry.id,
        description: editEntry.description,
        lines: editEntry.lines,
      }).unwrap();
      setEditEntry(null);
      refetch();
    } catch (err) {
      console.error(err);
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
            {accounts.map((acc) => (
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

      {/* Journal Table */}
      {filteredJournals.length === 0 ? (
        <p className="text-gray-500">No journal entries for this account</p>
      ) : (
        filteredJournals.map((journal) => (
          <div key={journal.id}>
            <table className="w-full border-collapse border border-gray-300 mb-2">
              <thead>
                <tr className="bg-gray-100">
                  <th></th>
                  <th className="border border-gray-300 p-2 text-left">Account</th>
                  <th className="border border-gray-300 p-2 text-right">Debit</th>
                  <th className="border border-gray-300 p-2 text-right">Credit</th>
                </tr>
              </thead>
              <tbody>
                {journal.lines
                  .filter((line) => !selectedAccount || line.account?.code === selectedAccount)
                  .map((line, idx, arr) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {idx === 0 && (
                        <td
                          rowSpan={arr.length}
                          className="border border-gray-300 p-2 align-top text-sm text-gray-600"
                        >
                          <div className="font-semibold text-gray-800">{journal.description}</div>
                          <div className="text-xs mt-1">
                            {formatDate(new Date(journal.entryDate), "yyyy-MM-dd")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(journal.entryDate), { addSuffix: true })}
                          </div>

                          <div className="mt-1 flex gap-2">
                            <Button
                              size="sm"
                              variant="link"
                              className="text-blue-500 hover:text-blue-600"
                              onClick={() => setEditEntry(journal)}
                            >
                              <Edit />
                            </Button>
                            <Button
                              size="sm"
                              variant="link"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => setDeleteId(journal.id)}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </td>
                      )}
                      <td className="border border-gray-300 p-2">{line.account?.name || "N/A"}</td>
                      <td className="border border-gray-300 p-2 text-right text-green-700">
                        {(line.debit || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-red-600">
                        {(line.credit || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Delete Journal Entry?</DialogTitle>
          </DialogHeader>
          <div className="text-red-500">This action cannot be undone.
            </div>


          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Confirm Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Journal Entry Dialog */}
      <Dialog open={!!editEntry} onOpenChange={() => setEditEntry(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Journal Entry</DialogTitle>
          </DialogHeader>

          {editEntry && (
            <div className="space-y-4 mt-2">
              <div>
                <label className="block font-medium">Description</label>
                <input
                  type="text"
                  value={editEntry.description}
                  onChange={(e) =>
                    setEditEntry({ ...editEntry, description: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Lines editing (simplified for demo, can be a table/form) */}
              {editEntry.lines.map((line, idx) => (
                <div key={line.id || idx} className="flex gap-2 items-center">
                  <Select
                    value={line.account?.id || ""}
                    onValueChange={(val) => {
                      const account = accounts.find((acc) => acc.id === Number(val));
                      setEditEntry({
                        ...editEntry,
                        lines: editEntry.lines.map((l, i) =>
                          i === idx ? { ...l, account } : l
                        ),
                      });
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.name} ({acc.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <input
                    type="number"
                    value={line.debit || 0}
                    onChange={(e) =>
                      setEditEntry({
                        ...editEntry,
                        lines: editEntry.lines.map((l, i) =>
                          i === idx ? { ...l, debit: Number(e.target.value) } : l
                        ),
                      })
                    }
                    placeholder="Debit"
                    className="border p-1 w-20 rounded"
                  />

                  <input
                    type="number"
                    value={line.credit || 0}
                    onChange={(e) =>
                      setEditEntry({
                        ...editEntry,
                        lines: editEntry.lines.map((l, i) =>
                          i === idx ? { ...l, credit: Number(e.target.value) } : l
                        ),
                      })
                    }
                    placeholder="Credit"
                    className="border p-1 w-20 rounded"
                  />
                </div>
              ))}

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditEntry(null)}>
                  Cancel
                </Button>
                <Button variant="default" onClick={handleUpdate} disabled={updating}>
                  {updating ? "Updating…" : "Update Entry"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
