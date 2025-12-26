"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import { getAllBranchesByStore } from "@/Redux Toolkit/features/branch/branchThunks";
import { selectBranches } from "@/Redux Toolkit/features/branch/branchSelectors";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { selectStore } from "../../../Redux Toolkit/features/branch/storeSelectors";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Employee name is required"),
  email: Yup.string().email().required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  role: Yup.string().required("Role is required"),
  branchId: Yup.string().when("role", {
    is: (r) => r === "ROLE_BRANCH_MANAGER" || r === "ROLE_CASHIER",
    then: (s) => s.required("Branch is required"),
  }),
  password: Yup.string().min(8).required("Password is required"),
});

export default function EmployeeForm({ initialData, onSubmit, roles }) {
  const dispatch = useDispatch();

  const store = useSelector(selectStore);
  const branches = useSelector(selectBranches);

  /* ✅ Load branches ONLY when store exists */
  useEffect(() => {
    if (!store?.id) return;

    dispatch(
      getAllBranchesByStore({
        storeId: store.id,
        jwt: localStorage.getItem("jwt"),
      })
    );
  }, [dispatch, store?.id]);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      role: "",
      branchId: "",
      ...initialData,
    },
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <Label>Full Name</Label>
        <Input {...formik.getFieldProps("fullName")} />
      </div>

      <div>
        <Label>Email</Label>
        <Input type="email" {...formik.getFieldProps("email")} />
      </div>

      <div>
        <Label>Password</Label>
        <Input type="password" {...formik.getFieldProps("password")} />
      </div>

      <div>
        <Label>Phone</Label>
        <Input {...formik.getFieldProps("phone")} />
      </div>

      <div>
        <Label>Role</Label>
        <Select
          value={formik.values.role}
          onValueChange={(v) => formik.setFieldValue("role", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(formik.values.role === "ROLE_BRANCH_MANAGER" ||
        formik.values.role === "ROLE_CASHIER") && (
        <div>
          <Label>Branch</Label>
          <Select
            value={formik.values.branchId}
            onValueChange={(v) => formik.setFieldValue("branchId", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((b) => (
                <SelectItem key={b.id} value={String(b.id)}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button type="submit">
        {initialData ? "Save Changes" : "Add Employee"}
      </Button>
    </form>
  );
}
