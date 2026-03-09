"use client";

import React, { useMemo, useState } from "react";
import {
  useGetChartOfAccountsQuery,
  useCreateChartOfAccountMutation,
  useUpdateChartOfAccountMutation,
  useDeleteChartOfAccountMutation,
} from "@/Redux Toolkit/features/accounting/accountingApi";

import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
import ContentLayout from "../../../Dashboard/ContentLayout";
import { useSelector } from "react-redux";

/* ================= TYPE META ================= */
const TYPE_META = {
  ASSET: { icon: DollarSign, badge: "text-green-600 border-green-600" },
  LIABILITY: { icon: CreditCard, badge: "text-red-600 border-red-600" },
  EQUITY: { icon: User, badge: "text-blue-600 border-blue-600" },
  INCOME: { icon: TrendingUp, badge: "text-teal-600 border-teal-600" },
  EXPENSE: { icon: BookOpen, badge: "text-orange-600 border-orange-600" },
  NA: { icon: HelpCircle, badge: "text-gray-500 border-gray-400" },
};

/* ================= BUILD PARENT OPTIONS ================= */
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
  const storeId = useSelector((state) => state.user.userProfile?.user?.store?.id);
  const { data: accounts = [], isLoading, isError, refetch } =
    useGetChartOfAccountsQuery(storeId);

  const [createAccount, { isLoading: creating }] =
    useCreateChartOfAccountMutation();
  const [updateAccount] = useUpdateChartOfAccountMutation();
  const [deleteAccount, { isLoading: deleting }] =
    useDeleteChartOfAccountMutation();

  const [newAccount, setNewAccount] = useState({
    code: "",
    name: "",
    type: "ASSET",
    parentId: null,
  });

  const [editingAccount, setEditingAccount] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const parentOptions = useMemo(
    () => buildParentOptions(accounts),
    [accounts]
  );

  if (isError) return <p>Error loading accounts..</p>;

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    if (!newAccount.code || !newAccount.name) return;

    await createAccount({
      code: newAccount.code,
      name: newAccount.name,
      type: newAccount.type,
      parent: newAccount.parentId ? { id: newAccount.parentId } : null,
    }).unwrap();

    setNewAccount({ code: "", name: "", type: "ASSET", parentId: null });
    refetch();
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    try {
      setDeleteError("");
      await deleteAccount(deleteTarget.id).unwrap();
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      setDeleteError(err?.data?.message || "Delete failed");
    }
  };

  /* ================= RENDER TREE ================= */
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
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setEditingAccount(acc)}
            >
              <Pencil className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => setDeleteTarget(acc)}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>

        {acc.children?.map((child) => renderAccount(child, level + 1))}
      </div>
    );
  };

  return (
  <ContentLayout loadingSpinner={isLoading} title="Chart of Accounts" subTitle="View and manage your chart of accounts." >
    
    <div className="space-y-6">

      {/* ================= CREATE ================= */}
      <Card className=" p-3">
         <CardHeader>
                      <CardTitle className="text-xl font-bold">Add Chart of Account</CardTitle>
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

        <Button onClick={handleCreate} disabled={creating}>
          Add Account
        </Button>
      </Card>
      <hr/>
      {/* ================= LIST ================= */}
      <div className="border rounded-md p-2 space-y-1">
        {accounts.map((acc) => renderAccount(acc))}
      </div>


      {/* ================= EDIT ================= */}
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
                value={editingAccount.type}
                onValueChange={(v) =>
                  setEditingAccount({ ...editingAccount, type: v, parent: null })
                }
              >
                <SelectTrigger>
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
                value={editingAccount.parent?.id?.toString() ?? "NONE"}
                onValueChange={(v) =>
                  setEditingAccount({
                    ...editingAccount,
                    parent: v === "NONE" ? null : { id: Number(v) },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Parent Account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">No Parent</SelectItem>
                  {parentOptions
                    .filter(
                      (p) =>
                        p.type === editingAccount.type &&
                        p.id !== editingAccount.id
                    )
                    .map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Button
                onClick={async () => {
                  await updateAccount({
                    id: editingAccount.id,
                    code: editingAccount.code,
                    name: editingAccount.name,
                    type: editingAccount.type,
                    parent: editingAccount.parent,
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

      {/* ================= DELETE DIALOG ================= */}
      {deleteTarget && (
        <Dialog open onOpenChange={() => setDeleteTarget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account?</DialogTitle>
            </DialogHeader>

            <div className="space-y-2 text-sm">
              <p>
                <strong>{deleteTarget.code}</strong> — {deleteTarget.name}
              </p>
              <p className="text-red-600">
                This action cannot be undone.
              </p>
              {deleteError && (
                <p className="text-red-500">{deleteError}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
    </ContentLayout>
  );
}
