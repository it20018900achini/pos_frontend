"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Building, Printer, Receipt, CreditCard, 
  Save, Percent, Plus, Trash2, CheckCircle2,
  ChevronRight, Info
} from "lucide-react";

import { getBranchById } from "@/Redux Toolkit/features/branch/branchThunks";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import BranchInfo from "./BranchInfo";
import ContentLayout from "../../Dashboard/ContentLayout";

const BranchSettings = () => {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.user);

  // --- STATE ---
  const [printerSettings, setPrinterSettings] = useState({
    printerName: "Epson TM-T88VI",
    paperSize: "80mm",
    printLogo: true,
    printCustomerDetails: true,
    printItemizedTax: true,
    footerText: "Thank you for shopping with us!",
  });

  const [taxSettings, setTaxSettings] = useState({
    gstEnabled: true,
    gstPercentage: 18,
    applyGstToAll: true,
    showTaxBreakdown: true,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    acceptCash: true,
    acceptCard: true,
    cardTerminalId: "TERM12345",
  });

  const [discountSettings, setDiscountSettings] = useState({
    allowDiscount: true,
    maxDiscountPercentage: 10,
    requireManagerApproval: true,
    discountReasons: ["Damaged Product", "Bulk Purchase", "Promotional Offer"],
  });

  // --- EFFECTS ---
  useEffect(() => {
    if (userProfile?.user.branchId && localStorage.getItem("jwt")) {
      dispatch(getBranchById({
        id: userProfile.user.branchId,
        jwt: localStorage.getItem("jwt"),
      }));
    }
  }, [dispatch, userProfile]);

  // --- HANDLERS ---
  const handleChange = (setter) => (field, value) => setter((prev) => ({ ...prev, [field]: value }));

  const handleSave = (type) => {
    // Logic for API call here
    console.log(`Saving ${type} settings`);
  };

  /**
   * REUSABLE SETTING ROW COMPONENT
   */
  const SettingRow = ({ label, description, children }) => (
    <div className="flex items-center justify-between py-4 group">
      <div className="space-y-0.5">
        <label className="text-sm font-bold text-slate-900 dark:text-white">{label}</label>
        <p className="text-xs text-slate-500 max-w-[400px]">{description}</p>
      </div>
      {children}
    </div>
  );

  return (
    <ContentLayout 
      title="Branch Configuration" 
      subTitle="Global rules and hardware setup for this specific location."
    >
      <div className="max-w-6xl mx-auto pb-10">
        <Tabs defaultValue="branch-info" className="flex flex-col md:flex-row gap-8">
          
          {/* --- SIDEBAR NAVIGATION --- */}
          <aside className="md:w-64 shrink-0">
            <TabsList className="flex flex-row md:flex-col h-auto w-full bg-transparent gap-1 p-0 justify-start overflow-x-auto">
              {[
                { id: "branch-info", label: "Branch Profile", icon: Building },
                { id: "printer", label: "POS Printer", icon: Printer },
                { id: "tax", label: "Tax Rules", icon: Receipt },
                { id: "payment", label: "Payments", icon: CreditCard },
                { id: "discount", label: "Discounting", icon: Percent },
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id}
                  className="w-full justify-start gap-3 px-4 py-3 rounded-xl border border-transparent data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:border-slate-200 dark:data-[state=active]:border-slate-800 data-[state=active]:shadow-sm transition-all text-slate-500 data-[state=active]:text-indigo-600"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-xs font-bold tracking-tight">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-500/5 rounded-2xl border border-indigo-100 dark:border-indigo-500/10">
               <div className="flex gap-2 mb-2"><Info className="w-4 h-4 text-indigo-600" /> <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 uppercase">Pro Tip</span></div>
               <p className="text-[10px] text-indigo-700/70 dark:text-indigo-400/70 leading-relaxed">
                 Settings saved here only apply to this branch location and do not affect the main store configuration.
               </p>
            </div>
          </aside>

          {/* --- CONTENT AREA --- */}
          <div className="flex-1">
            
            {/* 1. Branch Info */}
            <TabsContent value="branch-info" className="m-0 animate-in fade-in slide-in-from-right-4 duration-300">
               <BranchInfo />
            </TabsContent>

            {/* 2. Printer Settings */}
            <TabsContent value="printer" className="m-0 animate-in fade-in slide-in-from-right-4 duration-300">
              <SettingsCard 
                title="POS Hardware" 
                desc="Configure thermal printers and receipt layouts."
                onSave={() => handleSave("printer")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase">Printer Model</label>
                    <Input className="rounded-xl border-slate-200" value={printerSettings.printerName} onChange={(e) => handleChange(setPrinterSettings)("printerName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase">Paper Width</label>
                    <Select value={printerSettings.paperSize} onValueChange={(v) => handleChange(setPrinterSettings)("paperSize", v)}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="58mm text-xs">Standard (58mm)</SelectItem>
                        <SelectItem value="80mm text-xs">Wide (80mm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  <SettingRow label="Print Brand Logo" description="Include the store logo at the top of every receipt.">
                    <Switch checked={printerSettings.printLogo} onCheckedChange={(v) => handleChange(setPrinterSettings)("printLogo", v)} />
                  </SettingRow>
                  <SettingRow label="Customer Metadata" description="Display customer name and ID for loyalty tracking.">
                    <Switch checked={printerSettings.printCustomerDetails} onCheckedChange={(v) => handleChange(setPrinterSettings)("printCustomerDetails", v)} />
                  </SettingRow>
                </div>
              </SettingsCard>
            </TabsContent>

            {/* 3. Tax Rules */}
            <TabsContent value="tax" className="m-0 animate-in fade-in slide-in-from-right-4 duration-300">
              <SettingsCard title="Taxation Rules" desc="Define how taxes are calculated and displayed." onSave={() => handleSave("tax")}>
                <SettingRow label="Tax Compliance (GST)" description="Enable or disable tax calculation for this branch.">
                   <Switch checked={taxSettings.gstEnabled} onCheckedChange={(v) => handleChange(setTaxSettings)("gstEnabled", v)} />
                </SettingRow>
                
                {taxSettings.gstEnabled && (
                  <div className="mt-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-6">
                    <div className="max-w-[200px] space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Tax Rate (%)</label>
                      <div className="relative">
                        <Input type="number" value={taxSettings.gstPercentage} onChange={(e) => handleChange(setTaxSettings)("gstPercentage", e.target.value)} className="pr-8 rounded-xl" />
                        <Percent className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-medium">Auto-apply to all products</span>
                       <Switch checked={taxSettings.applyGstToAll} onCheckedChange={(v) => handleChange(setTaxSettings)("applyGstToAll", v)} />
                    </div>
                  </div>
                )}
              </SettingsCard>
            </TabsContent>

            {/* 4. Payment & Discounts - (Add more as needed following the same pattern) */}
            <TabsContent value="discount" className="m-0 animate-in fade-in slide-in-from-right-4 duration-300">
               <SettingsCard title="Discounting Policy" desc="Control how manual price overrides are handled." onSave={() => handleSave("discount")}>
                  <div className="space-y-4">
                    {discountSettings.discountReasons.map((reason, idx) => (
                      <div key={idx} className="flex gap-2 group">
                        <Input value={reason} className="rounded-xl flex-1" onChange={(e) => {
                          const reasons = [...discountSettings.discountReasons];
                          reasons[idx] = e.target.value;
                          handleChange(setDiscountSettings)("discountReasons", reasons);
                        }} />
                        <Button variant="ghost" size="icon" className="hover:text-rose-600 rounded-xl" onClick={() => {
                          handleChange(setDiscountSettings)("discountReasons", discountSettings.discountReasons.filter((_, i) => i !== idx));
                        }}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full border-dashed rounded-xl h-10 border-slate-300 text-slate-500" onClick={() => handleChange(setDiscountSettings)("discountReasons", [...discountSettings.discountReasons, ""])}>
                      <Plus className="w-4 h-4 mr-2" /> Add New Reason
                    </Button>
                  </div>
               </SettingsCard>
            </TabsContent>

          </div>
        </Tabs>
      </div>
    </ContentLayout>
  );
};

/**
 * WRAPPER CARD FOR SETTINGS SECTIONS
 */
const SettingsCard = ({ title, desc, children, onSave }) => (
  <Card className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden">
    <CardHeader className="px-8 pt-8">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-xl font-black text-slate-900 dark:text-white leading-tight">{title}</CardTitle>
          <CardDescription className="text-xs mt-1">{desc}</CardDescription>
        </div>
        <Button onClick={onSave} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md h-9 px-5">
           <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </div>
    </CardHeader>
    <CardContent className="px-8 pb-8 pt-4">
      <Separator className="mb-6 opacity-50" />
      {children}
    </CardContent>
  </Card>
);

export default BranchSettings;