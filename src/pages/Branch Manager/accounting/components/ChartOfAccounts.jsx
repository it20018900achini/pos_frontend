"use client";

import React, { useState } from "react";
import {
  useGetChartOfAccountsQuery,
  useCreateChartOfAccountMutation,
  useUpdateChartOfAccountMutation,
} from "@/Redux Toolkit/features/accounting/accountingApi";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DollarSign,
  CreditCard,
  User,
  TrendingUp,
  BookOpen,
  HelpCircle,
  Pencil,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* 🔹 Tailwind + Icon config */
const TYPE_META = {
  ASSET: { icon: DollarSign, badge: "text-green-600 border-green-600" },
  LIABILITY: { icon: CreditCard, badge: "text-red-600 border-red-600" },
  EQUITY: { icon: User, badge: "text-blue-600 border-blue-600" },
  INCOME: { icon: TrendingUp, badge: "text-teal-600 border-teal-600" },
  EXPENSE: { icon: BookOpen, badge: "text-orange-600 border-orange-600" },
  NA: { icon: HelpCircle, badge: "text-gray-500 border-gray-400" },
};

export default function ChartOfAccounts() {
  const { data: accounts = [], isLoading, isError, refetch } =
    useGetChartOfAccountsQuery();

  const [createAccount, { isLoading: creating }] =
    useCreateChartOfAccountMutation();

  const [updateAccount] = useUpdateChartOfAccountMutation();

  const [newAccount, setNewAccount] = useState({
    code: "",
    name: "",
    type: "ASSET",
  });

  const [editingAccount, setEditingAccount] = useState(null);

  const handleCreate = async () => {
    if (!newAccount.code || !newAccount.name) return;
    await createAccount(newAccount).unwrap();
    setNewAccount({ code: "", name: "", type: "ASSET" });
    refetch();
  };

  if (isLoading) return <p>Loading Chart of Accounts...</p>;
  if (isError) return <p>Error loading accounts</p>;

  // Group accounts by type
  const categorizedAccounts = accounts.reduce((acc, item) => {
    const type = item.type ?? "NA";
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  // Recursive renderer
  const renderAccount = (acc, level = 0) => {
    const meta = TYPE_META[acc.type ?? "NA"];
    const Icon = meta.icon;

    return (
      <div key={acc.id}>
        <div
          className="group flex items-center justify-between py-1 px-2 rounded-md hover:bg-muted/40"
          style={{ paddingLeft: level * 20 }}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">
              {acc.code} — {acc.name}
            </span>
            <Badge variant="outline" className={meta.badge}>
              {acc.type ?? "N/A"}
            </Badge>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition"
            onClick={() => setEditingAccount(acc)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>

        {acc.children?.map((child) => renderAccount(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Chart of Accounts</h2>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-end">
        {Object.entries(TYPE_META)
          .filter(([k]) => k !== "NA")
          .map(([key, meta]) => {
            const Icon = meta.icon;
            return (
              <Badge
                key={key}
                variant="outline"
                className={`flex items-center gap-1 ${meta.badge}`}
              >
                <Icon className="w-4 h-4" />
                {key}
              </Badge>
            );
          })}
      </div>

      {/* Categorized Lists */}
      {Object.entries(TYPE_META)
        .filter(([type]) => type !== "NA")
        .map(([type, meta]) => (
          <div key={type} className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <meta.icon className="w-5 h-5" />
              {type}
            </h3>
            <div className="border rounded-md p-2 space-y-1">
              {categorizedAccounts[type]?.map((acc) => renderAccount(acc)) ||
                <p className="text-gray-400">No accounts</p>}
            </div>
          </div>
        ))}

      {/* 🔹 Create Account */}
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Code"
          value={newAccount.code}
          onChange={(e) =>
            setNewAccount({ ...newAccount, code: e.target.value })
          }
        />
        <Input
          placeholder="Name"
          value={newAccount.name}
          onChange={(e) =>
            setNewAccount({ ...newAccount, name: e.target.value })
          }
        />
        <Select
          value={newAccount.type}
          onValueChange={(value) =>
            setNewAccount({ ...newAccount, type: value })
          }
        >
          <SelectTrigger className="w-36">
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
          </SelectContent>
        </Select>
        <Button onClick={handleCreate} disabled={creating}>
          Add
        </Button>
      </div>

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
                  setEditingAccount({
                    ...editingAccount,
                    code: e.target.value,
                  })
                }
              />
              <Input
                value={editingAccount.name}
                onChange={(e) =>
                  setEditingAccount({
                    ...editingAccount,
                    name: e.target.value,
                  })
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
                  refetch();
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
