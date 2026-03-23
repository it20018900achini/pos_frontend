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
  Layers, Search, FolderTree, AlertCircle, Lock
} from "lucide-react";

import LedgerWithDialog from "./LedgerWithDialog";
import ContentLayout from "../../../Dashboard/ContentLayout";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

/* ================= SYSTEM CONSTANTS ================= */
const TYPE_META = {
  ASSET: { icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  LIABILITY: { icon: CreditCard, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  EQUITY: { icon: User, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  INCOME: { icon: TrendingUp, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
  EXPENSE: { icon: BookOpen, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  NA: { icon: HelpCircle, color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/20" },
};

const SYSTEM_TITLES = ["1000", "2000"]; 
const SYSTEM_SUBTITLES = ["1100", "1200", "2100", "2200"];
const PROTECTED_CODES = [...SYSTEM_TITLES, ...SYSTEM_SUBTITLES];

/* ================= HELPERS ================= */
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
  
  const isTitle = SYSTEM_TITLES.includes(acc.code);
  const isSubTitle = SYSTEM_SUBTITLES.includes(acc.code);
  const isProtected = PROTECTED_CODES.includes(acc.code);

  return (
    <div className="w-full">
      <div className={cn(
        "group relative flex items-center justify-between py-3 px-4 rounded-2xl transition-all duration-300 mb-2",
        "border border-white/5 backdrop-blur-sm", // Premium Glass Effect
        isTitle 
          ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-[0_0_20px_-12px_rgba(var(--primary),0.5)]" 
          : "hover:bg-white/5 hover:border-white/10 hover:translate-x-1",
        level === 0 && !isTitle ? "bg-white/[0.02]" : "bg-transparent"
      )}
      style={{ marginLeft: `${level * 28}px`, width: `calc(100% - ${level * 28}px)` }}>
        
        {/* Decorative Left Glow for Titles */}
        {isTitle && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]" />}

        <div className="flex items-center gap-4 overflow-hidden">
          {hasChildren ? (
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="hover:bg-white/10 p-1.5 rounded-lg transition-all active:scale-90"
            >
              <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform duration-300", isOpen && "rotate-90 text-primary")} />
            </button>
          ) : (
            <div className="w-7 flex justify-center opacity-20"><div className="h-1 w-1 rounded-full bg-current" /></div>
          )}
          
          <div className={cn(
            "p-2 rounded-xl shadow-inner transition-transform group-hover:scale-110 duration-500", 
            meta.bg, "ring-1 ring-white/10"
          )}>
            <Icon className={cn("h-4 w-4", meta.color)} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
            <span className={cn(
                "font-mono text-[10px] tracking-widest opacity-50 uppercase",
                isTitle ? "text-primary opacity-100 font-black" : "font-bold"
            )}>{acc.code}</span>
            
            <div className="flex items-center gap-3">
                <span className={cn(
                    "truncate tracking-tight transition-colors",
                    isTitle ? "text-base font-black uppercase tracking-normal" : "text-sm font-medium text-foreground/90 group-hover:text-foreground"
                )}>{acc.name}</span>
                
                {isProtected && (
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                       <Lock className="h-2.5 w-2.5 text-muted-foreground/60" />
                       <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-tighter">System</span>
                    </div>
                )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2">
            {!isProtected && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                <LedgerWithDialog accountId={acc.id} />
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-white/10" onClick={() => onEdit(acc)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-rose-500/10 text-rose-500/70 hover:text-rose-500" onClick={() => onDelete(acc)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
            <Badge variant="outline" className={cn(
                "text-[9px] uppercase font-black px-2 py-0.5 rounded-lg border-0 bg-white/5", 
                meta.color
            )}>
              {acc.type}
            </Badge>
        </div>
      </div>

      {hasChildren && isOpen && (
        <div className="relative ml-6">
          {/* Refined connection line with gradient */}
          <div className="absolute left-[2px] top-0 bottom-4 w-[1px] bg-gradient-to-b from-border/60 via-border/20 to-transparent" />
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
  const { data: accounts = [], isLoading, refetch } = useGetChartOfAccountsQuery(storeId);
  
  const [createAccount, { isLoading: creating }] = useCreateChartOfAccountMutation();
  const [updateAccount] = useUpdateChartOfAccountMutation();
  const [deleteAccount] = useDeleteChartOfAccountMutation();

  const [newAccount, setNewAccount] = useState({ code: "", name: "", type: "ASSET", parentId: null });
  const [editingAccount, setEditingAccount] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const parentOptions = useMemo(() => buildParentOptions(accounts), [accounts]);

  const handleCreate = async () => {
    if (!newAccount.code || !newAccount.name) {
        toast({ title: "Validation Error", description: "Code and Name are required.", variant: "destructive" });
        return;
    }

    if (!storeId) {
        toast({ title: "Context Error", description: "No Store ID found in session.", variant: "destructive" });
        return;
    }

    try {
        await createAccount({
            code: newAccount.code.trim(),
            name: newAccount.name.trim(),
            type: newAccount.type,
            storeId: Number(storeId),
            parent: newAccount.parentId ? { id: newAccount.parentId } : null,
        }).unwrap();
        
        toast({ title: "Success", description: "Account registered successfully." });
        setNewAccount({ code: "", name: "", type: "ASSET", parentId: null });
        refetch();
    } catch (err) {
        toast({ title: "Error", description: err.data?.message || "Failed to create account.", variant: "destructive" });
    }
  };

  return (
    <ContentLayout loadingSpinner={isLoading} title="Chart of Accounts" subTitle="Manage your financial ledger structure.">
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        
        {/* ADD FORM */}
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
            <Button className="mt-6 w-full md:w-auto px-8 rounded-xl font-bold" onClick={handleCreate} disabled={creating}>
              {creating ? "Creating..." : "Register Account"}
            </Button>
          </CardContent>
        </Card>

        {/* LIST */}
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
                  className="bg-muted/50 border border-border/50 text-xs rounded-full pl-9 pr-4 py-1.5 focus:outline-none w-48 md:w-64"
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
                <p className="text-sm font-medium">No accounts found.</p>
              </div>
            )}
          </div>
        </div>

        <EditDialog editingAccount={editingAccount} setEditingAccount={setEditingAccount} updateAccount={updateAccount} refetch={refetch} storeId={storeId} />
        <DeleteDialog deleteTarget={deleteTarget} setDeleteTarget={setDeleteTarget} deleteAccount={deleteAccount} refetch={refetch} />
      </div>
    </ContentLayout>
  );
}

const EditDialog = ({ editingAccount, setEditingAccount, updateAccount, refetch, storeId }) => (
  <Dialog open={!!editingAccount} onOpenChange={() => setEditingAccount(null)}>
    <DialogContent className="sm:max-w-[425px] rounded-3xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-black">Modify Account</DialogTitle>
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
        </div>
      )}
      <DialogFooter>
        <Button className="w-full rounded-xl font-bold" onClick={async () => {
          await updateAccount({ ...editingAccount, storeId: Number(storeId) }).unwrap();
          toast({ title: "Updated", description: "Account saved." });
          setEditingAccount(null);
          refetch();
        }}>Update Ledger</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const DeleteDialog = ({ deleteTarget, setDeleteTarget, deleteAccount, refetch }) => (
  <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
    <DialogContent className="rounded-3xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-black">Confirm Deletion</DialogTitle>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
        <Button variant="destructive" onClick={async () => {
          await deleteAccount(deleteTarget.id).unwrap();
          setDeleteTarget(null);
          refetch();
        }}>Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);