"use client";

import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  useGetChartOfAccountsQuery,
  useCreateChartOfAccountMutation,
  useUpdateChartOfAccountMutation,
  useDeleteChartOfAccountMutation,
} from "@/Redux Toolkit/features/accounting/accountingApi";

import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
  Trash2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import LedgerWithDialog from "./LedgerWithDialog";

/* ================= TYPE META ================= */

const TYPE_META = {
  ASSET: { icon: DollarSign, badge: "text-green-600 border-green-600" },
  LIABILITY: { icon: CreditCard, badge: "text-red-600 border-red-600" },
  EQUITY: { icon: User, badge: "text-blue-600 border-blue-600" },
  INCOME: { icon: TrendingUp, badge: "text-teal-600 border-teal-600" },
  EXPENSE: { icon: BookOpen, badge: "text-orange-600 border-orange-600" },
  NA: { icon: HelpCircle, badge: "text-gray-500 border-gray-400" },
};

/* ================= BUILD PARENTS ================= */

const buildParentOptions = (accounts, level = 0) => {
  let result = [];

  accounts.forEach((acc) => {
    result.push({
      id: acc.id,
      type: acc.type,
      label: `${"— ".repeat(level)}${acc.code} — ${acc.name}`,
    });

    if (acc.children?.length) {
      result = result.concat(buildParentOptions(acc.children, level + 1));
    }
  });

  return result;
};

export default function ChartOfAccounts() {
  /* ================= STORE ================= */

  const storeId = useSelector((state) => state.user.userProfile?.user?.store?.id);

  /* ================= API ================= */

  const {
    data: accounts = [],
    isLoading,
    isError,
    refetch,
  } = useGetChartOfAccountsQuery(storeId, {
    skip: !storeId,
  });

  const [createAccount] = useCreateChartOfAccountMutation();
  const [updateAccount] = useUpdateChartOfAccountMutation();
  const [deleteAccount] = useDeleteChartOfAccountMutation();

  /* ================= STATE ================= */

  const [newAccount, setNewAccount] = useState({
    code: "",
    name: "",
    type: "ASSET",
    parentId: null,
  });

  const [editingAccount, setEditingAccount] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* ================= PARENTS ================= */

  const parentOptions = useMemo(
    () => buildParentOptions(accounts),
    [accounts]
  );

  if (!storeId) return <p>Loading store...</p>;
  if (isLoading) return <p>Loading Chart of Accounts...</p>;
  if (isError) return <p>Error loading accounts.</p>;

  /* ================= CREATE ================= */

  const handleCreate = async () => {
    if (!newAccount.code || !newAccount.name) return;

    await createAccount({
      store: { id: storeId },
      code: newAccount.code,
      name: newAccount.name,
      type: newAccount.type,
      parent: newAccount.parentId ? { id: newAccount.parentId } : null,
    }).unwrap();

    setNewAccount({
      code: "",
      name: "",
      type: "ASSET",
      parentId: null,
    });

    refetch();
  };

  /* ================= DELETE ================= */

  const confirmDelete = async () => {
    await deleteAccount(deleteTarget.id).unwrap();
    setDeleteTarget(null);
    refetch();
  };

  /* ================= TREE ================= */

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
              {acc.type}
            </Badge>

            <LedgerWithDialog accountId={acc.id} />
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <Button size="icon" variant="ghost" onClick={() => setEditingAccount(acc)}>
              <Pencil className="w-4 h-4" />
            </Button>

            <Button size="icon" variant="ghost" onClick={() => setDeleteTarget(acc)}>
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>

        {acc.children?.map((child) => renderAccount(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-semibold">Chart of Accounts</h2>

      {/* CREATE */}

      <Card className="p-3 space-y-3">

        <CardHeader>
          <CardTitle>Add Chart of Account</CardTitle>
        </CardHeader>

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

        <div className="flex gap-2">

          <Select
            value={newAccount.type}
            onValueChange={(v) =>
              setNewAccount({ ...newAccount, type: v, parentId: null })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {Object.keys(TYPE_META)
                .filter((t) => t !== "NA")
                .map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select
            value={newAccount.parentId?.toString() ?? "NONE"}
            onValueChange={(v) =>
              setNewAccount({
                ...newAccount,
                parentId: v === "NONE" ? null : Number(v),
              })
            }
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Parent (optional)" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="NONE">No Parent</SelectItem>

              {parentOptions
                .filter((p) => p.type === newAccount.type)
                .map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.label}
                  </SelectItem>
                ))}
            </SelectContent>

          </Select>

        </div>

        <Button onClick={handleCreate}>
          Add Account
        </Button>

      </Card>

      {/* ACCOUNT LIST */}

      <div className="border rounded-md p-2 space-y-1">
        {accounts.map((acc) => renderAccount(acc))}
      </div>

    </div>
  );
}