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

/* -----------------------------
   Login Access Badge
------------------------------ */
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

/* -----------------------------
   Role Badge
------------------------------ */
const RoleBadge = ({ role }) => (
  <Badge className="bg-blue-100 text-blue-800 text-xs mr-1">
    {role}
  </Badge>
);

/* -----------------------------
   Main Table
------------------------------ */
const EmployeeTable = ({
  employees = [],
  loading = false,
  handleToggleAccess,
  openResetPasswordDialog,
  openPerformanceDialog,
  openEditDialog,
  openAssignRoleDialog,
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
          <TableHead>Email</TableHead>
          <TableHead>Branch Roles</TableHead>
          <TableHead>Last Login</TableHead>
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

            {/* Email */}
            <TableCell>
              {employee.email || "—"}
            </TableCell>

            {/* Branch Roles */}
            <TableCell className="space-y-1">
              {employee.roleBranchMap?.length ? (
                employee.roleBranchMap.map((rb) => (
                  <div key={rb.branchId} className="text-sm">
                    
                    {/* Branch Name */}
                    <div className="font-medium text-gray-700">
                      {rb.branchName}
                    </div>

                    {/* Roles */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rb.roles.map((role) => (
                        <RoleBadge key={role} role={role} />
                      ))}
                    </div>

                  </div>
                ))
              ) : (
                <span className="text-muted-foreground">
                  No Role Assigned
                </span>
              )}
            </TableCell>

            {/* Last Login */}
            <TableCell>
              {employee.lastLogin
                ? new Date(employee.lastLogin).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "Never"}
            </TableCell>

            {/* Actions */}
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
                  title="Toggle Access"
                  onClick={() => handleToggleAccess(employee)}
                >
                  <UserX className="h-4 w-4 text-red-500" />
                </Button>

                {/* Reset Password */}
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

                {/* Performance */}
                <Button
                  variant="ghost"
                  size="icon"
                  title="Performance"
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