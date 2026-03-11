"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createBranchEmployee } from "@/Redux Toolkit/features/employee/employeeThunks";
import { useGetRolesQuery } from "@/Redux Toolkit/features/role/roleApi";
import { selectStore } from "@/Redux Toolkit/features/branch/storeSelectors";
import { getAllBranchesByStore } from "@/Redux Toolkit/features/branch/branchThunks";

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
import { useToast } from "@/components/ui/use-toast";

// Validation schema
const schema = z.object({
  fullName: z.string().min(1, "Employee name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  roles: z.string({ required_error: "Role is required" }),
});

export default function StoreEmployeeForm({ initialData = {}, onSubmit }) {
    const { toast } = useToast();
  
  const dispatch = useDispatch();
  const store = useSelector(selectStore);
  const { userProfile, selectedBranchId } = useSelector((state) => state.user);
  const token = localStorage.getItem("jwt");
  const storeId = userProfile?.user?.store?.id;

  const { data: roles = [], isLoading } = useGetRolesQuery({ storeId }, { skip: !storeId });

  useEffect(() => {
    if (store?.id) {
      dispatch(
        getAllBranchesByStore({
          storeId: store.id,
          jwt: token,
        })
      );
    }
  }, [dispatch, store?.id, token]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const selectedRole = roles.find((r) => r.name === watch("roles"));

  const submitHandler = async (data) => {
    // alert(JSON.stringify(selectedBranchId))
    try {
      await dispatch(
        createBranchEmployee({
          employee: {
            ...data,
            storeId: storeId,
          },
          storeId: storeId,
          token,
        })
      ).unwrap();

      // alert("Employee created successfully!");
      
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
      // alert(err || "Failed to create employee");
    }
  };

  if (isLoading) return <p>Loading roles...</p>;

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {/* Full Name */}
      <div>
        <Label>Full Name</Label>
        <Input {...register("fullName")} />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <Label>Email</Label>
        <Input type="email" {...register("email")} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <Label>Phone</Label>
        <Input {...register("phone")} />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
      </div>

      {/* Password */}
      <div>
        <Label>Password</Label>
        <Input type="password" {...register("password")} />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>



      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Employee"}
      </Button>
    </form>
  );
}