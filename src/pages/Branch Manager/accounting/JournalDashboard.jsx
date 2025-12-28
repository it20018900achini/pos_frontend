"use client";

import React, { useState } from "react";
import {
  useGetChartOfAccountsQuery,
  useUpdateChartOfAccountMutation,
} from "@/Redux Toolkit/features/accounting/accountingApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  CreditCard,
  User,
  TrendingUp,
  BookOpen,
  HelpCircle,
  Pencil,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import JournalForm from "./components/JournalForm";

const TYPE_META = {
  ASSET: { icon: DollarSign },
  LIABILITY: { icon: CreditCard },
  EQUITY: { icon: User },
  INCOME: { icon: TrendingUp },
  EXPENSE: { icon: BookOpen },
  NA: { icon: HelpCircle },
};

export default function ChartOfAccounts() {
    useGetChartOfAccountsQuery();



  const [updateAccount] = useUpdateChartOfAccountMutation();

 

  const [editingAccount, setEditingAccount] = useState(null);


  
  return (
    <div className="space-y-6">

      {/* Categorized lists */}


      {/* 🔹 Edit Dialog */}
      {editingAccount && (
        <Dialog open onOpenChange={() => setEditingAccount(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                value={editingAccount.code}
                onChange={(e) =>
                  setEditingAccount({
                    ...editingAccount,
                    code: e.target.value,
                  })
                }
              />
              <Input
                value={editingAccount.name}
                onChange={(e) =>
                  setEditingAccount({
                    ...editingAccount,
                    name: e.target.value,
                  })
                }
              />
              <Select
                value={editingAccount.type ?? "NA"}
                onValueChange={(value) =>
                  setEditingAccount({
                    ...editingAccount,
                    type: value === "NA" ? null : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"].map(
                    (t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    )
                  )}
                  <SelectItem value="NA">N/A</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={async () => {
                  await updateAccount({
                    id: editingAccount.id,
                    code: editingAccount.code,
                    name: editingAccount.name,
                    type: editingAccount.type,
                  }).unwrap();
                  setEditingAccount(null);
                }}
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
