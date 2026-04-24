"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { 
  useGetQuickLedgersQuery, 
  useUpdateQuickLedgerMutation,
  useDeleteQuickLedgerMutation,
  useGetChartOfAccountsQuery,
  useCreateQuickLedgerMutation
} from "@/Redux Toolkit/features/accounting/accountingApi";

import { Button } from "@/components/ui/button";
import { Card, CardHeader,CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Plus, Settings2, Loader2, Save, AlertTriangle } from "lucide-react";
import ContentLayout from "../../Dashboard/ContentLayout";

export default function ManageQuickLedgers() {
  const { toast } = useToast();
  const { userProfile } = useSelector((state) => state.user);
  const storeId = userProfile?.user?.store?.id;

  // --- API HOOKS ---
  const { data: templates, isLoading: fetchingTemplates } = useGetQuickLedgersQuery(storeId, { skip: !storeId });
  const { data: accounts } = useGetChartOfAccountsQuery(storeId, { skip: !storeId });
  
  const [createTemplate, { isLoading: isCreating }] = useCreateQuickLedgerMutation(); 
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateQuickLedgerMutation();
  const [deleteTemplate, { isLoading: isDeleting }] = useDeleteQuickLedgerMutation();

  // --- UI STATE ---
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // Tracks template to delete
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", rows: [] });

  // --- UTILS: Flatten Accounts ---
  const treeAccounts = useMemo(() => {
    const flatten = (nodes, level = 0) => {
      if (!nodes) return [];
      return nodes.reduce((acc, node) => {
        const isParent = node.children && node.children.length > 0;
        return [...acc, { ...node, level, isParent }, ...flatten(node.children, level + 1)];
      }, []);
    };
    return flatten(accounts);
  }, [accounts]);

  const updateRow = (index, field, value) => {
    setFormData((prev) => {
      const newRows = [...prev.rows];
      newRows[index] = { ...newRows[index], [field]: value };
      if (field === "creditOrDebit" && newRows.length === 2) {
        const otherIdx = index === 0 ? 1 : 0;
        newRows[otherIdx].creditOrDebit = value === "DEBIT" ? "CREDIT" : "DEBIT";
      }
      if (field === "isInputTag" && value === true && newRows.length === 2) {
        const otherIdx = index === 0 ? 1 : 0;
        newRows[otherIdx].isInputTag = false;
      }
      return { ...prev, rows: newRows };
    });
  };

  const removeRow = (index) => {
    setFormData(prev => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== index)
    }));
  };

  const handleDelete = async () => {
    try {
      await deleteTemplate(confirmDeleteId).unwrap();
      toast({ title: "Deleted", description: "Template removed successfully." });
      setConfirmDeleteId(null);
    } catch (err) {
      toast({ title: "Error", description: "Could not delete template.", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    const hasDebit = formData.rows.some(r => r.creditOrDebit === "DEBIT");
    const hasCredit = formData.rows.some(r => r.creditOrDebit === "CREDIT");
    if (!formData.title || formData.rows.length < 2 || !hasDebit || !hasCredit) {
      return toast({ title: "Invalid Ledger", description: "Balanced rows required.", variant: "destructive" });
    }

    const payload = {
      title: formData.title,
      storeId: Number(storeId),
      rows: formData.rows.map(({ accountId, ...r }) => ({
        ...r,
        accountId: Number(accountId),
        isInputTag: !!r.isInputTag,
        isVisible: true
      }))
    };

    try {
      if (editingId) {
        await updateTemplate({ id: editingId, ...payload }).unwrap();
      } else {
        await createTemplate(payload).unwrap();
      }
      toast({ title: "Success", description: "Template saved." });
      setIsOpen(false);
    } catch (err) {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    }
  };

  return (<ContentLayout 
  title="Template Manager" 
  subTitle="Standardize your financial operations with custom-built automated ledger templates." 
  right={
    <Button 
      onClick={() => { 
        setEditingId(null); 
        setFormData({ title: "", rows: [] }); 
        setIsOpen(true); 
      }} 
      className="rounded-xl font-bold bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all"
    >
      <Plus size={18} className="mr-1" /> New Template
    </Button>
  }
>
    <div className="space-y-6">
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates?.map((t) => (
  <Card key={t.id} className="rounded-[2rem] border-none shadow-lg bg-white dark:bg-neutral-900 group overflow-hidden border border-transparent hover:border-primary/20 transition-all duration-300">
    <CardHeader className="p-6 flex flex-row justify-between items-center bg-neutral-50/50 dark:bg-neutral-800/30 border-b border-border/50">
      <div className="flex flex-col gap-1">
        <span className="font-bold text-lg tracking-tight text-foreground">{t.title}</span>
        <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-widest">
          {t.rows.length} Account Lines
        </span>
      </div>
      
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
        <Button variant="outline" size="icon" onClick={() => {
          setEditingId(t.id);
          setFormData({ title: t.title, rows: t.rows.map(r => ({ ...r, accountId: r.accountId.toString() })) });
          setIsOpen(true);
        }} className="h-9 w-9 rounded-full bg-background hover:border-primary/50 hover:text-primary shadow-sm transition-all">
          <Settings2 size={15} />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setConfirmDeleteId(t.id)} className="h-9 w-9 rounded-full bg-background hover:border-rose-500/50 hover:text-rose-500 shadow-sm transition-all">
          <Trash2 size={15} />
        </Button>
      </div>
    </CardHeader>

    <CardContent className="p-6">
      <div className="space-y-3">
        {t.rows.map((row, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-border/40">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-8 rounded-full ${
                "",
                row.creditOrDebit === "DEBIT" ? "bg-indigo-500" : "bg-emerald-500"
              }`} />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">{row.label}</span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">{row.accountName}</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${
                row.creditOrDebit === "DEBIT" 
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" 
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              }`}>
                {row.creditOrDebit}
              </span>
              {row.isInputTag && (
                <span className="text-[9px] text-muted-foreground mt-1 italic flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" /> Manual Input
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
))}
      </div>

      {/* CREATE / EDIT DIALOG */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden">
          <DialogHeader className="p-8 bg-neutral-50 dark:bg-neutral-900 border-b text-left">
            <DialogTitle className="text-xl font-black">{editingId ? 'Modify' : 'Construct'} Ledger</DialogTitle>
          </DialogHeader>

          <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-neutral-400">Template Title</Label>
              <Input value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))} className="h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none px-4 font-bold" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] font-black uppercase text-neutral-400">Rows Configuration</Label>
                <Button variant="ghost" size="sm" onClick={() => setFormData(p => ({ ...p, rows: [...p.rows, { label: "", accountId: "", creditOrDebit: "DEBIT", isInputTag: true }] }))} className="text-primary font-bold hover:bg-primary/5 transition-colors">+ Add Row</Button>
              </div>

              {formData.rows.map((r, index) => (
                <div key={index} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 space-y-4 relative group/row">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeRow(index)}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white dark:bg-neutral-900 shadow-sm opacity-0 group-hover/row:opacity-100 transition-opacity text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 size={12} />
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Select value={r.accountId} onValueChange={v => updateRow(index, "accountId", v)}>
                      <SelectTrigger className="rounded-lg border-none bg-white dark:bg-neutral-900 font-medium">
                        <SelectValue placeholder="Select Account" />
                      </SelectTrigger>
                      <SelectContent>
                        {treeAccounts.map(acc => (
                          <SelectItem key={acc.id} value={acc.id.toString()} disabled={acc.isParent} style={{ paddingLeft: `${acc.level * 10}px` }}>
                            {acc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={r.creditOrDebit} onValueChange={v => updateRow(index, "creditOrDebit", v)}>
                      <SelectTrigger className={`rounded-lg border-none font-bold ${r.creditOrDebit === 'DEBIT' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DEBIT">DEBIT</SelectItem>
                        <SelectItem value="CREDIT">CREDIT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <Input placeholder="Label (e.g. Sales Tax)" value={r.label} onChange={e => updateRow(index, "label", e.target.value)} className="h-10 rounded-lg bg-white dark:bg-neutral-900 border-none flex-1" />
                    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-neutral-900 rounded-lg shadow-sm">
                        <Checkbox checked={r.isInputTag} onCheckedChange={v => updateRow(index, "isInputTag", !!v)} id={`in-${index}`} />
                        <label htmlFor={`in-${index}`} className="text-[9px] font-black uppercase text-neutral-500 cursor-pointer">Input Required</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="p-8 bg-neutral-50 dark:bg-neutral-900 border-t">
            <Button onClick={handleSave} disabled={isCreating || isUpdating} className="w-full h-14 rounded-2xl bg-primary font-black text-lg gap-2 shadow-lg shadow-primary/20">
              {isCreating || isUpdating ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Configuration</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent className="max-w-md rounded-3xl p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500">
              <AlertTriangle size={32} />
            </div>
            <DialogTitle className="text-xl font-black">Confirm Deletion</DialogTitle>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Are you sure you want to delete this template? This action cannot be undone and will remove it from all branch views.
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-3 mt-6">
            <Button variant="ghost" onClick={() => setConfirmDeleteId(null)} className="flex-1 rounded-xl font-bold">Cancel</Button>
            <Button onClick={handleDelete} disabled={isDeleting} className="flex-1 rounded-xl bg-rose-500 hover:bg-rose-600 font-bold gap-2">
              {isDeleting ? <Loader2 className="animate-spin" /> : <><Trash2 size={18} /> Delete Now</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </ContentLayout>
  );
}