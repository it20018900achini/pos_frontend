import { useState } from "react";
import SalaryPayrollDialog from "./SalaryPayrollDialog";
import { useGetSalariesByBranchQuery } from "../../../../Redux Toolkit/features/salary/salaryApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddSalaryPayrollDialog from "./AddSalaryPayrollDialog";

export default function SalaryTable({ branchId }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenAdd, setDialogOpenAdd] = useState(false);

  const { data, isLoading, error } = useGetSalariesByBranchQuery(branchId, { skip: !branchId });

  if (isLoading) return <p>Loading salaries...</p>;
  if (error) return <p>Error loading salaries</p>;
  if (!data?.length) return <p>No salaries found</p>;

  const handleEditClick = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setDialogOpen(true);
  };
  const handleAdd = () => {
    setSelectedEmployeeId();
    setDialogOpenAdd(true);
  };

  return (
    <>
      <Card>
        <CardContent className="p-4">
            <AddSalaryPayrollDialog
          open={dialogOpenAdd}
          setOpen={setDialogOpenAdd}
          employeeId={null}
        />
        <Button size="sm" onClick={() => handleAdd(null)}>
                     Configure Salary
                    </Button>
          <h2 className="text-lg font-semibold mb-4">Employee Salaries</h2>
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
                  <td className="p-2 border">
                    <div className="font-medium">{s.employee.fullName}</div>
                    <div className="text-xs text-gray-500">{s.employee.email}</div>
                  </td>
                  <td className="p-2 border">{s.basicSalary}</td>
                  <td className="p-2 border">{s.hra}</td>
                  <td className="p-2 border">{s.transport}</td>
                  <td className="p-2 border">{s.medical}</td>
                  <td className="p-2 border">{s.overtimeRate}</td>
                  <td className="p-2 border">{s.epfPercentage}%</td>
                  <td className="p-2 border">{s.etfPercentage}%</td>
                  <td className="p-2 border">
                    <Button size="sm" onClick={() => handleEditClick(s.employee.id)}>
                      Edit / Generate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Dialog */}
      {selectedEmployeeId && (
        <SalaryPayrollDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          employeeId={selectedEmployeeId}
        />
      )}
    </>
  );
}
