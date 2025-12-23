import { useGetBranchPayrollsQuery } from "@/Redux Toolkit/features/payroll/payrollApi";

export default function PayrollStats({ branchId, year, month }) {
  const { data: payrolls, isLoading } = useGetBranchPayrollsQuery({ branchId, year, month });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Payroll Stats</h2>
      {payrolls?.length ? (
        <ul>
          {payrolls.map((p) => (
            <li key={p.id}>
              {p.employee.fullName} - {p.totalAmount} - {p.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No payrolls found</p>
      )}
    </div>
  );
}
