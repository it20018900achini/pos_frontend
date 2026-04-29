"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useCreateJournalMutation } from "@/Redux Toolkit/features/accounting/accountingApi";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Receipt, Wallet, Save, Loader2, Scale, Calendar as CalendarIcon } from "lucide-react";

export default function CustomForm({ data }) {
  const { toast } = useToast();
  const { userProfile, selectedBranchId } = useSelector((state) => state.user);
  const storeId = userProfile?.user?.store?.id;

  const [createJournal, { isLoading }] = useCreateJournalMutation();
  
  const [amounts, setAmounts] = useState({}); 
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const totals = useMemo(() => {
    let debitSum = 0;
    let creditSum = 0;
    if (!data?.rows) return { debitSum, creditSum };

    data?.rows?.forEach(row => {
      if (row.isInputTag) {
        const val = Math.abs(Number(amounts[row.accountId] || 0));
        if (row.creditOrDebit === "DEBIT") debitSum += val;
        else creditSum += val;
      }
    });
    return { debitSum, creditSum };
  }, [amounts, data?.rows]);

  const autoBalanceAmount = Math.abs(totals.debitSum - totals.creditSum);

  const handlePost = async () => {
    if (!storeId || (totals.debitSum === 0 && totals.creditSum === 0)) {
      toast({ title: "Empty Entry", description: "Please enter at least one amount.", variant: "destructive" });
      return;
    }

    try {
      const lines = data?.rows?.map((row) => {
        const amount = row.isInputTag ? Number(amounts[row.accountId] || 0) : autoBalanceAmount;
        return {
          accountId: Number(row.accountId),
          debit: row.creditOrDebit === "DEBIT" ? amount : 0,
          credit: row.creditOrDebit === "CREDIT" ? amount : 0,
        };
      }).filter(line => line.debit > 0 || line.credit > 0);

      await createJournal({
        entryDate: new Date(date).toISOString(),
        description: note || data.title,
        storeId: Number(storeId),
        branchId: selectedBranchId ? Number(selectedBranchId) : null,
        lines: lines,
      }).unwrap();
      
      toast({ title: "Success", description: "Journal Entry posted successfully." });
      setAmounts({});
      setNote("");
    } catch (err) {
      toast({ title: "Error", description: err.data?.message || "Submission failed.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* CARD CONTAINER */}
      <Card className="border-none shadow-2xl bg-white dark:bg-neutral-950 rounded-[2.5rem] overflow-hidden transition-colors duration-300">
        <CardContent className="p-10 space-y-8">
          
          {/* DATE INPUT */}
          <div className="flex gap-4">
             <div className="flex-1 space-y-2">
                <Label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest px-2">Entry Date</Label>
                <div className="relative">
                   <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                   <Input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none font-bold text-neutral-900 dark:text-neutral-100"
                   />
                </div>
             </div>
          </div>

          {/* DYNAMIC ROWS */}
          <div className="space-y-6">
            {data?.rows?.map((item) => (
              <div key={item.accountId} className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-2 px-2">
                  {item.creditOrDebit === "DEBIT" ? <Receipt size={12} className="text-emerald-500"/> : <Wallet size={12} className="text-rose-500"/>}
                  {item.label}
                </label>

                {item.isInputTag ? (
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-neutral-300 dark:text-neutral-700 group-focus-within:text-primary">$</span>
                    <Input 
                      type="number"
                      placeholder="0.00"
                      value={amounts[item.accountId] || ""}
                      onChange={(e) => setAmounts({...amounts, [item.accountId]: e.target.value})}
                      className="h-16 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-none pl-12 pr-6 text-xl font-bold focus:bg-white dark:focus:bg-neutral-800 focus:ring-4 focus:ring-primary/5 transition-all shadow-inner text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                ) : (
                  <div className="h-16 rounded-2xl bg-neutral-900 dark:bg-primary border-none px-8 flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-2">
                       <Scale size={16} className="text-primary dark:text-white animate-pulse" />
                       <span className="text-[10px] font-black text-white/50 dark:text-white/70 uppercase tracking-widest">Auto Balance ({item.creditOrDebit})</span>
                    </div>
                    <span className="text-xl font-black text-white">
                      ${autoBalanceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* REFERENCE NOTE */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest px-2">Reference Note</Label>
            <Textarea 
              placeholder="Add a description for this entry..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-none p-4 font-medium min-h-[100px] text-neutral-900 dark:text-neutral-100"
            />
          </div>

          {/* VISUAL BALANCE INDICATOR */}
          <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800">
              <div className="flex-1 text-center">
                <p className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase">Debits</p>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                   ${(totals.debitSum + (data?.rows?.find(r => !r.isInputTag)?.creditOrDebit === "DEBIT" ? autoBalanceAmount : 0)).toFixed(2)}
                </p>
              </div>
              <div className="w-[1px] h-10 bg-neutral-200 dark:bg-neutral-800" />
              <div className="flex-1 text-center">
                <p className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase">Credits</p>
                <p className="text-lg font-black text-rose-600 dark:text-rose-400">
                   ${(totals.creditSum + (data?.rows?.find(r => !r.isInputTag)?.creditOrDebit === "CREDIT" ? autoBalanceAmount : 0)).toFixed(2)}
                </p>
              </div>
          </div>

          {/* SUBMIT BUTTON */}
          <Button 
            onClick={handlePost}
            disabled={isLoading || (totals.debitSum === 0 && totals.creditSum === 0)}
            className="w-full h-16 rounded-2xl bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-black text-lg shadow-2xl transition-all active:scale-95"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <><Save className="mr-3" size={20} /> Post Transaction</>}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}