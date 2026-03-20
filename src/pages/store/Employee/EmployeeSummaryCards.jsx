import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, GitBranch, Shield } from "lucide-react";

export default function EmployeeSummaryCards({ employees = [] }) {

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (e) => e.loginAccess === true
  ).length;

  const branches = new Set(
    employees.flatMap((e) =>
      e.roleBranchMap?.map((rb) => rb.branchName)
    )
  ).size;

  const managers = employees.filter((e) =>
    e.roleBranchMap?.some((rb) =>
      rb.role=="BRANCH_MANAGER"
    )
  ).length;

  const cards = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
    },
    {
      title: "Active Logins",
      value: activeEmployees,
      icon: UserCheck,
    },
    {
      title: "Branches",
      value: branches,
      icon: GitBranch,
    },
    {
      title: "Managers",
      value: managers,
      icon: Shield,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <Card key={index}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>

              <Icon className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}