import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/Redux Toolkit/features/user/userThunks";
import {
  LayoutDashboard,
  Store,
  Users,
  ShoppingCart,
  BarChart2,
  Settings,
  FileText,
  Tag,
  Truck,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Dashboard", path: "/store/dashboard", icon: <LayoutDashboard /> },
  { name: "Stores", path: "/store/stores", icon: <Store /> },
  { name: "Branches", path: "/store/branches", icon: <Store /> },
  { name: "Products", path: "/store/products", icon: <ShoppingCart /> },
  { name: "Categories", path: "/store/categories", icon: <Tag /> },
  { name: "Employees", path: "/store/employees", icon: <Users /> },
  { name: "Alerts", path: "/store/alerts", icon: <Truck /> },
  { name: "Sales", path: "/store/sales", icon: <BarChart2 /> },
  { name: "Reports", path: "/store/reports", icon: <FileText /> },
  { name: "Settings", path: "/store/settings", icon: <Settings /> },
];

export default function StoreSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // optional: store info if you have it
  const { store } = useSelector((state) => state.store || {});

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
        <Store className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-xl font-bold mt-2">Store Admin</h1>
      </div>

      {/* Store Info */}
      

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-2">
        {navLinks.map((link) => {
          const active = location.pathname.startsWith(link.path);

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl
                font-medium text-sm transition-all duration-200
                ${
                  active
                    ? `
                      bg-indigo-600 text-white shadow-md
                      dark:bg-indigo-500
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
