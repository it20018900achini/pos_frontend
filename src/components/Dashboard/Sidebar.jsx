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

// ---------------- NAV_LINKS ----------------




// ---------------- MODAL COMPONENT ----------------
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center pt-20">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 dark:bg-black/40"
        onClick={onClose}
      />
      {/* Modal content */}
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-lg w-80 max-h-[80vh] overflow-y-auto z-50">
        {children}
      </div>
    </div>
  );
};

// ---------------- SIDEBAR COMPONENT ----------------
export default function Sidebar() {

  const { userProfile, loading } = useSelector((state) => state.user);

const NAV_LINKS =[];
if (userProfile?.user?.permissions?.includes("DASHBOARD")) {
  NAV_LINKS.push({ name: "Dashboard", path: "/dashboard", icon: LayoutDashboard });
}
if (userProfile?.user?.permissions?.includes("BRANCHES")) {
  NAV_LINKS.push({ name: "Branches ", path: "/dashboard/store/branches", icon: Store });
}
if (userProfile?.user?.permissions?.includes("POS")) {
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
if (userProfile?.user?.permissions?.includes("USERS")) {
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
if (userProfile?.user?.permissions?.includes("ACCOUNTS")) {
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
if (userProfile?.user?.permissions?.includes("ORDERS")) {
  NAV_LINKS.push({
    name: "Orders / Transactions",
    icon: DollarSign,
    children: [
      { name: "Orders", path: "/dashboard/branch/orders", icon: Archive },
      { name: "Refunds", path: "/dashboard/branch/orders/refunds", icon: FileText },
      { name: "Quotations", path: "/dashboard/branch/orders/quotations", icon: FileText },
    ],
  });
}

if (userProfile?.user?.permissions?.includes("TRANSACTIONS")) {
  NAV_LINKS.push({ name: "Transactions", path: "/dashboard/branch/transactions", icon: Settings });
}
if (userProfile?.user?.permissions?.includes("PRODUCTS")) {
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

if (userProfile?.user?.permissions?.includes("INVENTORY")) {
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

if (userProfile?.user?.permissions?.includes("PAYROLL")) {
  NAV_LINKS.push({ name: "Payroll", path: "/dashboard/branch/payroll", icon: FileText });
}

if (userProfile?.user?.permissions?.includes("SETTINGS")) {
  NAV_LINKS.push({ name: "Settings(Store)", path: "/dashboard/settings", icon: Settings });
  NAV_LINKS.push({ name: "Settings(Branch)", path: "/dashboard/branch/settings", icon: Settings });
}
const NAV_LINKS1 = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Branches ", path: "/dashboard/store/branches", icon: Store },
  {
    name: "POS",
    icon: Store,
    children: [
      { name: "POS", path: "/dashboard/pos", icon: Store },
      { name: "Shift Summary", path: "/dashboard/pos/shift-summary", icon: Clock },
      { name: "Orders", path: "/dashboard/pos/orders", icon: FileText },
      { name: "Refunds", path: "/dashboard/pos/refunds", icon: DollarSign },
    ],
  },
  {
    name: "Users",
    icon: Users,
    children: [
      { name: "Users", path: "/dashboard/branch/users", icon: Users },
      { name: "Role Permissions", path: "/dashboard/branch/users/permissions", icon: ClipboardList },
    ],
  },
  {
    name: "Accounts",
    icon: DollarSign,
    children: [
      { name: "Chart of Accounts", path: "/dashboard/branch/accounts/chart-of-accounts", icon: Archive },
      { name: "Journal Entries", path: "/dashboard/branch/accounts/journals", icon: FileText },
      { name: "Profit & Loss", path: "/dashboard/branch/accounts/profit-loss", icon: Report },
      { name: "Balance Sheet", path: "/dashboard/branch/accounts/balance-sheet", icon: Report },
      { name: "Trial Balance", path: "/dashboard/branch/accounts/trial-balance", icon: Report },
    ],
  },
  {
    name: "Orders / Transactions",
    icon: DollarSign,
    children: [
      { name: "Orders", path: "/dashboard/branch/orders", icon: Archive },
      { name: "Refunds", path: "/dashboard/branch/orders/refunds", icon: FileText },
      { name: "Quotations", path: "/dashboard/branch/orders/quotations", icon: FileText },
    ],
  },
  { name: "Transactions", path: "/dashboard/branch/transactions", icon: Settings },
  {
    name: "Products",
    icon: ClipboardList,
    children: [
      { name: "Products", path: "/dashboard/store/products", icon: Archive },
      { name: "Product Variants", path: "/dashboard/store/products/variants", icon: FileText },
      { name: "Product Categories", path: "/dashboard/store/products/categories", icon: FileText },
      { name: "Product Brands", path: "/dashboard/store/products/brands", icon: FileText },
    ],
  },
  {
    name: "Inventory",
    icon: ClipboardList,
    children: [
      { name: "Inventory", path: "/dashboard/branch/inventory", icon: Archive },
      { name: "Inventory Movements", path: "/dashboard/branch/inventory/inventory-movements", icon: FileText },
      { name: "Purchase", path: "/dashboard/branch/inventory/purchases", icon: FileText },
      { name: "Suppliers", path: "/dashboard/branch/inventory/suppliers", icon: FileText },
    ],
  },
  { name: "Payroll", path: "/dashboard/branch/payroll", icon: FileText },
  { name: "Salary", path: "/dashboard/branch/salary/:branchId", icon: FileText },
  { name: "Settings(Store)", path: "/dashboard/settings", icon: Settings },
  { name: "Settings(Branch)", path: "/dashboard/branch/settings", icon: Settings },
];

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  const [openMenus, setOpenMenus] = useState({});
  const [dialogMenu, setDialogMenu] = useState(null);

  // Open submenu for current page
  useEffect(() => {
    const open = {};
    NAV_LINKS.forEach((link) => {
      if (link.children) {
        open[link.name] = link.children.some((child) => child.path === location.pathname);
      }
    });
    setOpenMenus(open);
    setDialogMenu(null);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login");
  };

  const isExactActive = (path) => location.pathname === path;
  const isParentActive = (link) =>
    link.children
      ? link.children.some((c) => isExactActive(c.path))
      : isExactActive(link.path);

  const handleParentClick = (link) => {
    if (link.children) {
      if (sidebarOpen) {
        // Expanded sidebar → toggle inline submenu
        setOpenMenus((prev) => ({ ...prev, [link.name]: !prev[link.name] }));
      } else {
        // Collapsed sidebar → open dialog
        setDialogMenu((prev) => (prev === link.name ? null : link.name));
      }
      return;
    }
    navigate(link.path);
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-50 h-screen top-0 left-0
          bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-lg
          transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-20"}
          overflow-y-auto
        `}
      >
        <div className="flex flex-col h-full px-4 py-6">
          {/* HEADER */}
          {/* <pre>
            {JSON.stringify(userProfile?.user?.roles, null, 2)}
          </pre> */}
          
          <div className="mb-6 flex items-center justify-between">
            <Store className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* NAV */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const active = isParentActive(link);
                const hasChildren = !!link.children;
                const isOpen = openMenus[link.name];

                return (
                  <li key={link.name} className="relative z-[100]">
                    {/* PARENT */}
                    <button
                      onClick={() => handleParentClick(link)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg
                        transition-colors
                        ${active
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-300"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                        {sidebarOpen && <span className="text-sm font-medium">{link.name}</span>}
                      </div>

                      {hasChildren && sidebarOpen && (
                        isOpen
                          ? <ChevronUp size={16} className="text-gray-700 dark:text-gray-300" />
                          : <ChevronDown size={16} className="text-gray-700 dark:text-gray-300" />
                      )}
                    </button>

                    {/* INLINE SUBMENU for expanded sidebar */}
                    {hasChildren && isOpen && sidebarOpen && (
                      <ul className="ml-9 mt-1 space-y-1 max-h-[calc(100vh-150px)] overflow-y-auto">
                        {link.children.map((child) => {
                          const ChildIcon = child.icon;
                          return (
                            <li key={child.name}>
                              <Link
                                to={child.path}
                                className={`
                                  flex items-center gap-2 px-3 py-1 text-sm rounded
                                  ${isExactActive(child.path)
                                    ? "bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-800 dark:text-indigo-300"
                                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                  }
                                `}
                              >
                                <ChildIcon
                                  className={`w-4 h-4 ${isExactActive(child.path)
                                    ? "text-indigo-600 dark:text-indigo-300"
                                    : "text-gray-400 dark:text-gray-400"
                                  }`}
                                />
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

          {/* LOGOUT */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="mt-auto justify-start gap-3 text-red-600 dark:text-red-400"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </aside>

      {/* DIALOG for collapsed sidebar */}
     {/* DIALOG for collapsed sidebar */}
{dialogMenu && (
  <Modal open={!!dialogMenu} onClose={() => setDialogMenu(null)}>
    <ul className="py-2">
      {NAV_LINKS.find((link) => link.name === dialogMenu)?.children?.map((child) => {
        const ChildIcon = child.icon;
        const active = location.pathname === child.path; // check if active
        return (
          <li key={child.name}>
            <Link
              to={child.path}
              onClick={() => setDialogMenu(null)}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm rounded
                ${active
                  ? "bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-800 dark:text-indigo-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }
              `}
            >
              <ChildIcon className={`w-4 h-4 ${active ? "text-indigo-600 dark:text-indigo-300" : "text-gray-400 dark:text-gray-400"}`} />
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
