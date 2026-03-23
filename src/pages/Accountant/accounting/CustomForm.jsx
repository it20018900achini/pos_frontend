"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { 
  useCreateJournalMutation, 
  useGetChartOfAccountsQuery 
} from "@/Redux Toolkit/features/accounting/accountingApi";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { 
  Sparkles, Wallet, Receipt, 
  Calendar as CalendarIcon, CreditCard, Save, Loader2 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Reuse your flattening helper
const flattenAccounts = (accounts) => {
  let result = [];
  const traverse = (accList) => {
    accList.forEach((acc) => {
      result.push(acc);
      if (acc.children?.length) traverse(acc.children);
    });
  };
  traverse(accounts || []);
  return result;
};

export default function SimpleExpenseForm() {
  const { toast } = useToast();
  const { userProfile, selectedBranchId } = useSelector((state) => state.user);
  const storeId = userProfile?.user?.store?.id;

  // API Hooks
  const { data: accountsNested = [] } = useGetChartOfAccountsQuery(storeId, { skip: !storeId });
  const [createJournal, { isLoading }] = useCreateJournalMutation();

  const accounts = useMemo(() => flattenAccounts(accountsNested), [accountsNested]);

  const [expense, setExpense] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    accountId: "", // The Expense Account (Debit)
  });

  const handlePost = async () => {
    if (!storeId || !expense.accountId || !expense.amount) return;

    try {
      const payload = {
        entryDate: new Date(expense.date).toISOString(),
        description: expense.description || "Quick Expense",
        storeId: Number(storeId),
        branchId: selectedBranchId ? Number(selectedBranchId) : null,
        lines: [
          { 
            accountId: Number(expense.accountId), 
            debit: Number(expense.amount), 
            credit: 0 
          },
          { 
            accountId: 1, // 🚨 REPLACE with your actual Cash Account ID (e.g., from a constant)
            debit: 0, 
            credit: Number(expense.amount) 
          }
        ]
      };

      await createJournal(payload).unwrap();
      
      toast({ title: "Success", description: "Expense recorded and balanced." });
      setExpense({ ...expense, amount: "", description: "", accountId: "" });
    } catch (err) {
      toast({ 
        title: "Error", 
        description: err.data?.message || "Failed to post expense.", 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 md:pt-12">
      <div className="space-y-8">
        <div className="space-y-2 px-2">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <Sparkles size={14} /> Quick Ledger
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Record Expense</h1>
        </div>

        <Card className="border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-10 space-y-8">
            
            {/* Amount Hero */}
            <div className="relative group flex flex-col items-center justify-center py-8 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Amount to Debit</span>
              <div className="flex items-center">
                <span className="text-2xl font-black text-slate-300 mr-2">$</span>
                <input 
                  type="number"
                  placeholder="0.00"
                  value={expense.amount}
                  onChange={(e) => setExpense({...expense, amount: e.target.value})}
                  className="bg-transparent text-5xl font-black tracking-tighter w-full max-w-[220px] text-center outline-none placeholder:text-slate-200"
                />
              </div>
            </div>

            <div className="grid gap-6">
              {/* Account Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Receipt size={12} /> Expense Category
                </label>
                <Select 
                  value={expense.accountId} 
                  onValueChange={(v) => setExpense({...expense, accountId: v})}
                >
                  <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none px-6 text-base font-bold">
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id.toString()} className="py-3">
                        <div className="flex justify-between items-center w-64">
                          <span className="font-bold text-sm">{acc.name}</span>
                          <span className="text-[10px] font-mono opacity-40">{acc.code}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes / Ref</label>
                <Input 
                  placeholder="What was this for?"
                  value={expense.description}
                  onChange={(e) => setExpense({...expense, description: e.target.value})}
                  className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <CalendarIcon size={12} /> Date
                  </label>
                  <Input 
                    type="date"
                    value={expense.date}
                    onChange={(e) => setExpense({...expense, date: e.target.value})}
                    className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Wallet size={12} /> Paid From
                  </label>
                  <div className="h-14 rounded-2xl bg-slate-100/50 border border-slate-100 px-6 flex items-center gap-3">
                    <CreditCard size={14} className="text-primary" />
                    <span className="text-xs font-black uppercase text-slate-600">Cash Account</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handlePost}
              disabled={isLoading || !expense.amount || !expense.accountId}
              className="w-full h-16 rounded-[1.5rem] bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl transition-all active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <><Save className="mr-3" size={20} /> Post Expense</>}
            </Button>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}