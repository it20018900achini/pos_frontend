"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useCreateJournalMutation } from "@/Redux Toolkit/features/accounting/accountingApi";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Added for notes
import { Receipt, Wallet, Save, Loader2, Scale, Calendar as CalendarIcon, Notebook } from "lucide-react";
// --- ADD 'Label' TO THIS IMPORT LINE ---
import { Label } from "@/components/ui/label"; 
export default function CustomForm({ data }) {
  const { toast } = useToast();
  const { userProfile, selectedBranchId } = useSelector((state) => state.user);
  const storeId = userProfile?.user?.store?.id;

  const [createJournal, { isLoading }] = useCreateJournalMutation();
  
  const [amounts, setAmounts] = useState({}); 
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // 1. Calculate sums of user-entered amounts
 // 1. Update the useMemo with a guard
const totals = useMemo(() => {
  let debitSum = 0;
  let creditSum = 0;

  // Add this check: if data.rows is undefined, return zeros
  if (!data?.rows) return { debitSum, creditSum };

  data?.rows?.forEach(row => {
    if (row.isInputTag) {
      const val = Math.abs(Number(amounts[row.accountId] || 0));
      if (row.creditOrDebit === "DEBIT") debitSum += val;
      else creditSum += val;
    }
  });

  return { debitSum, creditSum };
}, [amounts, data?.rows]); // Use optional chaining here too
  // 2. Determine Auto-Balance amount
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
      }).filter(line => line.debit > 0 || line.credit > 0); // Only send lines with values

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
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-10 space-y-8">
          
          {/* Header Info */}
          <div className="flex gap-4">
             <div className="flex-1 space-y-2">
                <Label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-2">Entry Date</Label>
                <div className="relative">
                   <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                   <Input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    className="h-12 pl-12 rounded-xl bg-neutral-50 border-none font-bold"
                   />
                </div>
             </div>
          </div>

          {/* Dynamic Rows */}
          <div className="space-y-6">
            {data?.rows?.map((item) => (
              <div key={item.accountId} className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2 px-2">
                  {item.creditOrDebit === "DEBIT" ? <Receipt size={12} className="text-emerald-500"/> : <Wallet size={12} className="text-rose-500"/>}
                  {item.label}
                </label>

                {item.isInputTag ? (
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-neutral-300 group-focus-within:text-primary">$</span>
                    <Input 
                      type="number"
                      placeholder="0.00"
                      value={amounts[item.accountId] || ""}
                      onChange={(e) => setAmounts({...amounts, [item.accountId]: e.target.value})}
                      className="h-16 rounded-2xl bg-neutral-50 border-none pl-12 pr-6 text-xl font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
                    />
                  </div>
                ) : (
                  <div className="h-16 rounded-2xl bg-neutral-900 border-none px-8 flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-2">
                       <Scale size={16} className="text-primary animate-pulse" />
                       <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Auto Balance ({item.creditOrDebit})</span>
                    </div>
                    <span className="text-xl font-black text-white">
                      ${autoBalanceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Note Input */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-2">Reference Note</Label>
            <Textarea 
              placeholder="Add a description for this entry..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-2xl bg-neutral-50 border-none p-4 font-medium min-h-[100px]"
            />
          </div>

          {/* Visual Balance Indicator */}
          <div className="flex items-center gap-4 bg-neutral-50 p-6 rounded-3xl border border-neutral-100">
              <div className="flex-1 text-center">
                <p className="text-[9px] font-bold text-neutral-400 uppercase">Debits</p>
                <p className="text-lg font-black text-emerald-600">
                   ${(totals.debitSum + (data?.rows?.find(r => !r.isInputTag)?.creditOrDebit === "DEBIT" ? autoBalanceAmount : 0)).toFixed(2)}
                </p>
              </div>
              <div className="w-[1px] h-10 bg-neutral-200" />
              <div className="flex-1 text-center">
                <p className="text-[9px] font-bold text-neutral-400 uppercase">Credits</p>
                <p className="text-lg font-black text-rose-600">
                   ${(totals.creditSum + (data?.rows?.find(r => !r.isInputTag)?.creditOrDebit === "CREDIT" ? autoBalanceAmount : 0)).toFixed(2)}
                </p>
              </div>
          </div>

          <Button 
            onClick={handlePost}
            disabled={isLoading || (totals.debitSum === 0 && totals.creditSum === 0)}
            className="w-full h-16 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-black text-lg shadow-2xl transition-all active:scale-95"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <><Save className="mr-3" size={20} /> Post Transaction</>}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}