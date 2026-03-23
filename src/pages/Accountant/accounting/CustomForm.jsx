"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useCreateJournalMutation } from "@/Redux Toolkit/features/accounting/accountingApi";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Receipt, Wallet, Save, Loader2, Scale } from "lucide-react";

export default function CustomForm({ data }) {
  const { toast } = useToast();
  const { userProfile, selectedBranchId } = useSelector((state) => state.user);
  const storeId = userProfile?.user?.store?.id;

  const [createJournal, { isLoading }] = useCreateJournalMutation();
  
  const [amounts, setAmounts] = useState({}); // Stores { [accountId]: value }
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // 1. Calculate the sums of user-entered Debits and Credits
  const totals = useMemo(() => {
    let debitSum = 0;
    let creditSum = 0;

    data.row.forEach(row => {
      if (row.isInputTag) {
        const val = Number(amounts[row.accountId] || 0);
        if (row.creditOrDebit === "DEBIT") debitSum += val;
        else creditSum += val;
      }
    });

    return { debitSum, creditSum };
  }, [amounts, data.row]);

  // 2. Determine the "Auto-Balance" amount for the non-input row
  // Formula: Math.abs(Total Debits - Total Credits)
  const autoBalanceAmount = Math.abs(totals.debitSum - totals.creditSum);

  const handlePost = async () => {
    if (!storeId || (totals.debitSum === 0 && totals.creditSum === 0)) {
      toast({ title: "Invalid Entry", description: "Please enter at least one amount.", variant: "destructive" });
      return;
    }

    try {
      const lines = data.row.map((row) => {
        // If it's a user input, take the value. 
        // If it's the system row, take the autoBalanceAmount.
        const amount = row.isInputTag ? Number(amounts[row.accountId] || 0) : autoBalanceAmount;

        return {
          accountId: row.accountId,
          debit: row.creditOrDebit === "DEBIT" ? amount : 0,
          credit: row.creditOrDebit === "CREDIT" ? amount : 0,
        };
      });

      await createJournal({
        entryDate: new Date(date).toISOString(),
        description: note || data.title,
        storeId: Number(storeId),
        branchId: selectedBranchId ? Number(selectedBranchId) : null,
        lines: lines,
      }).unwrap();
      
      toast({ title: "Posted", description: "Entry balanced and saved." });
      setAmounts({});
    } catch (err) {
      toast({ title: "Error", description: "Submission failed.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-10 space-y-8">
          
          <div className="space-y-6">
            {data.row.map((item) => (
              <div key={item.accountId} className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
                  {item.creditOrDebit === "DEBIT" ? <Receipt size={12} className="text-emerald-500"/> : <Wallet size={12} className="text-rose-500"/>}
                  {item.label} ({item.creditOrDebit})
                </label>

                {item.isInputTag ? (
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-300 group-focus-within:text-primary">$</span>
                    <Input 
                      type="number"
                      placeholder="0.00"
                      value={amounts[item.accountId] || ""}
                      onChange={(e) => setAmounts({...amounts, [item.accountId]: e.target.value})}
                      className="h-16 rounded-2xl bg-slate-50 border-none pl-12 pr-6 text-xl font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
                    />
                  </div>
                ) : (
                  <div className="h-16 rounded-2xl bg-slate-900 border-none px-8 flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-2">
                       <Scale size={16} className="text-primary animate-pulse" />
                       <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">System Offset</span>
                    </div>
                    <span className="text-xl font-black text-white">
                      ${autoBalanceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Visual Balance Indicator */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
             <div className="flex-1 text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Total Debits</p>
                <p className="text-sm font-black text-emerald-600">${totals.debitSum.toFixed(2)}</p>
             </div>
             <div className="w-[1px] h-8 bg-slate-200" />
             <div className="flex-1 text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Total Credits</p>
                <p className="text-sm font-black text-rose-600">
                   {/* If the auto-offset is a CREDIT, add it to the display total */}
                   ${(totals.creditSum + (data.row.find(r => !r.isInputTag)?.creditOrDebit === "CREDIT" ? autoBalanceAmount : 0)).toFixed(2)}
                </p>
             </div>
          </div>

          <Button 
            onClick={handlePost}
            disabled={isLoading || autoBalanceAmount === 0 && totals.debitSum === 0}
            className="w-full h-16 rounded-[1.5rem] bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-2xl transition-all active:scale-95"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <><Save className="mr-3" size={20} /> Post Balanced Entry</>}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}