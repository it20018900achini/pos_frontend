import React, { useState } from 'react'
import PayrollTable from '../components/payroll/PayrollTable'
import ContentLayout from "../../Dashboard/ContentLayout";
// import EmployeePayrollDetail from "../components/payroll/EmployeePayrollDetail"; // Optional detail view

function Payroll() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  return (
    <ContentLayout 
      title="Payroll Management" 
      subTitle="Manage employee salaries, approvals, and payments for the current month."
    >
      <div className="grid grid-cols-1 gap-6">
        {/* The Main Table */}
        <div className={selectedEmployeeId ? "lg:col-span-2" : "col-span-1"}>
          <PayrollTable 
            onSelectEmployee={(id) => setSelectedEmployeeId(id)}
            onActionComplete={() => {
              console.log("Payroll updated successfully");
              // You could trigger a global toast notification here
            }}
          />
        </div>

        {/* Optional: Detail Sidebar or Modal */}
        {selectedEmployeeId && (
          <div className="p-4 border rounded-xl bg-neutral-50 dark:bg-neutral-900 animate-in slide-in-from-right duration-300">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Employee Record</h3>
                <button 
                  onClick={() => setSelectedEmployeeId(null)}
                  className="text-xs text-rose-500 hover:underline"
                >
                  Close
                </button>
             </div>
             <p className="text-sm text-neutral-500">
               Viewing details for Employee ID: {selectedEmployeeId}
             </p>
             {/* <EmployeePayrollDetail id={selectedEmployeeId} /> */}
          </div>
        )}
      </div>
    </ContentLayout>
  )
}

export default Payroll