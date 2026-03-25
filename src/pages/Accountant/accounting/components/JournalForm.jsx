"use client";

import React, { useState, useMemo } from "react";
import {
  useCreateJournalMutation,
  useGetChartOfAccountsQuery,
} from "@/Redux Toolkit/features/accounting/accountingApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";
import { 
  Plus, 
  Trash2, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  FileText,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to flatten nested accounts
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

export default function JournalForm() {
  const { userProfile, selectedBranchId } = useSelector((state) => state.user);
  const storeId=userProfile?.user?.store?.id
  const { toast } = useToast();
  
  const { data: accountsNested = [] } = useGetChartOfAccountsQuery(userProfile?.user?.store?.id);
  const accounts = useMemo(() => flattenAccounts(accountsNested), [accountsNested]);

  const [createJournal, { isLoading }] = useCreateJournalMutation();

  const [journal, setJournal] = useState({
    date: new Date().toISOString().split('T')[0],
    description: "",
    lines: [
      { accountId: "", debit: 0, credit: 0 },
      { accountId: "", debit: 0, credit: 0 },
    ],
  });

  const totals = useMemo(() => {
    return journal.lines.reduce(
      (acc, line) => {
        acc.debit += Number(line.debit || 0);
        acc.credit += Number(line.credit || 0);
        return acc;
      },
      { debit: 0, credit: 0 }
    );
  }, [journal.lines]);

  const difference = Math.abs(totals.debit - totals.credit);
  const isBalanced = totals.debit > 0 && totals.debit === totals.credit;

  const handleChange = (index, field, value) => {
    setJournal((prev) => {
      const lines = [...prev.lines];
      lines[index] = { ...lines[index], [field]: value };
      
      // Auto-clear credit if debit is entered and vice versa (Standard Accounting UX)
      if (field === "debit" && value > 0) lines[index].credit = 0;
      if (field === "credit" && value > 0) lines[index].debit = 0;
      
      return { ...prev, lines };
    });
  };

  const addRow = () => {
    setJournal((prev) => ({
      ...prev,
      lines: [...prev.lines, { accountId: "", debit: 0, credit: 0 }],
    }));
  };

  const removeRow = (index) => {
    if (journal.lines.length <= 2) {
      toast({ title: "Journal must have at least 2 lines.", variant: "destructive" });
      return;
    }
    setJournal((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index),
    }));
  };

  const isValid = useMemo(() => {
    return (
      journal.date &&
      journal.description &&
      isBalanced &&
      journal.lines.every((l) => l.accountId && (l.debit > 0 || l.credit > 0))
    );
  }, [journal, isBalanced]);

  const handleSubmit = async () => {
    // Safety check: ensure storeId exists before proceeding
    if (!storeId) {
      toast({ 
        title: "Missing Context", 
        description: "Store ID not found. Please refresh or re-login.", 
        variant: "destructive" 
      });
      return;
    }

    try {
      const payload = {
        entryDate: new Date(journal.date).toISOString(),
        description: journal.description,
        storeId: Number(storeId), // ✅ Crucial fix: Include the store context
        branchId: selectedBranchId ? Number(selectedBranchId) : null,
        lines: journal.lines.map((l) => ({
          accountId: Number(l.accountId),
          debit: Number(l.debit) || 0,
          credit: Number(l.credit) || 0,
        })),
      };

      // Ensure your createJournal mutation is set up to receive this storeId
      await createJournal(payload).unwrap();
      
      toast({ title: "Success", description: "Journal entry posted successfully." });
      
      // Reset form
      setJournal({
        date: new Date().toISOString().split('T')[0],
        description: "",
        lines: [
          { accountId: "", debit: 0, credit: 0 },
          { accountId: "", debit: 0, credit: 0 }
        ],
      });
    } catch (err) {
      toast({ 
        title: "Error", 
        description: err.data?.message || "Failed to post journal entry.", 
        variant: "destructive" 
      });
    }
  };
