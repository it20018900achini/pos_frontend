import React from 'react'
import ContentLayout from '@/pages/dashboard/ContentLayout'
import CustomForm from './CustomForm'

function QuickLedgers() {
  const data = {
    title: "Stationary Expense",
    slug: "stationary-purchase",
    row: [
      {
        accountId: 22,
        code: 5001, 
        label: "Stationary Items",
        creditOrDebit: "DEBIT",
        type: "input", 
        isInputTag: true,
        isVisible: true,
        placeholder: "Enter cost of items...",
        defaultValue: "", 
        position: "top", 
      },
      {
        accountId: 4,
        code: 1001, 
        label: "Cash Account",
        creditOrDebit: "CREDIT",
        type: "text-content", 
        isInputTag: true, 
        isVisible: true,
        position: "bottom",
        description: "Payment will be deducted from main vault", 
      }
    ]
  }

  return (
    <ContentLayout title="Quick Ledger" subTitle={data?.title}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-[1400px] mx-auto">
        
        {/* Main Form Area */}
        <div className="lg:col-span-2">
          <CustomForm data={data}/>
        </div>

        {/* Info Sidebar */}
        <div className="hidden lg:block space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-800">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> 
              Accounting Logic
            </div>
            
            <h4 className="text-xl font-bold mb-3">Double Entry</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              This template uses a pre-configured offset. Entering a value in 
              <span className="text-white font-medium ml-1 italic underline decoration-primary">
                {data.row.find(r => r.isInputTag)?.label}
              </span> 
              will create a balanced ledger entry automatically.
            </p>

            <div className="space-y-4 pt-6 border-t border-slate-800">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Template ID</span>
                  <span className="text-[10px] font-mono text-slate-300">#{data.slug}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">System Mode</span>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded">Auto-Balance</span>
               </div>
            </div>
          </div>
        </div>

      </div>
    </ContentLayout>
  )
}

export default QuickLedgers