import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, Printer, Receipt, CreditCard, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getBranchById } from "@/Redux Toolkit/features/branch/branchThunks";
import BranchInfo from "./BranchInfo";

const Settings = () => {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.user);

  useEffect(() => {
    if (userProfile?.branchId && localStorage.getItem("jwt")) {
      dispatch(
        getBranchById({
          id: userProfile.branchId,
          jwt: localStorage.getItem("jwt"),
        })
      );
    }
  }, [dispatch, userProfile]);

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
    acceptUPI: true,
    acceptCard: true,
    upiId: "example@upi",
    cardTerminalId: "TERM12345",
  });

  const [discountSettings, setDiscountSettings] = useState({
    allowDiscount: true,
    maxDiscountPercentage: 10,
    requireManagerApproval: true,
    discountReasons: ["Damaged Product", "Bulk Purchase", "Regular Customer", "Promotional Offer"],
  });

  const handleChange = (setter) => (field, value) => setter((prev) => ({ ...prev, [field]: value }));

  const handleSaveSettings = (type) => {
    console.log(`Saving ${type} settings`, { printerSettings, taxSettings, paymentSettings, discountSettings });
  };

  const handlePrinterSettingsChange = handleChange(setPrinterSettings);
  const handleTaxSettingsChange = handleChange(setTaxSettings);
  const handlePaymentSettingsChange = handleChange(setPaymentSettings);
  const handleDiscountSettingsChange = handleChange(setDiscountSettings);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Branch Settings</h1>
      </div>

      <Tabs defaultValue="branch-info">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="branch-info" className="flex items-center gap-2">
            <Building className="h-4 w-4" /> Branch Info
          </TabsTrigger>
          {/* <TabsTrigger value="printer" className="flex items-center gap-2">
            <Printer className="h-4 w-4" /> Printer
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" /> Tax
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Payment
          </TabsTrigger>
          <TabsTrigger value="discount" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Discount
          </TabsTrigger> */}
        </TabsList>

        {/* Branch Info Tab */}
        <TabsContent value="branch-info">
          <BranchInfo />
        </TabsContent>

        {/* Printer Tab */}
        <TabsContent value="printer">
          <Card>
            <CardHeader>
              <CardTitle>POS Printer Settings</CardTitle>
              <CardDescription>Configure your receipt printer settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Printer Name</label>
                  <Input value={printerSettings.printerName} onChange={(e) => handlePrinterSettingsChange("printerName", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Paper Size</label>
                  <Select value={printerSettings.paperSize} onValueChange={(v) => handlePrinterSettingsChange("paperSize", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="58mm">58mm</SelectItem>
                      <SelectItem value="80mm">80mm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between"><span>Print Logo on Receipt</span><Switch checked={printerSettings.printLogo} onCheckedChange={(v) => handlePrinterSettingsChange("printLogo", v)} /></div>
                <div className="flex justify-between"><span>Print Customer Details</span><Switch checked={printerSettings.printCustomerDetails} onCheckedChange={(v) => handlePrinterSettingsChange("printCustomerDetails", v)} /></div>
                <div className="flex justify-between"><span>Print Itemized Tax</span><Switch checked={printerSettings.printItemizedTax} onCheckedChange={(v) => handlePrinterSettingsChange("printItemizedTax", v)} /></div>
              </div>

              <div>
                <label className="text-sm font-medium">Receipt Footer Text</label>
                <Input value={printerSettings.footerText} onChange={(e) => handlePrinterSettingsChange("footerText", e.target.value)} />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings("printer")} className="gap-2"><Save className="h-4 w-4" /> Save</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Tab */}
        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>Configure tax rates and rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between"><span>Enable GST</span><Switch checked={taxSettings.gstEnabled} onCheckedChange={(v) => handleTaxSettingsChange("gstEnabled", v)} /></div>
              {taxSettings.gstEnabled && (
                <div className="pl-6 border-l-2 border-gray-100 space-y-2">
                  <Input type="number" value={taxSettings.gstPercentage} onChange={(e) => handleTaxSettingsChange("gstPercentage", parseInt(e.target.value))} placeholder="GST %" />
                  <div className="flex justify-between"><span>Apply GST to All Products</span><Switch checked={taxSettings.applyGstToAll} onCheckedChange={(v) => handleTaxSettingsChange("applyGstToAll", v)} /></div>
                  <div className="flex justify-between"><span>Show Tax Breakdown on Receipt</span><Switch checked={taxSettings.showTaxBreakdown} onCheckedChange={(v) => handleTaxSettingsChange("showTaxBreakdown", v)} /></div>
                </div>
              )}
              <div className="flex justify-end"><Button onClick={() => handleSaveSettings("tax")} className="gap-2"><Save className="h-4 w-4" /> Save</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Configure accepted payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between"><span>Accept Cash</span><Switch checked={paymentSettings.acceptCash} onCheckedChange={(v) => handlePaymentSettingsChange("acceptCash", v)} /></div>
              <div className="flex justify-between"><span>Accept Card</span><Switch checked={paymentSettings.acceptCard} onCheckedChange={(v) => handlePaymentSettingsChange("acceptCard", v)} /></div>
              {paymentSettings.acceptCard && (
                <Input value={paymentSettings.cardTerminalId} onChange={(e) => handlePaymentSettingsChange("cardTerminalId", e.target.value)} placeholder="Card Terminal ID" />
              )}
              <div className="flex justify-end"><Button onClick={() => handleSaveSettings("payment")} className="gap-2"><Save className="h-4 w-4" /> Save</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discount Tab */}
        <TabsContent value="discount">
          <Card>
            <CardHeader>
              <CardTitle>Discount Rules</CardTitle>
              <CardDescription>Configure discount policies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between"><span>Allow Discounts</span><Switch checked={discountSettings.allowDiscount} onCheckedChange={(v) => handleDiscountSettingsChange("allowDiscount", v)} /></div>
              {discountSettings.allowDiscount && (
                <div className="pl-6 border-l-2 border-gray-100 space-y-2">
                  <Input type="number" value={discountSettings.maxDiscountPercentage} onChange={(e) => handleDiscountSettingsChange("maxDiscountPercentage", parseInt(e.target.value))} placeholder="Max Discount %" />
                  <div className="flex justify-between"><span>Require Manager Approval</span><Switch checked={discountSettings.requireManagerApproval} onCheckedChange={(v) => handleDiscountSettingsChange("requireManagerApproval", v)} /></div>
                  <div className="space-y-2">
                    {discountSettings.discountReasons.map((reason, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input value={reason} onChange={(e) => {
                          const reasons = [...discountSettings.discountReasons];
                          reasons[idx] = e.target.value;
                          handleDiscountSettingsChange("discountReasons", reasons);
                        }} />
                        <Button variant="ghost" size="icon" onClick={() => {
                          handleDiscountSettingsChange("discountReasons", discountSettings.discountReasons.filter((_, i) => i !== idx));
                        }}>✕</Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => handleDiscountSettingsChange("discountReasons", [...discountSettings.discountReasons, ""])}>Add Reason</Button>
                  </div>
                </div>
              )}
              <div className="flex justify-end"><Button onClick={() => handleSaveSettings("discount")} className="gap-2"><Save className="h-4 w-4" /> Save</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
