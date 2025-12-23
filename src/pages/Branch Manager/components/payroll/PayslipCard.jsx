import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PayslipCard({ payroll, onApprove, onPay }) {
  return (
    <Card>
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="font-semibold">
            {payroll.employee?.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Net Salary: ₹ {payroll.netSalary}
          </p>
          <p className="text-xs">Status: {payroll.status}</p>
        </div>

        <div className="flex gap-2">
          {payroll.status === "GENERATED" && (
            <Button onClick={onApprove}>Approve</Button>
          )}

          {payroll.status === "APPROVED" && (
            <Button onClick={onPay} variant="secondary">
              Pay
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