// --- UTILS: Flatten Accounts for Select ---
const treeAccounts = useMemo(() => {
  const flatten = (nodes, level = 0) => {
    if (!nodes) return [];
    return nodes.reduce((acc, node) => {
      // Logic: If it has children, it is a parent/header and should be disabled
      const isParent = node.children && node.children.length > 0;
      
      return [
        ...acc, 
        { ...node, level, isParent }, 
        ...flatten(node.children, level + 1)
      ];
    }, []);
  };
  return flatten(accountsNested); // Use your raw nested data here
}, [accountsNested]);
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <Card className="border-none shadow-xl bg-card">
        <CardHeader className="border-b bg-muted/30 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                New Journal Entry
              </CardTitle>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                Manual Ledger Transaction
              </p>
            </div>
            
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all animate-in fade-in zoom-in",
              isBalanced 
                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400" 
                : "bg-amber-500/10 border-amber-500/50 text-amber-600 dark:text-amber-400"
            )}>
              {isBalanced ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {isBalanced ? "Balanced" : `Out of Balance: ${difference.toFixed(2)}`}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-8">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" /> Transaction Date
              </label>
              <Input
                type="date"
                value={journal.date}
                className="bg-muted/20 border-border/50 focus:ring-primary rounded-xl"
                onChange={(e) => setJournal({ ...journal, date: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                <Info className="h-3 w-3" /> Reference / Description
              </label>
              <Input
                placeholder="Ex: Monthly Rent Allocation"
                value={journal.description}
                className="bg-muted/20 border-border/50 focus:ring-primary rounded-xl"
                onChange={(e) => setJournal({ ...journal, description: e.target.value })}
              />
            </div>
          </div>

          

          {/* Table */}
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                  <th className="px-4 py-4 w-1/2">Account</th>
                  <th className="px-4 py-4 text-right">Debit</th>
                  <th className="px-4 py-4 text-right">Credit</th>
                  <th className="px-4 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 bg-card">
                {journal.lines.map((line, idx) => (
                  <tr key={idx} className="group hover:bg-muted/30 transition-colors">
                  <td className="p-3">
 <Select 
  value={line.accountId?.toString()} 
  onValueChange={(val) => handleChange(idx, "accountId", val)}
>
  <SelectTrigger className="w-full border-none bg-transparent focus:ring-0 shadow-none">
    <SelectValue placeholder="Select Account" />
  </SelectTrigger>
  
  <SelectContent className="max-h-[300px]">
    {treeAccounts.map((acc) => (
      <SelectItem
        key={acc.id}
        value={acc.id.toString()}
        // 1. Disable the item if it's a parent
        disabled={acc.isParent} 
        className={cn(
          "flex items-center gap-2",
          // 2. Add visual distinction for parents vs children
          acc.isParent ? "font-black text-neutral-900 dark:text-white opacity-100" : "pl-4"
        )}
        style={{ paddingLeft: `${acc.level * 12 + 10}px` }}
      >
        <div className="flex items-center gap-2">
          {/* Optional: Add a small dot for actual selectable accounts */}
          {!acc.isParent && <div className="w-1 h-1 rounded-full bg-primary/40" />}
          <span>{acc.name}</span>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
</td>
                    <td className="p-3">
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="text-right font-mono bg-transparent border-none focus:ring-0 focus:bg-muted/50 transition-all rounded-lg"
                        value={line.debit || ""}
                        onChange={(e) => handleChange(idx, "debit", parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="text-right font-mono bg-transparent border-none focus:ring-0 focus:bg-muted/50 transition-all rounded-lg"
                        value={line.credit || ""}
                        onChange={(e) => handleChange(idx, "credit", parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="p-3 text-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-rose-500 transition-colors"
                        onClick={() => removeRow(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="p-4 bg-muted/20 border-t border-border">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addRow}
                className="rounded-xl border-dashed border-2 hover:bg-background transition-all font-bold text-xs"
              >
                <Plus className="h-3 w-3 mr-2" /> Add Transaction Line
              </Button>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-4">
            <div className="grid grid-cols-2 gap-8 bg-muted/40 p-4 rounded-2xl border border-border/50">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Total Debit</p>
                <p className="text-xl font-mono font-bold text-foreground">{totals.debit.toFixed(2)}</p>
              </div>
              <div className="text-right border-l border-border pl-8">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Total Credit</p>
                <p className="text-xl font-mono font-bold text-foreground">{totals.credit.toFixed(2)}</p>
              </div>
            </div>

            <Button 
              size="lg"
              disabled={!isValid || isLoading}
              onClick={handleSubmit}
              className="w-full md:w-auto px-10 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 font-bold"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">Processing...</span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Post Journal Entry
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}