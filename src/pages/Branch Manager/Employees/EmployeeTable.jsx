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
import { Edit, UserX, Key, BarChart } from "lucide-react";

/* -----------------------------
   Reusable Badge Component
------------------------------ */
const LoginAccessBadge = ({ enabled }) => (
  <Badge
    variant="secondary"
    className={
      enabled
        ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80"
        : "bg-red-100 text-red-800 hover:bg-red-100/80"
    }
  >
    {enabled ? "Enabled" : "Disabled"}
  </Badge>
);

/* -----------------------------
   Main Table Component
------------------------------ */
const EmployeeTable = ({
  employees = [],
  loading = false,
  handleToggleAccess,
  openResetPasswordDialog,
  openPerformanceDialog,
  openEditDialog,
}) => {
  /* -----------------------------
     Loading State
  ------------------------------ */
  if (loading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Loading employees...
      </div>
    );
  }

  /* -----------------------------
     Empty State
  ------------------------------ */
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
            {/* Name */}
            <TableCell className="font-medium">
              {employee.fullName || "—"}
            </TableCell>

            {/* Roles */}
            <TableCell>
              {employee.roles?.length
                ? employee.roles.map((r) => r?.name).join(", ")
                : "No Role"}
            </TableCell>

            {/* Email */}
            <TableCell>{employee.email || "—"}</TableCell>

            {/* Login Access */}
            <TableCell>
              <LoginAccessBadge enabled={employee.loginAccess} />
            </TableCell>

            {/* Created Date */}
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

            {/* Actions */}
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  title={
                    employee.loginAccess
                      ? "Disable Access"
                      : "Enable Access"
                  }
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

                <Button
                  variant="ghost"
                  size="icon"
                  title="Reset Password"
                  onClick={() =>
                    openResetPasswordDialog(employee)
                  }
                >
                  <Key className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  title="View Performance"
                  onClick={() =>
                    openPerformanceDialog(employee)
                  }
                >
                  <BarChart className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  title="Edit Employee"
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