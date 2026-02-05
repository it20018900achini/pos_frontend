import React from "react";
import { useSelector } from "react-redux";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import MessageNotification from "../Chat/MessageNotification";
import { Link } from "react-router";
import UsersTabs from "../Chat/UsersTabs";
import ChatPage from "../Chat/ChatPage";
import CountIcon from "../Chat/CountIcon";

export default function BranchManagerTopbar() {
  const { userProfile } = useSelector((state) => state.user);
  const { branch } = useSelector((state) => state.branch);

  const fullName = userProfile?.fullName || "Branch Manager";
  const email = userProfile?.email || "manager@example.com";
  const role = userProfile?.role?.replace("", "").replace(/_/g, " ") || "Manager";
  const branchName = branch?.name || "Branch Dashboard";










  
  return (
    <header className="max-h-[300px] overflow-auto bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 shadow-xl border-b border-white/20 backdrop-blur-lg text-white">
     
      <div className="flex items-center justify-between">

        {/* LEFT — Branch Info */}
        <div>
          <h1 className="text-2xl font-bold">{branchName}</h1>
          <p className="text-sm opacity-90">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* RIGHT — Controls */}
        <div className="flex items-center gap-5">

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Link to="/branch/chat" className="relative">

           <CountIcon/>
                    </Link>


          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 shadow-sm">
            
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold shadow">
              {fullName?.charAt(0)?.toUpperCase()}
            </div>

            {/* Name + Email */}
            <div className="hidden md:flex flex-col">
              <p className="text-sm font-semibold">{fullName}</p>
              <p className="text-xs opacity-90 -mt-0.5">{role}</p>
              <p className="text-[10px] opacity-60">{email}</p>
            </div>

          </div>
        </div>
      </div>
      
    </header>
  );
}
