import { useEffect, useState } from "react";
import { useGetSalaryByEmployeeQuery, useSaveSalaryMutation } from "@/Redux Toolkit/features/salary/salaryApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SalaryForm() {
  const [employeeId, setEmployeeId] = useState("");
  const [form, setForm] = useState({
    basicSalary: "",
    hra: "",
    transport: "",
    medical: "",
    overtimeRate: "",
    epfPercentage: "",
    etfPercentage: "",
  });

  const { data } = useGetSalaryByEmployeeQuery(Number(employeeId), { skip: !employeeId });
  const [saveSalary] = useSaveSalaryMutation();

  // Populate form if salary exists
  useEffect(() => {
    if (data) {
      setForm({
        basicSalary: data.basicSalary ?? "",
        hra: data.hra ?? "",
        transport: data.transport ?? "",
        medical: data.medical ?? "",
        overtimeRate: data.overtimeRate ?? "",
        epfPercentage: data.epfPercentage ?? "",
        etfPercentage: data.etfPercentage ?? "",
      });
    }
  }, [data]);

  // Reset form if employeeId is cleared
  useEffect(() => {
    if (!employeeId) {
      setForm({
        basicSalary: "",
        hra: "",
        transport: "",
        medical: "",
        overtimeRate: "",
        epfPercentage: "",
        etfPercentage: "",
      });
    }
  }, [employeeId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!employeeId) return alert("Enter Employee ID");

    await saveSalary({
      employee: { id: Number(employeeId) },
      ...form,
    });
    alert("Salary saved successfully");
  };

  return (
    <Card className="max-w-2xl">
      <CardContent className="p-6 space-y-4">
        <Input
          type="number"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        <Input name="basicSalary" placeholder="Basic Salary" value={form.basicSalary} onChange={handleChange} />
        <div className="grid grid-cols-2 gap-4">
          <Input name="hra" placeholder="HRA" value={form.hra} onChange={handleChange} />
          <Input name="transport" placeholder="Transport" value={form.transport} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input name="medical" placeholder="Medical" value={form.medical} onChange={handleChange} />
          <Input name="overtimeRate" placeholder="Overtime Rate / Hour" value={form.overtimeRate} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input name="epfPercentage" placeholder="EPF %" value={form.epfPercentage} onChange={handleChange} />
          <Input name="etfPercentage" placeholder="ETF %" value={form.etfPercentage} onChange={handleChange} />
        </div>
        <Button className="w-full" onClick={handleSubmit}>Save Salary</Button>
      </CardContent>
    </Card>
  );
}
