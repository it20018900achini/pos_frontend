import React, { useState } from "react";
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
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Dashboard", path: "/branch/dashboard", icon: LayoutDashboard },
  { name: "Purchases", path: "/branch/purchases", icon: ShoppingBag },
  { name: "Suppliers", path: "/branch/suppliers", icon: ShoppingBag },
  { name: "Orders", path: "/branch/orders", icon: ShoppingBag },
  { name: "Refunds", path: "/branch/refunds", icon: RefreshCw },
  { name: "Transactions", path: "/branch/transactions", icon: CreditCard },
  { name: "Inventory", path: "/branch/inventory", icon: Package },
  { name: "Payroll", path: "/branch/payroll/generate", icon: Users },
  { name: "Employees", path: "/branch/employees", icon: Users },
  { name: "Customers", path: "/branch/customers", icon: UserCircle },

  // ✅ REPORTS WITH SUB MENU
  {
    name: "Reports",
    icon: FileText,
    children: [
      { name: "Summary", path: "/branch/reports" },
      { name: "Sales Report", path: "/branch/reports/sales" },
      { name: "Inventory Report", path: "/branch/reports/inventory" },
    ],
  },

  { name: "Settings", path: "/branch/settings", icon: Settings },
];

export default function BranchManagerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { branch } = useSelector((state) => state.branch);

  const [openReport, setOpenReport] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login");
  };

  const isReportActive = navLinks
    .find((l) => l.name === "Reports")
    ?.children.some((c) => location.pathname.startsWith(c.path));

  return (
    <aside className="w-64 h-full flex flex-col bg-white dark:bg-[#0B1221] shadow-xl">

      {/* BRAND */}
      <div className="flex flex-col items-center py-6 border-b border-indigo-100 dark:border-indigo-900">
        <Package className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-xl font-bold mt-2">Branch Manager</h1>
      </div>

      {/* BRANCH INFO */}
      {branch && (
        <div className="mx-4 my-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <h3 className="font-semibold">{branch.name}</h3>
          <p className="text-xs opacity-70">{branch.address}</p>
        </div>
      )}

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {navLinks.map((link) => {
          const Icon = link.icon;

          // ---------- REPORTS (WITH SUB MENU) ----------
          if (link.name === "Reports") {
            return (
              <div key={link.name}>
                <button
                  onClick={() => setOpenReport((p) => !p)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium
                    transition-all
                    ${
                      isReportActive
                        ? "bg-indigo-600 text-white shadow-md"
                        : "hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    Reports
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openReport ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* SUB MENU */}
                <div
                  className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                    openReport ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {link.children.map((child) => {
                    const active = location.pathname === child.path;
                    return (
                      <Link
                        key={child.name}
                        to={child.path}
                        className={`
                          block px-4 py-2 rounded-lg text-sm transition-all
                          ${
                            active
                              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40"
                              : "hover:bg-muted"
                          }
                        `}
                      >
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          // ---------- NORMAL LINKS ----------
          const active = location.pathname.startsWith(link.path);

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${
                  active
                    ? "bg-indigo-600 text-white shadow-md"
                    : "hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="px-4 py-4 border-t border-indigo-100 dark:border-indigo-900">
        <Button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 justify-center rounded-xl bg-red-500 hover:bg-red-600 text-white"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
