import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Edit, UserX, Key, BarChart, Shield } from "lucide-react";

const LoginAccessBadge = ({ enabled }) => (
  <Badge
    variant="secondary"
    className={
      enabled
        ? "bg-indigo-100 text-indigo-800"
        : "bg-red-100 text-red-800"
    }
  >
    {enabled ? "Enabled" : "Disabled"}
  </Badge>
);

const EmployeeTable = ({
  employees = [],
  loading = false,
  handleToggleAccess,
  openResetPasswordDialog,
  openPerformanceDialog,
  openEditDialog,
  openAssignRoleDialog
}) => {

  if (loading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Loading employees...
      </div>
    );
  }

  if (!employees.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No employees found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Login Access</TableHead>
          <TableHead>Assigned Since</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id}>

            <TableCell className="font-medium">
              {employee.fullName || "—"}
            </TableCell>

            <TableCell>
              {employee.roles?.length
                ? employee.roles.map((r) => r?.name).join(", ")
                : "No Role"}
            </TableCell>

            <TableCell>{employee.email || "—"}</TableCell>

            <TableCell>
              <LoginAccessBadge enabled={employee.loginAccess} />
            </TableCell>

            <TableCell>
              {employee.createdAt
                ? new Date(employee.createdAt).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "—"}
            </TableCell>

            <TableCell className="text-right">
              <div className="flex justify-end gap-2">

                {/* Assign Role */}
                <Button
                  variant="ghost"
                  size="icon"
                  title="Assign Role"
                  onClick={() => openAssignRoleDialog(employee)}
                >
                  <Shield className="h-4 w-4 text-indigo-600" />
                </Button>

                {/* Toggle Access */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleAccess(employee)}
                >
                  <UserX
                    className={`h-4 w-4 ${
                      employee.loginAccess
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  />
                </Button>

                {/* Reset Password */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    openResetPasswordDialog(employee)
                  }
                >
                  <Key className="h-4 w-4" />
                </Button>

                {/* Performance */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    openPerformanceDialog(employee)
                  }
                >
                  <BarChart className="h-4 w-4" />
                </Button>

                {/* Edit */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(employee)}
                >
                  <Edit className="h-4 w-4" />
                </Button>

              </div>
            </TableCell>

          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default React.memo(EmployeeTable);