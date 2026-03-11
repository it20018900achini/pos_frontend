"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createBranchEmployee } from "@/Redux Toolkit/features/employee/employeeThunks";
import { selectStore } from "@/Redux Toolkit/features/branch/storeSelectors";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { createStoreEmployee } from "../../../Redux Toolkit/features/employee/employeeThunks";


// Validation schema
const schema = z.object({
  fullName: z.string().min(1, "Employee name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function StoreEmployeeForm({ initialData = {}, onSubmit }) {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const store = useSelector(selectStore);
  const { userProfile } = useSelector((state) => state.user);

  const token = localStorage.getItem("jwt");
  const storeId = userProfile?.user?.store?.id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      password: "",
    },
  });

  const submitHandler = async (data) => {
    try {
      await dispatch(
        createStoreEmployee({
          employee: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            password: data.password,
            storeId: storeId,
          },
          storeId,
          token,
        })
      ).unwrap();

      toast({
        title: "Create Employee",
        description: "Employee created successfully!",
      });

      reset();

      if (onSubmit) onSubmit();
    } catch (err) {
      console.error(err);

      toast({
        title: "Create Employee",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

      {/* Full Name */}
      <div>
        <Label>Full Name</Label>
        <Input {...register("fullName")} />
        {errors.fullName && (
          <p className="text-red-500 text-sm">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <Label>Email</Label>
        <Input type="email" {...register("email")} />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <Label>Phone</Label>
        <Input {...register("phone")} />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <Label>Password</Label>
        <Input type="password" {...register("password")} />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Employee"}
      </Button>

    </form>
  );
}