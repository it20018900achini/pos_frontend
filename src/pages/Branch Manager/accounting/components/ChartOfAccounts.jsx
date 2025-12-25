"use client";
import React, { useState } from "react";
import {
  useGetChartOfAccountsQuery,
  useCreateChartOfAccountMutation,
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
  DollarSign,
  CreditCard,
  User,
  TrendingUp,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* ✅ SAFE Tailwind mappings */
const TYPE_META = {
  ASSET: {
    label: "ASSET",
    icon: DollarSign,
    badge: "text-green-600 border-green-600",
  },
  LIABILITY: {
    label: "LIABILITY",
    icon: CreditCard,
    badge: "text-red-600 border-red-600",
  },
  EQUITY: {
    label: "EQUITY",
    icon: User,
    badge: "text-blue-600 border-blue-600",
  },
  INCOME: {
    label: "INCOME",
    icon: TrendingUp,
    badge: "text-teal-600 border-teal-600",
  },
  EXPENSE: {
    label: "EXPENSE",
    icon: BookOpen,
    badge: "text-orange-600 border-orange-600",
  },
  NA: {
    label: "N/A",
    icon: HelpCircle,
    badge: "text-gray-500 border-gray-400",
  },
};

export default function ChartOfAccounts() {
  const { data: accounts, isLoading, isError, refetch } =
    useGetChartOfAccountsQuery();
  const [createAccount, { isLoading: isCreating }] =
    useCreateChartOfAccountMutation();

  const [newAccount, setNewAccount] = useState({
    code: "",
    name: "",
    type: "ASSET",
  });

  const handleCreate = async () => {
    if (!newAccount.code || !newAccount.name) return;
    await createAccount(newAccount).unwrap();
    setNewAccount({ code: "", name: "", type: "ASSET" });
    refetch();
  };

  if (isLoading) return <p>Loading Chart of Accounts...</p>;
  if (isError) return <p>Error loading accounts</p>;

  /* ✅ Recursive renderer */
  const renderAccount = (acc, level = 0) => {
    const meta = TYPE_META[acc.type ?? "NA"];
    const Icon = meta.icon;

    return (
      <div key={acc.id}>
        <div
          className="flex items-center gap-3 py-1"
          style={{ paddingLeft: level * 20 }}
        >
          <Icon className="w-4 h-4 text-muted-foreground" />

          <span className="font-medium">
            {acc.code} — {acc.name}
          </span>

          <Badge variant="outline" className={meta.badge}>
            {meta.label}
          </Badge>
        </div>

        {acc.children?.map((child) =>
          renderAccount(child, level + 1)
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Chart of Accounts</h2>

      {/* 🔹 Legend */}
      <div className="flex flex-wrap gap-3 justify-end">
        {Object.values(TYPE_META).map((t) => {
          const Icon = t.icon;
          return (
            <Badge
              key={t.label}
              variant="outline"
              className={`flex items-center gap-1 ${t.badge}`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </Badge>
          );
        })}
      </div>

      {/* 🔹 List Down */}
      <div className="border rounded-md p-3 space-y-1">
        {accounts?.map((acc) => renderAccount(acc))}
      </div>

      {/* 🔹 Create Form */}
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
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ASSET">ASSET</SelectItem>
            <SelectItem value="LIABILITY">LIABILITY</SelectItem>
            <SelectItem value="EQUITY">EQUITY</SelectItem>
            <SelectItem value="INCOME">INCOME</SelectItem>
            <SelectItem value="EXPENSE">EXPENSE</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleCreate} disabled={isCreating}>
          {isCreating ? "Adding..." : "Add"}
        </Button>
      </div>
    </div>
  );
}
