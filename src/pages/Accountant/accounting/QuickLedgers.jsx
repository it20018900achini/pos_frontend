"use client";

import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetQuickLedgersByIdQuery } from "@/Redux Toolkit/features/accounting/accountingApi";

import ContentLayout from '@/pages/dashboard/ContentLayout';
import CustomForm from './CustomForm';
import ManageQuickLedgers from './ManageQuickLedger';
import { Loader2, AlertCircle, Settings } from "lucide-react";

function QuickLedgers() {
  // 1. Destructure 'id' exactly as defined in your Route path=".../:id"
  const { id } = useParams(); 

  // 2. Fetch data using the ID from the URL
  const { 
    data: activeTemplate, 
    isLoading, 
    isError 
  } = useGetQuickLedgersByIdQuery(id, { skip: !id });

  // 3. Handle Loading State
  if (isLoading) {
    return (
      <ContentLayout title="Loading Ledger...">
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Initialising Template...</p>
        </div>
      </ContentLayout>
    );
  }

  // 4. Handle Error/Not Found State
  if (isError || !activeTemplate) {
    return (
      <ContentLayout title="Not Found">
        <div className="max-w-[1400px] mx-auto p-4">
          <div className="bg-white dark:bg-neutral-900 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-[3rem] p-16 text-center space-y-6">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-500">
                <AlertCircle size={40} />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-neutral-900 dark:text-white">Template Missing</h2>
                <p className="text-neutral-500 max-w-sm mx-auto">
                    We couldn't find ledger ID <span className="font-mono font-bold text-rose-500">#{id || "NULL"}</span>. 
                    Please select a valid template from the manager below.
                </p>
            </div>
          </div>
          <div className="mt-12">
            <ManageQuickLedgers />
          </div>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Quick Ledger" subTitle={activeTemplate.title}>
      <div className="max-w-[1400px] mx-auto p-4 space-y-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* MAIN FORM: Receives the 'activeTemplate' which contains 'rows' */}
          <div className="lg:col-span-2">
            <CustomForm data={activeTemplate}/>
          </div>

          {/* SIDEBAR: System Details */}
          <div className="hidden lg:block space-y-6">
            <div className="p-8 rounded-[2.5rem] shadow-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] mb-8 text-primary font-black">
                <Settings size={14} className="animate-spin-slow" />
                Configuration
              </div>
              
              <h4 className="text-2xl font-black mb-4">{activeTemplate.title}</h4>
              
              <div className="space-y-6">
                <p className="text-sm text-neutral-500 leading-relaxed">
                  This ledger is configured with <strong>{activeTemplate.rows?.length}</strong> automated rows.
                </p>

                <div className="space-y-3 pt-6 border-t border-neutral-50 dark:border-neutral-800">
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                      <span className="text-neutral-400">Template ID</span>
                      <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">#{activeTemplate.id}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                      <span className="text-neutral-400">Auto-Balance</span>
                      <span className="text-emerald-500">Active</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

  
      </div>
    </ContentLayout>
  );
}

export default QuickLedgers;