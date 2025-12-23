import SalaryForm from "../components/salary/SalaryForm";

export default function SalaryPage() {
  const employeeId = 5; // select employee / from table later

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Employee Salary Configuration
      </h1>

      <SalaryForm employeeId={employeeId} />
    </div>
  );
}
