// src/pages/store/Brand/BrandsPage.jsx
import { useState } from "react";
import { useSelector } from "react-redux";

import BrandList from "./BrandList";
import BrandForm from "./BrandForm";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

export default function BrandsPage() {
  const { userProfile, initialized, loading } = useSelector((state) => state.user);
  const storeId = userProfile?.user.storeId;

  const [open, setOpen] = useState(false);

  if (loading || !initialized) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6">
    

      {/* Brand List */}
      <BrandList storeId={storeId} />
    </div>
  );
}
