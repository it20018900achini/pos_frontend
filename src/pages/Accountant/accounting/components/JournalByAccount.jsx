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
import { Button } from "@/components/ui/button";
import { formatDate, formatDistanceToNow } from "date-fns";
import { Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    const { userProfile,selectedBranchId } = useSelector((state) => state.user);

  const storeId = userProfile?.user?.store?.id;
  const { data: accountsNested = [] } = useGetChartOfAccountsQuery(storeId);
  const accounts = useMemo(() => flattenAccounts(accountsNested), [accountsNested]);

  const [deleteId, setDeleteId] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [page, setPage] = useState(0); // current page
  const size = 5; // items per page
  const [searchTerm, setSearchTerm] = useState(""); // search input

  // server-side fetch
  const { data: journalsPage, isLoading, refetch } = useGetJournalsQuery({
    branchId: selectedBranchId,
    entryId: searchTerm ? Number(searchTerm) : null, // filter by entryId if numeric
    page,
    size,
  });

  const [deleteJournal, { isLoading: deleting }] = useDeleteJournalMutation();
  const [updateJournal, { isLoading: updating }] = useUpdateJournalEntryMutation();

  if (isLoading) return <p>Loading...</p>;

  const journals = journalsPage?.content || [];
  const totalPages = journalsPage?.totalPages || 1;

  // client-side filter for description or account code
  const filteredJournals = journals.filter((journal) => {
    const matchDesc = journal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAccount = selectedAccount
      ? journal.lines.some((line) => line.account?.code === selectedAccount)
      : true;
    return matchDesc || matchAccount;
  });

  const confirmDelete = async () => {
    try {
      await deleteJournal(deleteId).unwrap();
    } finally {
      setDeleteId(null);
      refetch();
    }
  };

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
      <h2 className="text-2xl font-bold mt-10">Journal Entries</h2>

      {/* Search & Account Select */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search by description or entry ID..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0); // reset to first page
          }}
          className="border p-2 rounded w-80"
        />
        
      </div>

      {/* Journal Table */}
      {filteredJournals.length === 0 ? (
        <p className="text-gray-500">No journal entries found</p>
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
                      <td className="border border-gray-300 p-2">#{line.account?.name || "N/A"}</td>
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

      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          <ChevronLeft /> Prev
        </Button>
        <span className="px-2 py-1">{page + 1} / {totalPages}</span>
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
        >
          Next <ChevronRight />
        </Button>
      </div>

      {/* Delete & Update Dialogs remain unchanged */}
    </div>
  );
}
