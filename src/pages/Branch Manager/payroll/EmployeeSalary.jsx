import { useState } from "react";
import { useGetSalariesByBranchQuery } from "@/Redux Toolkit/features/salary/salaryApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import SalaryPayrollDialog from "../components/payroll/SalaryPayrollDialog";
import AddSalaryPayrollDialog from "../components/payroll/AddSalaryPayrollDialog";
import ContentLayout from "../../Dashboard/ContentLayout";

export default function SalaryTable() {
    const {selectedBranchId}=useSelector((state)=>state.user)
    const branchId=selectedBranchId;
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenAdd, setDialogOpenAdd] = useState(false);

  const { data, isLoading } = useGetSalariesByBranchQuery(branchId, {
    skip: !branchId,
  });

  if (!data?.length) return <p>No salaries found</p>;

  const handleEditClick = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setDialogOpenAdd(true);
  };

  return (
     <ContentLayout
     loadingSpinner={isLoading}
      title="Employee Payroll"
      subTitle="Manage employee salary configuration"
    >
          <AddSalaryPayrollDialog
            open={dialogOpenAdd}
            setOpen={setDialogOpenAdd}
            employeeId={null}
          />

          <Button size="sm" onClick={handleAdd} className="mb-4">
            Configure Salary
          </Button>

          <h2 className="text-lg font-semibold mb-4">Employee Salaries</h2>
    <div className="w-full overflow-x-auto">

          <table className="w-full table-auto border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Employee</th>
                <th className="p-2 border">Basic</th>
                <th className="p-2 border">HRA</th>
                <th className="p-2 border">Transport</th>
                <th className="p-2 border">Medical</th>
                <th className="p-2 border">OT Rate</th>
                <th className="p-2 border">EPF %</th>
                <th className="p-2 border">ETF %</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="p-2 border font-medium">
                    {s.employeeName}
                  </td>

                  <td className="p-2 border">{s.basicSalary}</td>
                  <td className="p-2 border">{s.hra ?? "-"}</td>
                  <td className="p-2 border">{s.transport ?? "-"}</td>
                  <td className="p-2 border">{s.medical ?? "-"}</td>
                  <td className="p-2 border">{s.overtimeRate ?? "-"}</td>
                  <td className="p-2 border">{s.epfPercentage}%</td>
                  <td className="p-2 border">{s.etfPercentage}%</td>

                  <td className="p-2 border">
                    <Button
                      size="sm"
                      onClick={() => handleEditClick(s.employeeId)}
                    >
                      Edit / Generate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>

      {selectedEmployeeId && (
        <SalaryPayrollDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          employeeId={selectedEmployeeId}
        />
      )}
    
    </ContentLayout>
  );
}