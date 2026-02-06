import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
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
  X,
  Menu,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/hooks/useSidebar";

const NAV_LINKS = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
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
      { name: "Users", path: "/dashboard/users", icon: Users },
      { name: "Role Permissions", path: "/dashboard/users/role-permissions", icon: ClipboardList },
    ],
  },
  {
    name: "Accounts",
    icon: DollarSign,
    children: [
      { name: "Chart of Accounts", path: "/dashboard/accounts/chart-of-accounts", icon: Archive },
      { name: "Journal Entries", path: "/dashboard/accounts/journals", icon: FileText },
      { name: "Profit & Loss", path: "/dashboard/accounts/profit-loss", icon: Report },
      { name: "Balance Sheet", path: "/dashboard/accounts/balance-sheet", icon: Report },
      { name: "Trial Balance", path: "/dashboard/accounts/trial-balance", icon: Report },
    ],
  },
  {
    name: "Products",
    icon: ClipboardList,
    children: [
      { name: "Products", path: "/dashboard/products", icon: Archive },
      { name: "Product Variants", path: "/dashboard/products/variants", icon: FileText },
      { name: "Product Categories", path: "/dashboard/products/categories", icon: FileText },
      { name: "Product Brands", path: "/dashboard/products/brands", icon: FileText },
    ],
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  const [openMenus, setOpenMenus] = useState({});
  const [floatingMenu, setFloatingMenu] = useState(null);

  useEffect(() => {
    const open = {};
    NAV_LINKS.forEach((link) => {
      if (link.children) {
        open[link.name] = link.children.some(
          (child) => child.path === location.pathname
        );
      }
    });
    setOpenMenus(open);
    setFloatingMenu(null);
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

  const toggleSubMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleParentClick = (link) => {
    if (!sidebarOpen && link.children) {
      setFloatingMenu((prev) => (prev === link.name ? null : link.name));
      return;
    }
    if (sidebarOpen && link.children) {
      toggleSubMenu(link.name);
      return;
    }
    navigate(link.path);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-50 h-screen top-0 left-0
          bg-neutral-50 dark:bg-neutral-900 border-r dark:border-neutral-700 shadow-lg
          transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-20"}
          overflow-y-auto
        `}
      >
        <div className="flex flex-col h-full px-4 py-6">
          {/* HEADER */}
          <div className="mb-6 flex items-center justify-between">
            <Store className="w-7 h-7 text-neutral-700 dark:text-neutral-200" />
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              <Menu className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />
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
                  <li key={link.name} className="relative">
                    {/* PARENT */}
                    <button
                      onClick={() => handleParentClick(link)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg
                        transition-colors
                        ${active
                          ? "bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-50"
                          : "text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />
                        {sidebarOpen && (
                          <span className="text-sm font-medium">{link.name}</span>
                        )}
                      </div>

                      {hasChildren && sidebarOpen && (
                        isOpen ? <ChevronUp size={16} className="text-neutral-700 dark:text-neutral-200" /> 
                               : <ChevronDown size={16} className="text-neutral-700 dark:text-neutral-200" />
                      )}
                    </button>

                    {/* INLINE SUBMENU */}
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
                                    ? "bg-neutral-200 text-neutral-900 font-medium dark:bg-neutral-700 dark:text-neutral-50"
                                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                  }
                                `}
                              >
                                <ChildIcon
                                  className={`w-4 h-4 ${isExactActive(child.path)
                                    ? "text-neutral-900 dark:text-neutral-50"
                                    : "text-neutral-400 dark:text-neutral-400"
                                  }`}
                                />
                                {child.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {/* ABSOLUTE SUBMENU */}
                    {hasChildren && !sidebarOpen && floatingMenu === link.name && (
                      <div className="absolute left-20 top-0 w-64 bg-neutral-50 dark:bg-neutral-900 border dark:border-neutral-700 shadow-xl rounded-lg z-50 max-h-screen overflow-y-auto">
                        <ul className="py-2">
                          {link.children.map((child) => {
                            const ChildIcon = child.icon;
                            return (
                              <li key={child.name}>
                                <Link
                                  to={child.path}
                                  onClick={() => setFloatingMenu(null)}
                                  className={`
                                    flex items-center gap-2 px-4 py-2 text-sm
                                    ${isExactActive(child.path)
                                      ? "bg-neutral-200 text-neutral-900 font-medium dark:bg-neutral-700 dark:text-neutral-50"
                                      : "text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                    }
                                  `}
                                >
                                  <ChildIcon
                                    className={`w-4 h-4 ${isExactActive(child.path)
                                      ? "text-neutral-900 dark:text-neutral-50"
                                      : "text-neutral-400 dark:text-neutral-400"
                                    }`}
                                  />
                                  {child.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
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
    </>
  );
}
