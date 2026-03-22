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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  DollarSign, CreditCard, User, TrendingUp, BookOpen, 
  HelpCircle, Pencil, Trash2, Plus, ChevronRight, 
  Layers, Search, FolderTree, AlertCircle
} from "lucide-react";

import LedgerWithDialog from "./LedgerWithDialog";
import ContentLayout from "../../../Dashboard/ContentLayout";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";

/* ================= THEME-AWARE META ================= */
const TYPE_META = {
  ASSET: { icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  LIABILITY: { icon: CreditCard, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  EQUITY: { icon: User, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  INCOME: { icon: TrendingUp, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
  EXPENSE: { icon: BookOpen, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  NA: { icon: HelpCircle, color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/20" },
};

const buildParentOptions = (accounts, level = 0) => {
  let result = [];
  accounts.forEach((acc) => {
    result.push({
      id: acc.id,
      type: acc.type,
      label: `${"— ".repeat(level)}${acc.code} • ${acc.name}`,
    });
    if (acc.children?.length) {
      result = result.concat(buildParentOptions(acc.children, level + 1));
    }
  });
  return result;
};

/* ================= TREE ROW COMPONENT ================= */
const AccountRow = ({ acc, level, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(true);
  const meta = TYPE_META[acc.type ?? "NA"];
  const Icon = meta.icon;
  const hasChildren = acc.children && acc.children.length > 0;

  return (
    <div className="w-full">
      <div className={cn(
        "group flex items-center justify-between py-2 px-3 rounded-xl transition-all duration-200 mb-1",
        "hover:bg-accent/50 border border-transparent hover:border-border/60",
        level === 0 ? "bg-muted/30" : "bg-transparent"
      )}
      style={{ marginLeft: `${level * 24}px`, width: `calc(100% - ${level * 24}px)` }}>
        
        <div className="flex items-center gap-3 overflow-hidden">
          {hasChildren ? (
            <button onClick={() => setIsOpen(!isOpen)} className="hover:bg-background p-1 rounded transition-colors">
              <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-90")} />
            </button>
          ) : (
            <div className="w-5.5 px-2 text-muted-foreground/30">•</div>
          )}
          
          <div className={cn("p-1.5 rounded-lg", meta.bg)}>
            <Icon className={cn("h-4 w-4", meta.color)} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 overflow-hidden">
            <span className="font-mono text-xs font-bold text-muted-foreground tracking-tighter">{acc.code}</span>
            <span className="font-semibold text-sm truncate text-foreground">{acc.name}</span>
            <Badge variant="outline" className={cn("text-[10px] uppercase font-black px-1.5 py-0", meta.color, meta.border)}>
              {acc.type}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <LedgerWithDialog accountId={acc.id} />
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => onEdit(acc)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-rose-500 hover:text-rose-600 hover:bg-rose-500/10" onClick={() => onDelete(acc)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {hasChildren && isOpen && (
        <div className="relative">
          {/* Visual Vertical Line for hierarchy */}
          <div className="absolute left-[10px] top-0 bottom-2 w-px bg-border/40" style={{ marginLeft: `${level * 24}px` }} />
          {acc.children.map((child) => (
            <AccountRow key={child.id} acc={child} level={level + 1} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
export default function ChartOfAccounts() {
  const storeId = useSelector((state) => state.user.userProfile?.user?.store?.id);
  const { data: accounts = [], isLoading, isError, refetch } = useGetChartOfAccountsQuery(storeId);
  const [createAccount, { isLoading: creating }] = useCreateChartOfAccountMutation();
  const [updateAccount] = useUpdateChartOfAccountMutation();
  const [deleteAccount, { isLoading: deleting }] = useDeleteChartOfAccountMutation();

  const [newAccount, setNewAccount] = useState({ code: "", name: "", type: "ASSET", parentId: null });
  const [editingAccount, setEditingAccount] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const parentOptions = useMemo(() => buildParentOptions(accounts), [accounts]);

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

  return (
    <ContentLayout loadingSpinner={isLoading} title="Chart of Accounts" subTitle="Manage your financial ledger structure.">
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        
        {/* ACTION BAR & CREATION */}
        <Card className="border-none shadow-xl bg-card overflow-hidden">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-black tracking-tight uppercase">Quick Add Account</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground px-1">Code</label>
                <Input placeholder="1001" value={newAccount.code} onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })} className="rounded-xl bg-muted/20 border-border/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground px-1">Name</label>
                <Input placeholder="Cash at Bank" value={newAccount.name} onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })} className="rounded-xl bg-muted/20 border-border/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground px-1">Type</label>
                <Select value={newAccount.type} onValueChange={(v) => setNewAccount({ ...newAccount, type: v, parentId: null })}>
                  <SelectTrigger className="rounded-xl bg-muted/20 border-border/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(TYPE_META).filter(t => t !== "NA").map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground px-1">Parent Hierarchy</label>
                <Select value={newAccount.parentId?.toString() ?? "NONE"} onValueChange={(v) => setNewAccount({ ...newAccount, parentId: v === "NONE" ? null : Number(v) })}>
                  <SelectTrigger className="rounded-xl bg-muted/20 border-border/50"><SelectValue placeholder="Root Level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Root Level (No Parent)</SelectItem>
                    {parentOptions.filter(p => p.type === newAccount.type).map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="mt-6 w-full md:w-auto px-8 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95" onClick={handleCreate} disabled={creating}>
              {creating ? "Creating..." : "Register Account"}
            </Button>
          </CardContent>
        </Card>

        {/* ACCOUNT TREE LIST */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-muted/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FolderTree className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Account Hierarchy</span>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input 
                  placeholder="Filter accounts..." 
                  className="bg-muted/50 border border-border/50 text-xs rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary w-48 md:w-64"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
          <div className="p-4 space-y-1 min-h-[400px]">
            {accounts.length > 0 ? (
              accounts.map((acc) => <AccountRow key={acc.id} acc={acc} level={0} onEdit={setEditingAccount} onDelete={setDeleteTarget} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Layers className="h-10 w-10 mb-4 opacity-20" />
                <p className="text-sm font-medium">No accounts found in this store.</p>
              </div>
            )}
          </div>
        </div>

        {/* MODALS */}
        <EditDialog editingAccount={editingAccount} setEditingAccount={setEditingAccount} updateAccount={updateAccount} parentOptions={parentOptions} refetch={refetch} />
        <DeleteDialog deleteTarget={deleteTarget} setDeleteTarget={setDeleteTarget} deleteAccount={deleteAccount} refetch={refetch} />
      </div>
    </ContentLayout>
  );
}

/* ================= MODAL COMPONENTS ================= */
const EditDialog = ({ editingAccount, setEditingAccount, updateAccount, parentOptions, refetch }) => (
  <Dialog open={!!editingAccount} onOpenChange={() => setEditingAccount(null)}>
    <DialogContent className="sm:max-w-[425px] rounded-3xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-black">Modify Account</DialogTitle>
        <DialogDescription>Update the ledger details for {editingAccount?.name}.</DialogDescription>
      </DialogHeader>
      {editingAccount && (
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-xs font-bold">Code</label>
            <Input className="col-span-3" value={editingAccount.code} onChange={e => setEditingAccount({...editingAccount, code: e.target.value})} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-xs font-bold">Name</label>
            <Input className="col-span-3" value={editingAccount.name} onChange={e => setEditingAccount({...editingAccount, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-xs font-bold">Type</label>
            <div className="col-span-3">
              <Select value={editingAccount.type} onValueChange={v => setEditingAccount({...editingAccount, type: v, parent: null})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.keys(TYPE_META).filter(t => t !== "NA").map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      <DialogFooter>
        <Button className="w-full rounded-xl font-bold" onClick={async () => {
          await updateAccount({ ...editingAccount }).unwrap();
          setEditingAccount(null);
          refetch();
        }}>Update Ledger</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const DeleteDialog = ({ deleteTarget, setDeleteTarget, deleteAccount, refetch }) => (
  <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
    <DialogContent className="rounded-3xl border-rose-500/20">
      <DialogHeader>
        <div className="bg-rose-500/10 w-fit p-3 rounded-full mb-2">
            <AlertCircle className="h-6 w-6 text-rose-600" />
        </div>
        <DialogTitle className="text-xl font-black">Permanent Deletion</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete <span className="font-bold text-foreground">{deleteTarget?.name}</span>? 
          This will fail if the account has existing transactions.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" className="rounded-xl font-bold" onClick={() => setDeleteTarget(null)}>Cancel</Button>
        <Button variant="destructive" className="rounded-xl font-bold px-8" onClick={async () => {
          await deleteAccount(deleteTarget.id).unwrap();
          setDeleteTarget(null);
          refetch();
        }}>Confirm Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);