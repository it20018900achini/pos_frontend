import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { branchAdminRole } from "../../../utils/userRole";

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

/* -----------------------------
   Component
------------------------------ */
const BranchEmployees = () => {
  const dispatch = useDispatch();

  /* -----------------------------
     Redux State
  ------------------------------ */
  const { branch } = useSelector((state) => state.branch);
  const { employees, loading } = useSelector((state) => state.employee);
  const { userProfile } = useSelector((state) => state.user);

  /* -----------------------------
     UI State
  ------------------------------ */
  const [dialogs, setDialogs] = useState({
    add: false,
    edit: false,
    resetPassword: false,
    performance: false,
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  /* -----------------------------
     Fetch Employees
  ------------------------------ */
  useEffect(() => {
    if (branch?.id) {
      dispatch(findBranchEmployees({ branchId: branch.id }));
    }
  }, [dispatch, branch?.id]);

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
  const handleAddEmployee = (employeeData) => {
    if (!branch?.id || !userProfile?.branchId) return;

    dispatch(
      createBranchEmployee({
        employee: {
          ...employeeData,
          username: employeeData.email.split("@")[0],
        },
        branchId: branch.id,
        storeId: 2,
      })
    );

    closeDialog("add");
  };

  const handleEditEmployee = (employeeDetails) => {
    if (!selectedEmployee?.id) return;

    dispatch(
      updateEmployee({
        employeeId: selectedEmployee.id,
        employeeDetails,
      })
    );

    closeDialog("edit");
  };

  const handleToggleAccess = (employee) => {
    dispatch(
      updateEmployee({
        employeeId: employee.id,
        employeeDetails: {
          loginAccess: !employee.loginAccess,
        },
      })
    );
  };

  /* -----------------------------
     Render
  ------------------------------ */
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Employee Management
        </h1>

        <AddEmployeeDialog
          isAddDialogOpen={dialogs.add}
          setIsAddDialogOpen={() => openDialog("add")}
          handleAddEmployee={handleAddEmployee}
          roles={branchAdminRole}
        />
      </div>

      <EmployeeStats employees={employees} loading={loading} />

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
  );
};

export default BranchEmployees;
