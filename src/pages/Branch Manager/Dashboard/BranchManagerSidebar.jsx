import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/Redux Toolkit/features/user/userThunks";
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Package,
  Users,
  UserCircle,
  FileText,
  Settings,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Dashboard", path: "/branch/dashboard", icon: <LayoutDashboard /> },
  { name: "Orders", path: "/branch/orders", icon: <ShoppingBag /> },
  { name: "Refunds", path: "/branch/refunds", icon: <RefreshCw /> },
  { name: "Transactions", path: "/branch/transactions", icon: <CreditCard /> },
  { name: "Inventory", path: "/branch/inventory", icon: <Package /> },
  { name: "Employees", path: "/branch/employees", icon: <Users /> },
  { name: "Customers", path: "/branch/customers", icon: <UserCircle /> },
  { name: "Reports", path: "/branch/reports", icon: <FileText /> },
  { name: "Settings", path: "/branch/settings", icon: <Settings /> },
];

export default function BranchManagerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { branch } = useSelector((state) => state.branch);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login");
  };

  return (
    <aside
      className="
        w-64 h-full flex flex-col overflow-hidden
        bg-white text-black
        dark:bg-[#0B1221] dark:text-white
        shadow-xl transition-all duration-300
      "
    >
      {/* Branding */}
      <div
        className="
          flex flex-col items-center py-6 
          border-b border-indigo-100
          dark:border-indigo-900
        "
      >
        <Package className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-xl font-bold mt-2">Branch Manager</h1>
      </div>

      {/* Branch Info */}
      {branch && (
        <div
          className="
            mx-4 my-4 p-3 rounded-xl
            bg-indigo-50 border border-indigo-200
            dark:bg-indigo-900/20 dark:border-indigo-800
          "
        >
          <h3 className="font-semibold">{branch.name}</h3>
          <p className="text-xs opacity-70">{branch.address}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-2">
        {navLinks.map((link) => {
          const active = location.pathname.startsWith(link.path);

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm
                transition-all duration-200
                ${
                  active
                    ? `
                      bg-indigo-600 text-white shadow-md 
                      dark:bg-indigo-500 dark:text-white
                    `
                    : `
                      hover:bg-indigo-100 text-black
                      dark:hover:bg-indigo-900/40 dark:text-white
                    `
                }
              `}
            >
              <span className="w-5 h-5">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        className="
          px-4 py-4 mt-auto 
          border-t border-indigo-100 
          dark:border-indigo-900
        "
      >
        <Button
          onClick={handleLogout}
          className="
            flex items-center gap-2 w-full justify-center rounded-xl
            bg-red-500 hover:bg-red-600 text-white shadow-md
            dark:bg-red-600 dark:hover:bg-red-700
          "
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
