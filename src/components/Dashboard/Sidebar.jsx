import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/Redux Toolkit/features/user/userThunks";
import {
  LayoutDashboard,
  Store,
  Users,
  Settings,
  FileText,
  Clock,
  DollarSign,
  Archive,
  FileText as Report,
  LogOut,
  ChevronDown,
  ChevronUp,
  Menu,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/hooks/useSidebar";
import { setSelectedBranch } from "@/Redux Toolkit/features/user/userSlice";

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center pt-20">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-neutral-900 rounded-lg shadow-lg w-80 max-h-[80vh] overflow-y-auto z-50">
        {children}
      </div>
    </div>
  );
};

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userProfile, selectedBranchId } = useSelector((state) => state.user);
  const user = userProfile?.user;

  // Find selected branch from roleBranchMap
  const selectedBranch = user?.roleBranchMap?.find(
    (b) => b.branchId === Number(selectedBranchId)
  ) || user?.defaultBranch;

  const permissions = selectedBranch?.permissions || [];

  // ---------------- Build NAV_LINKS based on selected branch permissions ----------------
  const NAV_LINKS = [];

  if (permissions.includes("DASHBOARD")) NAV_LINKS.push({ name: "Dashboard", path: "/dashboard", icon: LayoutDashboard });
  if (permissions.includes("BRANCHES")) NAV_LINKS.push({ name: "Branches", path: "/dashboard/store/branches", icon: Store });

  if (permissions.includes("POS")) {
    NAV_LINKS.push({
      name: "POS",
      icon: Store,
      children: [
        { name: "POS", path: "/dashboard/pos", icon: Store },
        { name: "Shift Summary", path: "/dashboard/pos/shift-summary", icon: Clock },
        { name: "Orders", path: "/dashboard/pos/orders", icon: FileText },
        { name: "Refunds", path: "/dashboard/pos/refunds", icon: DollarSign },
      ],
    });
  }

  if (permissions.includes("USERS")) {
    NAV_LINKS.push({
      name: "Users",
      icon: Users,
      children: [
        { name: "Branch Users", path: "/dashboard/branch/users", icon: Users },
        { name: "Store Users", path: "/dashboard/store/users", icon: Users },
        { name: "Role Permissions", path: "/dashboard/branch/users/permissions", icon: ClipboardList },
      ],
    });
  }

  if (permissions.includes("ACCOUNTS")) {
    NAV_LINKS.push({
      name: "Accounts",
      icon: DollarSign,
      children: [
        { name: "Chart of Accounts", path: "/dashboard/branch/accounts/chart-of-accounts", icon: Archive },
        { name: "Journal Entries", path: "/dashboard/branch/accounts/journals", icon: FileText },
        { name: "Profit & Loss", path: "/dashboard/branch/accounts/profit-loss", icon: Report },
        { name: "Balance Sheet", path: "/dashboard/branch/accounts/balance-sheet", icon: Report },
        { name: "Trial Balance", path: "/dashboard/branch/accounts/trial-balance", icon: Report },
      ],
    });
  }

  if (permissions.includes("ORDERS")) {
    NAV_LINKS.push({
      name: "Orders / Transactions",
      icon: DollarSign,
      children: [
        { name: "Orders", path: "/dashboard/branch/orders", icon: Archive },
        { name: "Refunds", path: "/dashboard/branch/orders/refunds", icon: FileText },
        { name: "Store Orders", path: "/dashboard/store/orders", icon: Archive },
        { name: "Store Refunds", path: "/dashboard/store/orders/refunds", icon: FileText },
      ],
    });
  }

  if (permissions.includes("TRANSACTIONS")) NAV_LINKS.push({ name: "Transactions", path: "/dashboard/branch/transactions", icon: Settings });
  if (permissions.includes("PRODUCTS")) {
    NAV_LINKS.push({
      name: "Products",
      icon: ClipboardList,
      children: [
        { name: "Products", path: "/dashboard/store/products", icon: Archive },
        { name: "Product Variants", path: "/dashboard/store/products/variants", icon: FileText },
        { name: "Product Categories", path: "/dashboard/store/products/categories", icon: FileText },
        { name: "Product Brands", path: "/dashboard/store/products/brands", icon: FileText },
      ],
    });
  }

  if (permissions.includes("INVENTORY")) {
    NAV_LINKS.push({
      name: "Inventory",
      icon: ClipboardList,
      children: [
        { name: "Inventory", path: "/dashboard/branch/inventory", icon: Archive },
        { name: "Inventory Movements", path: "/dashboard/branch/inventory/inventory-movements", icon: FileText },
        { name: "Purchase", path: "/dashboard/branch/inventory/purchases", icon: FileText },
        { name: "Suppliers", path: "/dashboard/branch/inventory/suppliers", icon: FileText },
      ],
    });
  }

  if (permissions.includes("PAYROLL")) NAV_LINKS.push({ name: "Payroll", path: "/dashboard/branch/payroll", icon: FileText });
  if (permissions.includes("SETTINGS")) {
    NAV_LINKS.push({ name: "Settings(Store)", path: "/dashboard/settings", icon: Settings });
    NAV_LINKS.push({ name: "Settings(Branch)", path: "/dashboard/branch/settings", icon: Settings });
  }

  // ---------------- Sidebar state ----------------
  const [openMenus, setOpenMenus] = useState({});
  const [dialogMenu, setDialogMenu] = useState(null);

  const isExactActive = (path) => location.pathname === path;
  const isParentActive = (link) =>
    link.children ? link.children.some((c) => isExactActive(c.path)) : isExactActive(link.path);

  const handleParentClick = (link) => {
    if (link.children) {
      if (sidebarOpen) {
        setOpenMenus((prev) => ({ ...prev, [link.name]: !prev[link.name] }));
      } else {
        setDialogMenu((prev) => (prev === link.name ? null : link.name));
      }
      return;
    }
    navigate(link.path);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login");
  };

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 dark:bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed md:static z-50 h-screen top-0 left-0 bg-white dark:bg-neutral-900 border-r dark:border-neutral-700 shadow-lg transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} overflow-y-auto`}>
        <div className="flex flex-col h-full px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <Store className="w-7 h-7 text-neutral-600 dark:text-neutral-400" />
            <button onClick={() => setSidebarOpen((p) => !p)} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <Menu className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const active = isParentActive(link);
                const hasChildren = !!link.children;
                const isOpen = openMenus[link.name];

                return (
                  <li key={link.name} className="relative z-[100]">
                    <button onClick={() => handleParentClick(link)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${active ? "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"}`}>
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                        {sidebarOpen && <span className="text-sm font-medium">{link.name}</span>}
                      </div>
                      {hasChildren && sidebarOpen && (isOpen ? <ChevronUp size={16} className="text-neutral-700 dark:text-neutral-300" /> : <ChevronDown size={16} className="text-neutral-700 dark:text-neutral-300" />)}
                    </button>

                    {hasChildren && isOpen && sidebarOpen && (
                      <ul className="ml-9 mt-1 space-y-1 max-h-[calc(100vh-150px)] overflow-y-auto">
                        {link.children.map((child) => {
                          const ChildIcon = child.icon;
                          return (
                            <li key={child.name}>
                              <Link to={child.path} className={`flex items-center gap-2 px-3 py-1 text-sm rounded ${isExactActive(child.path) ? "bg-neutral-50 text-neutral-700 font-medium dark:bg-neutral-800 dark:text-neutral-300" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"}`}>
                                <ChildIcon className={`w-4 h-4 ${isExactActive(child.path) ? "text-neutral-600 dark:text-neutral-300" : "text-neutral-400 dark:text-neutral-400"}`} />
                                {child.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <Button variant="ghost" onClick={handleLogout} className="mt-auto justify-start gap-3 text-red-600 dark:text-red-400">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </aside>

      {dialogMenu && (
        <Modal open={!!dialogMenu} onClose={() => setDialogMenu(null)}>
          <ul className="py-2">
            {NAV_LINKS.find((link) => link.name === dialogMenu)?.children?.map((child) => {
              const ChildIcon = child.icon;
              const active = location.pathname === child.path;
              return (
                <li key={child.name}>
                  <Link to={child.path} onClick={() => setDialogMenu(null)} className={`flex items-center gap-2 px-4 py-2 text-sm rounded ${active ? "bg-neutral-50 text-neutral-700 font-medium dark:bg-neutral-800 dark:text-neutral-300" : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"}`}>
                    <ChildIcon className={`w-4 h-4 ${active ? "text-neutral-600 dark:text-neutral-300" : "text-neutral-400 dark:text-neutral-400"}`} />
                    {child.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Modal>
      )}
    </>
  );
}