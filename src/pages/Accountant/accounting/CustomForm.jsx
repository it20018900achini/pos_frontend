"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useCreateJournalMutation } from "@/Redux Toolkit/features/accounting/accountingApi";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Receipt, Wallet, Calendar as CalendarIcon, Save, Loader2, ArrowRightLeft, Info } from "lucide-react";

export default function CustomForm({ data }) {
  const { toast } = useToast();
  const { userProfile, selectedBranchId } = useSelector((state) => state.user);
  const storeId = userProfile?.user?.store?.id;

  const [createJournal, { isLoading }] = useCreateJournalMutation();
  
  const [amounts, setAmounts] = useState({});
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Sort by position (top first)
  const sortedRows = useMemo(() => {
    return [...data.row].sort((a, b) => (a.position === 'top' ? -1 : 1));
  }, [data.row]);

  // Total balance calculation
  const total = useMemo(() => {
    return Object.values(amounts).reduce((sum, val) => sum + Number(val || 0), 0);
  }, [amounts]);

  const handlePost = async () => {
    if (!storeId || total <= 0) {
      toast({ title: "Check Amount", description: "Entry cannot be zero.", variant: "destructive" });
      return;
    }

    try {
      const lines = data.row.map((row) => ({
        accountId: row.accountId,
        debit: row.creditOrDebit === "DEBIT" ? (row.isInputTag ? Number(amounts[row.accountId] || 0) : total) : 0,
        credit: row.creditOrDebit === "CREDIT" ? (row.isInputTag ? Number(amounts[row.accountId] || 0) : total) : 0,
      }));

      await createJournal({
        entryDate: new Date(date).toISOString(),
        description: note || data.title,
        storeId: Number(storeId),
        branchId: selectedBranchId ? Number(selectedBranchId) : null,
        lines: lines,
      }).unwrap();
      
      toast({ title: "Success", description: "Record Secured." });
      setAmounts({});
      setNote("");
    } catch (err) {
      toast({ title: "Error", description: "Failed to post entry.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <Card className="border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-white/90 backdrop-blur-xl rounded-[3rem] overflow-hidden border border-white/40">
        <CardContent className="p-12 space-y-10">
          
          {/* Dynamic Rows based on Data */}
          <div className="space-y-10">
            {sortedRows.map((item) => (
              <div key={item.accountId} className="space-y-4">
                <div className="flex justify-between items-end px-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      {item.creditOrDebit === "DEBIT" ? <Receipt size={14} className="text-primary"/> : <Wallet size={14} className="text-primary"/>}
                      {item.label}
                    </label>
                    {item.description && (
                       <p className="text-[10px] text-slate-300 italic flex items-center gap-1">
                         <Info size={10} /> {item.description}
                       </p>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-200 bg-slate-50 px-2 py-0.5 rounded uppercase tracking-tighter">Code: {item.code}</span>
                </div>

                {item.isInputTag ? (
                  <div className="relative group overflow-hidden rounded-[2.5rem]">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-200 group-focus-within:text-primary transition-colors">$</span>
                    <input 
                      type="number"
                      placeholder={item.placeholder || "0.00"}
                      value={amounts[item.accountId] || ""}
                      onChange={(e) => setAmounts({...amounts, [item.accountId]: e.target.value})}
                      className="w-full h-24 bg-slate-50 border-none pl-16 pr-10 text-5xl font-black tracking-tighter focus:bg-white focus:ring-8 focus:ring-primary/5 transition-all outline-none placeholder:text-slate-100 text-slate-900"
                    />
                  </div>
                ) : (
                  <div className="h-24 rounded-[2.5rem] bg-slate-900 border-none px-10 flex items-center justify-between shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                          <ArrowRightLeft className="text-primary" size={20} />
                       </div>
                       <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Settlement Account</span>
                    </div>
                    <span className="text-4xl font-black text-white tracking-tighter">
                      ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Form Footer Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Reference Memo</label>
              <Input 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex: Office supplies purchase"
                className="h-16 rounded-[1.5rem] bg-slate-50/50 border-none px-6 font-bold text-lg focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Posting Date</label>
              <Input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-16 rounded-[1.5rem] bg-slate-50/50 border-none px-6 font-bold text-lg focus:bg-white transition-all"
              />
            </div>
          </div>

          <Button 
            onClick={handlePost}
            disabled={isLoading || total <= 0}
            className="w-full h-24 rounded-[2.5rem] bg-slate-900 hover:bg-slate-800 text-white font-black text-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] transition-all active:scale-[0.98] group"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (
              <div className="flex items-center">
                <Save className="mr-4 group-hover:rotate-12 transition-transform" size={28} />
                Confirm Record
              </div>
            )}
          </Button>

        </CardContent>
      </Card>

      <div className="flex justify-center items-center gap-3 py-4">
         <span className="w-2 h-2 rounded-full bg-emerald-500" />
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Encrypted Ledger Link Secure</span>
      </div>
    </div>
  );
}