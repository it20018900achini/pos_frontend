import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function StoreSettings({ settings, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div>
        <Label>Store Name</Label>
        <Input
          value={settings.storeName}
          onChange={(e) => onChange("storeName", e.target.value)}
        />
      </div>

      <div>
        <Label>Store Type</Label>
        <Input
          value={settings.storeType}
          onChange={(e) => onChange("storeType", e.target.value)}
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          value={settings.storeEmail}
          onChange={(e) => onChange("storeEmail", e.target.value)}
        />
      </div>

      <div>
        <Label>Phone</Label>
        <Input
          value={settings.storePhone}
          onChange={(e) => onChange("storePhone", e.target.value)}
        />
      </div>

      <div className="md:col-span-2">
        <Label>Address</Label>
        <Input
          value={settings.storeAddress}
          onChange={(e) => onChange("storeAddress", e.target.value)}
        />
      </div>

      <div className="md:col-span-2">
        <Label>Description</Label>
        <Textarea
          value={settings.storeDescription}
          onChange={(e) => onChange("storeDescription", e.target.value)}
        />
      </div>

    </div>
  );
}