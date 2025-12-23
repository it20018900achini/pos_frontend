import { Card, CardContent } from "@/components/ui/card";

export default function SalaryCard({ salary }) {
  return (
    <Card>
      <CardContent className="p-4 space-y-1">
        <p>Basic: ₹ {salary.basicSalary}</p>
        <p>HRA: ₹ {salary.hra}</p>
        <p>Transport: ₹ {salary.transport}</p>
        <p>Medical: ₹ {salary.medical}</p>
        <p>Overtime Rate: ₹ {salary.overtimeRate}</p>
        <p>EPF: {salary.epfPercentage}%</p>
        <p>ETF: {salary.etfPercentage}%</p>
      </CardContent>
    </Card>
  );
}
