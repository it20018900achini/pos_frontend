"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import EmployeeForm from "./EmployeeForm";

// ------------------ Add Employee ------------------
export const AddEmployeeDialog = ({
  isOpen,
  setIsOpen,
  handleAddEmployee,
  roles,
}) => (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
      <Button className="bg-emerald-600 hover:bg-emerald-700">
        <Plus className="mr-2 h-4 w-4" /> Add Employee
      </Button>
    </DialogTrigger>
    <DialogContent className="overflow-auto max-h-screen">
      <DialogHeader>
        <DialogTitle>Add New Employee</DialogTitle>
      </DialogHeader>

      <EmployeeForm initialData={null} onSubmit={handleAddEmployee} roles={roles} />

      <DialogFooter>
        <Button variant="outline" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// ------------------ Edit Employee ------------------
export const EditEmployeeDialog = ({
  isOpen,
  setIsOpen,
  selectedEmployee,
  handleEditEmployee,
  roles,
}) =>
  selectedEmployee && (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="overflow-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>

        <EmployeeForm
          initialData={{
            ...selectedEmployee,
            branchId: selectedEmployee.branchId || "",
          }}
          onSubmit={handleEditEmployee}
          roles={roles}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

// ------------------ Reset Password ------------------
export const ResetPasswordDialog = ({
  isOpen,
  setIsOpen,
  selectedEmployee,
  handleResetPassword,
}) =>
  selectedEmployee && (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="overflow-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p>
            Are you sure you want to reset the password for{" "}
            <strong>{selectedEmployee.name}</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            A temporary password will be generated and sent to their email.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleResetPassword}>Reset Password</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

// ------------------ Performance ------------------
export const PerformanceDialog = ({
  isOpen,
  setIsOpen,
  selectedEmployee,
}) =>
  selectedEmployee && (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white max-h-screen overflow-y-scroll max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            Performance Summary - {selectedEmployee.name}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {selectedEmployee.role === "BRANCH_CASHIER" ? (
            <CashierPerformance employee={selectedEmployee} />
          ) : (
            <ManagerPerformance employee={selectedEmployee} />
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
          <Button variant="outline">Export Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

// ------------------ Helper Components ------------------
const CashierPerformance = ({ employee }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <PerformanceCard title="Orders Processed" value="127" subtitle="Last 30 days" />
      <PerformanceCard title="Total Sales" value="LKR 78,450" subtitle="Last 30 days" />
      <PerformanceCard title="Avg. Order Value" value="LKR 617" subtitle="Last 30 days" />
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Daily Sales Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full flex items-center justify-center bg-gray-50 rounded-md">
          <p className="text-gray-500">Sales chart would appear here</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ManagerPerformance = ({ employee }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <PerformanceCard title="Stock Updates" value="42" subtitle="Last 30 days" />
      <PerformanceCard title="Products Managed" value="156" subtitle="Total" />
      <PerformanceCard title="Inventory Accuracy" value="98%" subtitle="Last audit" />
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ActivityLog />
      </CardContent>
    </Card>
  </div>
);

const PerformanceCard = ({ title, value, subtitle }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-lg font-medium text-gray-500">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
    </CardContent>
  </Card>
);

const ActivityLog = () => (
  <div className="space-y-4">
    <LogItem title="Updated stock for 12 products" subtitle="Grocery category" time="2 days ago" />
    <LogItem title="Added 5 new products" subtitle="Dairy category" time="5 days ago" />
    <LogItem title="Completed monthly inventory audit" subtitle="All categories" time="1 week ago" />
  </div>
);

const LogItem = ({ title, subtitle, time }) => (
  <div className="flex justify-between items-center border-b pb-2">
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
    <p className="text-sm text-gray-500">{time}</p>
  </div>
);
