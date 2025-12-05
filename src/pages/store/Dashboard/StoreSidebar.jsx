import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "../../../Redux Toolkit/features/user/userThunks";
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
} from "lucide-react";
import { Button } from "../../../components/ui/button";

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

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login");
  };

  return (
    <aside className="h-screen w-64 bg-white text-gray-800 flex flex-col shadow-xl rounded-r-xl overflow-hidden">
      {/* Branding */}
      <div className="flex items-center gap-2 px-6 py-6 border-b border-gray-200">
        <Store className="w-8 h-8 text-green-600" />
        <h1 className="text-xl font-bold text-gray-800">POS Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 mt-4">
        <ul className="space-y-2">
          {navLinks.map((link) => {
            const active = location.pathname.startsWith(link.path);
            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200
                    ${active
                      ? "bg-green-100 border-green-300 text-green-700 shadow-md"
                      : "border-transparent hover:bg-green-50 hover:border-green-200 hover:text-green-600"
                    }
                  `}
                >
                  <span className="w-5 h-5">{link.icon}</span>
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Logout */}
      <div className="px-4 py-4 mt-auto border-t border-gray-200">
        <Button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full justify-center rounded-xl bg-red-500 hover:bg-red-600 text-white"
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
