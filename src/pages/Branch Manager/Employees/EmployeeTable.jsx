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
  handleToggleAccess,
  openResetPasswordDialog,
  openPerformanceDialog,
  openEditDialog,
}) => {
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
        {employees.length > 0 ? (
          employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">
                {employee.fullName}
              </TableCell>

              <TableCell>{employee.roles.map((r) => r?.name)}</TableCell>

              <TableCell>{employee.email}</TableCell>

              <TableCell>
                <LoginAccessBadge enabled={employee.loginAccess} />
              </TableCell>

              <TableCell>
                {new Date(employee.createdAt).toLocaleDateString()}
              </TableCell>

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
                    <UserX className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    title="Reset Password"
                    onClick={() => openResetPasswordDialog(employee)}
                  >
                    <Key className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    title="View Performance"
                    onClick={() => openPerformanceDialog(employee)}
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
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center py-6 text-muted-foreground"
            >
              No employees found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default EmployeeTable;
