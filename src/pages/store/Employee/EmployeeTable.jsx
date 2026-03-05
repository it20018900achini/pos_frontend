"use client";

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

import { Edit, UserX, Key } from "lucide-react";

/* -----------------------------
   Role Badge
------------------------------ */
const RoleBadge = ({ role }) => {
  const roleColors = {
    ADMIN: "bg-red-100 text-red-700",
    BRANCH_MANAGER: "bg-blue-100 text-blue-700",
    BRANCH_CASHIER: "bg-green-100 text-green-700",
    USER: "bg-gray-100 text-gray-700",
  };

  return (
    <Badge className={roleColors[role] || "bg-gray-100 text-gray-700"}>
      {role}
    </Badge>
  );
};

/* -----------------------------
   Branch Badge
------------------------------ */
const BranchBadge = ({ branch }) => {
  return (
    <Badge className="bg-purple-100 text-purple-700">
      {branch}
    </Badge>
  );
};

/* -----------------------------
   Last Login Formatter
------------------------------ */
const formatDate = (dateString) => {
  if (!dateString) return "Never";

  const date = new Date(dateString);

  return date.toLocaleString();
};

/* -----------------------------
   Employee Table
------------------------------ */
const EmployeeTable = ({
  employees = [],
  onEdit,
  onDisable,
  onResetPassword,
}) => {
  if (!employees || employees.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No employees found
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white dark:bg-neutral-900">
      <Table>

        {/* TABLE HEADER */}
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        {/* TABLE BODY */}
        <TableBody>
          {employees.map((employee) => {

            const branches =
              employee.roleBranchMap?.map((rb) => rb.branchName) || [];

            const roles =
              employee.roleBranchMap?.flatMap((rb) => rb.roles) || [];

            return (
              <TableRow key={employee.id}>

                {/* EMPLOYEE */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {employee.firstName} {employee.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {employee.email}
                    </span>
                  </div>
                </TableCell>

                {/* CONTACT */}
                <TableCell>
                  {employee.phone || "—"}
                </TableCell>

                {/* BRANCH */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {branches.length ? (
                      branches.map((branch, index) => (
                        <BranchBadge key={branch + index} branch={branch} />
                      ))
                    ) : (
                      "—"
                    )}
                  </div>
                </TableCell>

                {/* ROLE */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {roles.length ? (
                      roles.map((role, index) => (
                        <RoleBadge key={role + index} role={role} />
                      ))
                    ) : (
                      "—"
                    )}
                  </div>
                </TableCell>

                {/* LAST LOGIN */}
                <TableCell>
                  {formatDate(employee.lastLogin)}
                </TableCell>

                {/* ACTIONS */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onEdit(employee)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onResetPassword(employee)}
                    >
                      <Key className="w-4 h-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => onDisable(employee)}
                    >
                      <UserX className="w-4 h-4" />
                    </Button>

                  </div>
                </TableCell>

              </TableRow>
            );
          })}
        </TableBody>

      </Table>
    </div>
  );
};

export default EmployeeTable;