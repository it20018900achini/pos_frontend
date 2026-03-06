import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function SettingsHeader() {
  return (
    <div className="border-b pb-4">
      <h2 className="text-2xl font-semibold">Store Settings</h2>
      <p className="text-muted-foreground text-sm">
        Update your store information and contact details.
      </p>
    </div>
  );
}