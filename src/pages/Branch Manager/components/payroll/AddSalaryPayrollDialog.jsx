"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetSalaryByEmployeeQuery, useSaveSalaryMutation } from "@/Redux Toolkit/features/salary/salaryApi";
import { useGeneratePayrollMutation } from "@/Redux Toolkit/features/payroll/payrollApi";

import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, Wallet, Percent, Loader2 } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import { toast } from "@/components/ui/use-toast";

export default function AddSalaryPayrollDialog({ open, setOpen, employeeId: initialEmployeeId }) {
  const { employees } = useSelector((state) => state.employee);
  
  const [employeeId, setEmployeeId] = useState(initialEmployeeId || "");
  const [form, setForm] = useState({
    basicSalary: "",
    hra: "",
    transport: "",
    medical: "",
    overtimeRate: "",
    epfPercentage: "",
    etfPercentage: "",
  });

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({ action: null });

  const { data, isFetching } = useGetSalaryByEmployeeQuery(Number(employeeId), { skip: !employeeId });
  const [saveSalary, { isLoading: isSaving }] = useSaveSalaryMutation();
  const [generatePayroll, { isLoading: isGenerating }] = useGeneratePayrollMutation();

  useEffect(() => {
    setEmployeeId(initialEmployeeId || "");
  }, [initialEmployeeId]);

  useEffect(() => {
    if (data) {
      setForm({
        basicSalary: data.basicSalary ?? "",
        hra: data.hra ?? "",
        transport: data.transport ?? "",
        medical: data.medical ?? "",
        overtimeRate: data.overtimeRate ?? "",
        epfPercentage: data.epfPercentage ?? "",
        etfPercentage: data.etfPercentage ?? "",
      });
    }
  }, [data]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleConfirmAction = async () => {
    if (!employeeId) return;

    try {
      if (confirmData.action === "save") {
        
        // 1. CLEAN & FLAT LOGIC: Convert empty strings to null
        // and explicitly set employeeId as a flat number
        const payload = {
          id: data?.id || null,
          employeeId: Number(employeeId), // FLAT ID as requested
          basicSalary: form.basicSalary === "" ? null : form.basicSalary,
          hra: form.hra === "" ? null : form.hra,
          transport: form.transport === "" ? null : form.transport,
          medical: form.medical === "" ? null : form.medical,
          overtimeRate: form.overtimeRate === "" ? null : form.overtimeRate,
          epfPercentage: form.epfPercentage === "" ? null : form.epfPercentage,
          etfPercentage: form.etfPercentage === "" ? null : form.etfPercentage,
        };

        await saveSalary(payload).unwrap();
        toast({ title: "Success", description: "Salary configuration saved." });
      } else if (confirmData.action === "generate") {
        await generatePayroll({ employeeId: Number(employeeId), year, month }).unwrap();
        toast({ title: "Success", description: `Payroll generated for ${month}/${year}` });
      }
      setConfirmOpen(false);
    } catch (err) {
      console.error("Operation failed:", err);
      toast({ title: "Error", description: "Operation failed", variant: "destructive" });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-0 border-none shadow-2xl">
          <DialogHeader className="p-8 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
            <DialogTitle className="text-xl font-black tracking-tight">Salary Configuration</DialogTitle>
            <DialogDescription>
              Set the standard pay structure for the selected staff member.
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Select Employee</Label>
                <Select value={String(employeeId)} onValueChange={(v) => setEmployeeId(v)}>
                  <SelectTrigger className="rounded-xl border-slate-200 h-11">
                    <SelectValue placeholder="Choose employee..." />
                  </SelectTrigger>
                  <SelectContent>
                    {employees?.map((emp) => (
                      <SelectItem key={emp.id} value={String(emp.id)}>
                        <div className="flex items-center gap-2 font-medium">
                           <User className="w-3.5 h-3.5 opacity-50" /> {emp.fullName}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Payroll Period</Label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="YYYY" value={year} onChange={(e) => setYear(Number(e.target.value))} className="rounded-xl h-11" />
                  <Input type="number" placeholder="MM" value={month} onChange={(e) => setMonth(Number(e.target.value))} className="rounded-xl h-11" />
                </div>
              </div>
            </div>

            <Separator className="opacity-50" />

            <div className="space-y-4 relative">
              {isFetching && (
                <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                  <Loader2 className="animate-spin text-indigo-600" />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5"><Wallet className="w-3 h-3"/> Basic Salary (LKR)</Label>
                <Input name="basicSalary" type="number" value={form.basicSalary} onChange={handleChange} className="rounded-xl h-12 font-mono font-bold text-lg text-indigo-600 bg-slate-50/50" placeholder="0.00" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase">HRA Allowance</Label>
                  <Input name="hra" type="number" value={form.hra} onChange={handleChange} className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase">Transport</Label>
                  <Input name="transport" type="number" value={form.transport} onChange={handleChange} className="rounded-xl h-11" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase">Medical</Label>
                  <Input name="medical" type="number" value={form.medical} onChange={handleChange} className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase">OT Rate /Hr</Label>
                  <Input name="overtimeRate" type="number" value={form.overtimeRate} onChange={handleChange} className="rounded-xl h-11" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Percent className="w-3 h-3"/> EPF %</Label>
                  <Input name="epfPercentage" type="number" value={form.epfPercentage} onChange={handleChange} className="rounded-xl h-11 bg-white dark:bg-slate-900" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Percent className="w-3 h-3"/> ETF %</Label>
                  <Input name="etfPercentage" type="number" value={form.etfPercentage} onChange={handleChange} className="rounded-xl h-11 bg-white dark:bg-slate-900" />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-slate-50 dark:bg-slate-950 flex gap-3 sm:justify-between items-center border-t border-slate-100 dark:border-white/5">
            <Button variant="ghost" className="rounded-xl px-6 h-11" onClick={() => setOpen(false)}>Cancel</Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="rounded-xl px-6 h-11 border-slate-300" 
                onClick={() => {setConfirmData({ action: "save" }); setConfirmOpen(true);}}
                disabled={!employeeId || isSaving}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Configuration"}
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 h-11 shadow-lg shadow-indigo-500/20" 
                onClick={() => {setConfirmData({ action: "generate" }); setConfirmOpen(true);}}
                disabled={!employeeId || isGenerating}
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Process Payroll"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={confirmData.action === "save" ? "Save Salary Draft?" : "Finalize Payroll?"}
        description={confirmData.action === "save"
          ? "This will update the employee's standard salary structure."
          : `Generate and finalize the payroll for ${month}/${year}?`}
        onConfirm={handleConfirmAction}
      />
    </>
  );
}