"use client";

import React, { useState } from 'react'
import PurchaseList from './PurchaseList'
import ContentLayout from '../../Dashboard/ContentLayout'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import PurchaseModal from "./PurchaseModal"

function Purchase() {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <ContentLayout 
      title="Purchase Management" 
      subTitle="Manage and track your branch's inbound stock"
      // Place the button in the header's right section
      right={
        <Button 
          onClick={() => setOpenCreate(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md h-10 px-5"
        >
          <Plus className="mr-2 h-4 w-4" /> New Purchase
        </Button>
      }
    >
      {/* Pass the state to the list if it needs to trigger a refresh after creation */}
      <PurchaseList />

      {/* The Modal remains here at the top level */}
      <PurchaseModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </ContentLayout>
  )
}

export default Purchase