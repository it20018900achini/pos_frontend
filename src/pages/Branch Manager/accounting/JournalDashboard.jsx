"use client";

import React, { useMemo, useState } from "react";
import {
  useGetChartOfAccountsQuery,
  useUpdateChartOfAccountMutation,
} from "@/Redux Toolkit/features/accounting/accountingApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Ledger from "./components/Ledger";

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

export default function ChartOfAccounts() {
  const { data: accounts = [], isLoading, isError, refetch } =
    useGetChartOfAccountsQuery();

  const [updateAccount] = useUpdateChartOfAccountMutation();
  const [editingAccount, setEditingAccount] = useState(null);

  // Selected account for Ledger
  const [selectedAccountCode, setSelectedAccountCode] = useState("");

  // Flattened accounts for select options
  const flatAccounts = useMemo(() => flattenAccounts(accounts), [accounts]);

  return (
    <div className="space-y-6">
      {/* 🔹 Select Account for Ledger */}
      <div className="flex items-center space-x-4">
        <Select
          value={selectedAccountCode}
          onValueChange={(code) => setSelectedAccountCode(code)}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Account for Ledger" />
          </SelectTrigger>
          <SelectContent>
            {flatAccounts.map((account) => (
              <SelectItem key={account.id} value={account.code}>
                {account.code} - {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={refetch}>Refresh Accounts</Button>
      </div>

      {/* 🔹 Ledger Component */}
      {selectedAccountCode && <Ledger accountCode={selectedAccountCode} />}

      {/* 🔹 Edit Dialog */}
      {editingAccount && (
        <Dialog open onOpenChange={() => setEditingAccount(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                value={editingAccount.code}
                onChange={(e) =>
                  setEditingAccount({ ...editingAccount, code: e.target.value })
                }
              />
              <Input
                value={editingAccount.name}
                onChange={(e) =>
                  setEditingAccount({ ...editingAccount, name: e.target.value })
                }
              />
              <Select
                value={editingAccount.type ?? "NA"}
                onValueChange={(value) =>
                  setEditingAccount({
                    ...editingAccount,
                    type: value === "NA" ? null : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"].map(
                    (t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    )
                  )}
                  <SelectItem value="NA">N/A</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={async () => {
                  await updateAccount({
                    id: editingAccount.id,
                    code: editingAccount.code,
                    name: editingAccount.name,
                    type: editingAccount.type,
                  }).unwrap();
                  setEditingAccount(null);
                }}
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
