"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { 
  useGetQuickLedgersQuery, 
  useCreateQuickLedgerMutation, 
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
import { Trash2, Plus, LayoutGrid, Receipt, Wallet, Settings2, Loader2, Save, AlertCircle } from "lucide-react";

export default function ManageQuickLedgers() {
  const { toast } = useToast();
  const { userProfile } = useSelector((state) => state.user);
  const storeId = userProfile?.user?.store?.id;

  // --- API HOOKS ---
  const { data: templates, isLoading: fetchingTemplates } = useGetQuickLedgersQuery(storeId, { skip: !storeId });
  const { data: accounts } = useGetChartOfAccountsQuery(storeId, { skip: !storeId });
  
  const [createTemplate, { isLoading: isCreating }] = useCreateQuickLedgerMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateQuickLedgerMutation();
  const [deleteTemplate] = useDeleteQuickLedgerMutation();

  // --- UI STATE ---
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Important: Changed 'row' to 'rows' to match Backend DTO
  const [formData, setFormData] = useState({ title: "", rows: [] });

  // --- UTILS ---
  const flattenAccounts = (nodes, level = 0) => {
    if (!nodes) return [];
    return nodes.reduce((acc, node) => {
      const isParent = node.children && node.children.length > 0;
      const flatNode = { id: node.id, name: node.name, code: node.code, level, isParent };
      return [...acc, flatNode, ...flattenAccounts(node.children, level + 1)];
    }, []);
  };

  const treeAccounts = useMemo(() => (accounts ? flattenAccounts(accounts) : []), [accounts]);

  // --- HANDLERS ---
  const resetForm = () => {
    setFormData({ title: "", rows: [] });
    setEditingId(null);
    setIsOpen(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleOpenEdit = (template) => {
    setEditingId(template.id);
    setFormData({
      title: template.title,
      // Map DTO rows back to form state
      rows: template.rows.map(r => ({ 
        ...r, 
        accountId: r.accountId?.toString() // Select components usually prefer strings
      }))
    });
    setIsOpen(true);
  };

  const addRow = () => {
    setFormData(prev => ({
      ...prev,
      rows: [...prev.rows, { 
        accountId: "", label: "", creditOrDebit: "DEBIT", 
        isInputTag: true, isVisible: true, type: "input", position: "top" 
      }]
    }));
  };

  const removeRow = (index) => {
    setFormData(prev => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== index)
    }));
  };

  const updateRow = (index, field, value) => {
    const updatedRows = [...formData.rows];
    updatedRows[index][field] = value;
    setFormData(prev => ({ ...prev, rows: updatedRows }));
  };

  const handleSave = async () => {
    // Basic Validation
    if (!formData.title || formData.rows.length < 2) {
      return toast({ title: "Incomplete", description: "Need title and min 2 rows.", variant: "destructive" });
    }

    // Transform to match QuickLedgerRequest.java
    const payload = {
      title: formData.title,
      storeId: Number(storeId),
      rows: formData.rows.map(({ accountId, ...r }) => ({ 
        ...r, 
        accountId: Number(accountId) 
      }))
    };

    try {
      if (editingId) {
        await updateTemplate({ id: editingId, ...payload }).unwrap();
      } else {
        await createTemplate(payload).unwrap();
      }
      toast({ title: "Success", description: "Template saved." });
      resetForm();
    } catch (err) {
      toast({ title: "Error", description: err.data?.message || "Failed to save.", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this template?")) {
      try {
        await deleteTemplate(id).unwrap();
        toast({ title: "Deleted", description: "Template removed." });
      } catch (err) {
        toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">Quick Ledger Config</h1>
          <p className="text-muted-foreground text-sm">Automated double-entry templates.</p>
        </div>
        <Button onClick={handleOpenCreate} className="h-12 px-6 rounded-xl font-bold gap-2">
          <Plus size={20} /> New Template
        </Button>
      </div>

      {/* DIALOG */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl rounded-[2rem] p-0 overflow-hidden bg-white dark:bg-neutral-950">
          <DialogHeader className="p-8 bg-neutral-50 dark:bg-neutral-900 border-b">
            <h2 className="text-2xl font-black">{editingId ? 'Modify' : 'Create'} Template</h2>
          </DialogHeader>

          <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Template Name</Label>
              <Input 
                value={formData.title}
                onChange={(e) => setFormData(p => ({...p, title: e.target.value}))}
                className="h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none px-4 font-bold"
                placeholder="e.g. Sales Template"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Rows</Label>
                <Button variant="ghost" size="sm" onClick={addRow} className="text-primary font-bold text-xs">+ Add Account</Button>
              </div>

              {formData.rows.map((r, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                  <div className="col-span-5">
                    <Select value={r.accountId} onValueChange={(v) => updateRow(index, "accountId", v)}>
                      <SelectTrigger className="h-10 rounded-lg border-none bg-white dark:bg-neutral-900 shadow-sm font-semibold">
                        <SelectValue placeholder="Account" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {treeAccounts.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id.toString()} disabled={acc.isParent}>
                            <div className="flex items-center" style={{ paddingLeft: `${acc.level * 12}px` }}>
                              <span className={acc.isParent ? "text-[10px] font-black text-neutral-400 uppercase" : "font-medium"}>
                                {!acc.isParent && <span className="mr-2 text-[9px] font-mono bg-neutral-100 dark:bg-neutral-800 px-1">{acc.code}</span>}
                                {acc.name}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-4">
                    <Input 
                      placeholder="Label (e.g. Cash)" 
                      value={r.label}
                      onChange={(e) => updateRow(index, "label", e.target.value)}
                      className="h-10 rounded-lg border-none bg-white dark:bg-neutral-900 shadow-sm"
                    />
                  </div>

                  <div className="col-span-3 flex items-center gap-2">
                    <Select value={r.creditOrDebit} onValueChange={(v) => updateRow(index, "creditOrDebit", v)}>
                      <SelectTrigger className="h-10 rounded-lg border-none bg-white dark:bg-neutral-900 shadow-sm font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DEBIT">DEBIT</SelectItem>
                        <SelectItem value="CREDIT">CREDIT</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => removeRow(index)} className="text-neutral-400 hover:text-rose-500">
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="col-span-12 flex items-center space-x-2">
                    <Checkbox id={`chk-${index}`} checked={r.isInputTag} onCheckedChange={(v) => updateRow(index, "isInputTag", v)} />
                    <label htmlFor={`chk-${index}`} className="text-[10px] font-bold text-neutral-500 uppercase cursor-pointer">Require Input</label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="p-8 bg-neutral-50 dark:bg-neutral-900 border-t">
            <Button onClick={handleSave} disabled={isCreating || isUpdating} className="w-full h-14 rounded-2xl bg-primary font-black text-lg">
              {(isCreating || isUpdating) ? <Loader2 className="animate-spin" /> : <Save size={20} className="mr-2" />}
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* LIST GRID */}
      {fetchingTemplates ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-neutral-300" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates?.map((item) => (
            <Card key={item.id} className="border-none shadow-xl bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden group">
              <CardHeader className="p-8 pb-4 flex flex-row justify-between items-start">
                <div className="p-4 bg-primary/10 rounded-2xl"><LayoutGrid className="text-primary" size={24} /></div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)} className="rounded-full text-neutral-400 hover:text-primary"><Settings2 size={18} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="rounded-full text-neutral-400 hover:text-rose-500"><Trash2 size={18} /></Button>
                </div>
              </CardHeader>
              <div className="px-8 pb-8 space-y-4">
                <h3 className="text-xl font-black">{item.title}</h3>
                <div className="space-y-2">
                  {item.rows?.map((r, i) => (
                    <div key={i} className="flex justify-between text-[10px] font-bold p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <span className="flex items-center gap-2 uppercase tracking-tighter">
                        {r.creditOrDebit === 'DEBIT' ? <Receipt size={12} className="text-emerald-500"/> : <Wallet size={12} className="text-rose-500"/>}
                        {r.label}
                      </span>
                      <span className="text-neutral-400">{r.isInputTag ? "INPUT" : "FIXED"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}