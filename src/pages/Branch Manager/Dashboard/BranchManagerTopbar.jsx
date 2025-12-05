import React from "react";
import { useSelector } from "react-redux";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export default function BranchManagerTopbar() {
  const { userProfile } = useSelector((state) => state.user);
  const { branch } = useSelector((state) => state.branch);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      
      {/* Branch Info */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {branch ? branch.name : "Branch Dashboard"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative group">
          <Bell className="h-6 w-6 text-gray-600 group-hover:text-gray-800 transition-colors" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full bg-red-500 text-white shadow-md">
            3
          </Badge>
        </Button>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shadow-inner">
            <User className="h-6 w-6 text-green-600" />
          </div>
          <div className="hidden md:flex flex-col">
            <p className="text-sm font-semibold text-gray-800">{userProfile?.name || "Branch Manager"}</p>
            <p className="text-xs text-gray-500">{userProfile?.email || "manager@example.com"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
