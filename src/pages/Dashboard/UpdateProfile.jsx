"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  findEmployeeById,
  updateEmployee,
} from "@/Redux Toolkit/features/employee/employeeThunks";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Phone, Save, Loader2, Camera } from "lucide-react";
import ContentLayout from "./ContentLayout";
import { Skeleton } from "@/components/ui/skeleton";

const UpdateProfile = ({ onClose }) => {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.user);
  const { employee, loading } = useSelector((state) => state.employee);

  const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  const employeeId = userProfile?.user?.id;

  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (employeeId) {
      dispatch(findEmployeeById({ employeeId, token }));
    }
  }, [employeeId, dispatch, token]);

  useEffect(() => {
    if (employee) {
      setFormData({
        fullName: employee.fullName || "",
        email: employee.email || "",
        phone: employee.phone || "",
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsUpdating(true);
    try {
      await dispatch(
        updateEmployee({
          employeeId,
          employeeDetails: formData,
          token,
        })
      ).unwrap();
      
      toast({ title: "Success", description: "Profile updated successfully" });
      if (onClose) onClose();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to update profile", 
        variant: "destructive" 
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <ContentLayout 
      title="Account Settings" 
      subTitle="Manage your personal information and contact details."
      right={
        <Button 
          onClick={handleSubmit} 
          disabled={isUpdating}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
        >
          {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      }
    >
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* --- AVATAR SECTION --- */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-950 shadow-md overflow-hidden">
              <User className="w-12 h-12 text-slate-400" />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <h3 className="mt-4 font-bold text-lg">{formData.fullName || "User Profile"}</h3>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Employee</p>
        </div>

        {/* --- FORM CARD --- */}
        <Card className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-md font-bold">Personal Information</CardTitle>
            <CardDescription className="text-xs">Update your primary contact information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-400">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-indigo-500"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-400">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-400">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>
              </div>

            </form>
          </CardContent>
        </Card>

        {/* --- DANGER ZONE / EXTRA OPTIONS --- */}
        <div className="flex justify-center gap-4 text-[11px] text-slate-400 font-medium py-4">
           <span>Privacy Policy</span>
           <span>•</span>
           <span>Security Settings</span>
           <span>•</span>
           <span className="text-rose-500 hover:underline cursor-pointer">Deactivate Account</span>
        </div>
      </div>
    </ContentLayout>
  );
};

function ProfileSkeleton() {
  return (
    <ContentLayout title="Account Settings" subTitle="Loading...">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex flex-col items-center"><Skeleton className="h-24 w-24 rounded-full" /></div>
        <Skeleton className="h-[300px] w-full rounded-3xl" />
      </div>
    </ContentLayout>
  );
}

export default UpdateProfile;