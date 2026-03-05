import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { branchAdminRole } from "../../../utils/userRole";

import AssignUserRole from "./AssignUserRole";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import EmployeeStats from "./EmployeeStats";
import EmployeeTable from "./EmployeeTable";
import {
  AddEmployeeDialog,
  EditEmployeeDialog,
  ResetPasswordDialog,
  PerformanceDialog,
} from "./EmployeeDialogs";

import {
  createBranchEmployee,
  findBranchEmployees,
  updateEmployee,
} from "../../../Redux Toolkit/features/employee/employeeThunks";

import ContentLayout from "../../Dashboard/ContentLayout";

/* -----------------------------
   Component
------------------------------ */
const BranchEmployees = () => {
  const dispatch = useDispatch();

  /* -----------------------------
     Redux State
  ------------------------------ */
  const { employees, loading } = useSelector((state) => state.employee);
  const { userProfile, selectedBranchId } = useSelector(
    (state) => state.user
  );

  /* -----------------------------
     Local State
  ------------------------------ */
  const [dialogs, setDialogs] = useState({
    add: false,
    edit: false,
    resetPassword: false,
    performance: false,
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  /* -----------------------------
     Refresh Employees
  ------------------------------ */
  const refreshEmployees = useCallback(() => {
    if (!selectedBranchId) return;

    dispatch(
      findBranchEmployees({
        branchId: selectedBranchId,
      })
    );
  }, [dispatch, selectedBranchId]);

  /* -----------------------------
     Fetch When Branch Changes
  ------------------------------ */
  useEffect(() => {
    refreshEmployees();
  }, [refreshEmployees]);

  /* -----------------------------
     Dialog Helpers
  ------------------------------ */
  const openDialog = useCallback((type, employee = null) => {
    setSelectedEmployee(employee);
    setDialogs((prev) => ({ ...prev, [type]: true }));
  }, []);

  const closeDialog = useCallback((type) => {
    setDialogs((prev) => ({ ...prev, [type]: false }));
    setSelectedEmployee(null);
  }, []);

  /* -----------------------------
     Handlers
  ------------------------------ */
  const handleAddEmployee = async (employeeData) => {
    if (!selectedBranchId || !userProfile?.user?.storeId) return;

    await dispatch(
      createBranchEmployee({
        employee: {
          ...employeeData,
          // safer username generation
          username: `${employeeData.email.split("@")[0]}_${Date.now()}`,
        },
        branchId: selectedBranchId,
        storeId: userProfile.user.storeId,
      })
    );

    refreshEmployees();
    closeDialog("add");
  };

  const handleEditEmployee = async (employeeDetails) => {
    if (!selectedEmployee?.id) return;

    await dispatch(
      updateEmployee({
        employeeId: selectedEmployee.id,
        employeeDetails,
      })
    );

    refreshEmployees();
    closeDialog("edit");
  };

  const handleToggleAccess = async (employee) => {
    await dispatch(
      updateEmployee({
        employeeId: employee.id,
        employeeDetails: {
          loginAccess: !employee.loginAccess,
        },
      })
    );

    refreshEmployees();
  };

  /* -----------------------------
     Render
  ------------------------------ */
  return (
    <ContentLayout
      title="Branch Employees"
      subTitle="Manage your branch employees, their access, and performance."
      right={
        <AddEmployeeDialog
          isAddDialogOpen={dialogs.add}
          setIsAddDialogOpen={() => openDialog("add")}
          handleAddEmployee={handleAddEmployee}
          roles={branchAdminRole}
        />
      }
    >
      <div className="space-y-6">
        {/* -------- Stats -------- */}
        <EmployeeStats employees={employees} loading={loading} />

        {/* -------- Table -------- */}
        <EmployeeTable
  employees={employees}
  loading={loading}
  handleToggleAccess={handleToggleAccess}
  openEditDialog={(emp) => openDialog("edit", emp)}
  openResetPasswordDialog={(emp) =>
    openDialog("resetPassword", emp)
  }
  openPerformanceDialog={(emp) =>
    openDialog("performance", emp)
  }
  openAssignRoleDialog={(emp) =>
    openDialog("assignRole", emp)
  }
/>

        {/* ---------------- Dialogs ---------------- */}

        <EditEmployeeDialog
          isEditDialogOpen={dialogs.edit}
          setIsEditDialogOpen={() => closeDialog("edit")}
          selectedEmployee={selectedEmployee}
          handleEditEmployee={handleEditEmployee}
          roles={branchAdminRole}
        />

        <ResetPasswordDialog
          isResetPasswordDialogOpen={dialogs.resetPassword}
          setIsResetPasswordDialogOpen={() =>
            closeDialog("resetPassword")
          }
          selectedEmployee={selectedEmployee}
        />

        <PerformanceDialog
          isPerformanceDialogOpen={dialogs.performance}
          setIsPerformanceDialogOpen={() =>
            closeDialog("performance")
          }
          selectedEmployee={selectedEmployee}
        />
      </div>

      <Dialog
  open={dialogs.assignRole}
  onOpenChange={() => closeDialog("assignRole")}
>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Assign Role</DialogTitle>
    </DialogHeader>

    <AssignUserRole userId={selectedEmployee?.id} />
  </DialogContent>
</Dialog>
    </ContentLayout>
  );
};

export default BranchEmployees;