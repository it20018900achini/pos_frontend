"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { 
  useGetQuickLedgersQuery, 
   
  useUpdateQuickLedgerMutation,
  useDeleteQuickLedgerMutation,
  useGetChartOfAccountsQuery 
} from "@/Redux Toolkit/features/accounting/accountingApi";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Plus, LayoutGrid, Receipt, Wallet, Settings2, Loader2, Save, ArrowLeftRight, Info } from "lucide-react";
import { useCreateJournalMutation } from "../../../Redux Toolkit/features/accounting/accountingApi";

export default function ManageQuickLedgers() {
  const { toast } = useToast();
  const { userProfile } = useSelector((state) => state.user);
  const storeId = userProfile?.user?.store?.id;

  // --- API HOOKS ---
  const { data: templates, isLoading: fetchingTemplates } = useGetQuickLedgersQuery(storeId, { skip: !storeId });
  const { data: accounts } = useGetChartOfAccountsQuery(storeId, { skip: !storeId });
  
  const [createTemplate, { isLoading: isCreating }] = useCreateJournalMutation(); 
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateQuickLedgerMutation();
  const [deleteTemplate] = useDeleteQuickLedgerMutation();

  // --- UI STATE ---
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", rows: [] });

  // --- UTILS: Flatten Accounts for Select ---
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

  // --- SMART UPDATE LOGIC ---
  const updateRow = (index, field, value) => {
    setFormData((prev) => {
      const newRows = [...prev.rows];
      newRows[index] = { ...newRows[index], [field]: value };

      // 1. AUTO-BALANCE: If updating Debit/Credit on 2-row template
      if (field === "creditOrDebit" && newRows.length === 2) {
        const otherIdx = index === 0 ? 1 : 0;
        newRows[otherIdx].creditOrDebit = value === "DEBIT" ? "CREDIT" : "DEBIT";
      }

      // 2. INPUT TOGGLE: Ensure only one side is the "System Offset"
      if (field === "isInputTag" && value === true && newRows.length === 2) {
        const otherIdx = index === 0 ? 1 : 0;
        newRows[otherIdx].isInputTag = false;
      }

      return { ...prev, rows: newRows };
    });
  };

  const handleSave = async () => {
    const hasDebit = formData.rows.some(r => r.creditOrDebit === "DEBIT");
    const hasCredit = formData.rows.some(r => r.creditOrDebit === "CREDIT");

    if (!formData.title || formData.rows.length < 2 || !hasDebit || !hasCredit) {
      return toast({ title: "Invalid Ledger", description: "Title and balanced rows required.", variant: "destructive" });
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-xl font-black flex items-center gap-2">
          <Settings2 size={20} className="text-primary" /> Template Manager
        </h2>
        <Button onClick={() => { setEditingId(null); setFormData({ title: "", rows: [] }); setIsOpen(true); }} className="rounded-xl font-bold">
          <Plus size={18} className="mr-1" /> New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates?.map((t) => (
          <Card key={t.id} className="rounded-[2rem] border-none shadow-lg bg-white dark:bg-neutral-900 group overflow-hidden">
            <CardHeader className="p-6 flex flex-row justify-between items-center bg-neutral-50 dark:bg-neutral-800/50">
               <span className="font-bold truncate max-w-[150px]">{t.title}</span>
               <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => {
                    setEditingId(t.id);
                    setFormData({ title: t.title, rows: t.rows.map(r => ({ ...r, accountId: r.accountId.toString() })) });
                    setIsOpen(true);
                  }} className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"><Settings2 size={14} /></Button>
               </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden">
          <DialogHeader className="p-8 bg-neutral-50 dark:bg-neutral-900 border-b">
            <h2 className="text-xl font-black">{editingId ? 'Modify' : 'Construct'} Ledger</h2>
          </DialogHeader>

          <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-neutral-400">Template Title</Label>
              <Input value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))} className="h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none px-4 font-bold" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] font-black uppercase text-neutral-400">Rows Configuration</Label>
                <Button variant="ghost" size="sm" onClick={() => setFormData(p => ({ ...p, rows: [...p.rows, { label: "", accountId: "", creditOrDebit: "DEBIT", isInputTag: true }] }))} className="text-primary font-bold">+ Row</Button>
              </div>

              {formData.rows.map((r, index) => (
                <div key={index} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 space-y-4">
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
            <Button onClick={handleSave} className="w-full h-14 rounded-2xl bg-primary font-black text-lg gap-2">
              {isCreating || isUpdating ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Update Configuration</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}