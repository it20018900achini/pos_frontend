import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/Redux Toolkit/features/user/userThunks";
import {
  LayoutDashboard,
  Store,
  Settings,
  FileText,
  Clock,
  LogOut,
  ChevronDown,
  ChevronUp,
  Users,
  X,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/hooks/useSidebar";

const NAV_LINKS = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  {
    name: "POS",
    icon: Store,
    children: [
      { name: "POS", path: "/dashboard/pos", icon: FileText },
      { name: "Shift Summary", path: "/dashboard/pos/shift-summary", icon: Clock },
      { name: "Refunds", path: "/dashboard/refunds", icon: FileText },
    ],
  },
  {
    name: "Users",
    icon: Store,
    children: [
      { name: "Users", path: "/dashboard/users", icon: Users },
      { name: "Role Permissions", path: "/dashboard/users/role-permissions", icon: Users },
    ],
  },
  {
    name: "Products",
    icon: Store,
    children: [
      { name: "Products", path: "/dashboard/products", icon: FileText },
      { name: "Product Variants", path: "/dashboard/products/variants", icon: FileText },
      { name: "Product Categories", path: "/dashboard/products/categories", icon: FileText },
      { name: "Product Brands", path: "/dashboard/products/brands", icon: FileText },
    ],
  },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
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
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static z-50 h-screen top-0 left-0
          bg-white border-r shadow-lg
          transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-20"}
        `}
      >
        <div className="flex flex-col h-full px-4 py-6">
          {/* HEADER */}
          <div className="mb-6 flex items-center justify-between">
            <Store className="w-7 h-7 text-indigo-600" />
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* NAV */}
          <nav className="flex-1">
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
                        ${
                          active
                            ? "bg-indigo-100 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-indigo-500" />
                        {sidebarOpen && (
                          <span className="text-sm font-medium">{link.name}</span>
                        )}
                      </div>

                      {hasChildren && sidebarOpen && (
                        isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </button>

                    {/* INLINE SUBMENU */}
                    {hasChildren && isOpen && sidebarOpen && (
                      <ul className="ml-9 mt-1 space-y-1">
                        {link.children.map((child) => {
                          const ChildIcon = child.icon || Dot;
                          return (
                            <li key={child.name}>
                              <Link
                                to={child.path}
                                className={`
                                  flex items-center gap-2 px-3 py-1 text-sm rounded
                                  ${
                                    isExactActive(child.path)
                                      ? "bg-indigo-50 text-indigo-700 font-medium"
                                      : "text-gray-600 hover:bg-gray-100"
                                  }
                                `}
                              >
                                <ChildIcon
                                  className={`w-4 h-4 ${
                                    isExactActive(child.path)
                                      ? "text-indigo-600"
                                      : "text-gray-400"
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
                      <div className="absolute left-20 top-0 w-64 bg-white border shadow-xl rounded-lg z-50">
                        <ul className="py-2">
                          {link.children.map((child) => {
                            const ChildIcon = child.icon || Dot;
                            return (
                              <li key={child.name}>
                                <Link
                                  to={child.path}
                                  onClick={() => setFloatingMenu(null)}
                                  className={`
                                    flex items-center gap-2 px-4 py-2 text-sm
                                    ${
                                      isExactActive(child.path)
                                        ? "bg-indigo-50 text-indigo-700 font-medium"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }
                                  `}
                                >
                                  <ChildIcon
                                    className={`w-4 h-4 ${
                                      isExactActive(child.path)
                                        ? "text-indigo-600"
                                        : "text-gray-400"
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
            className="mt-auto justify-start gap-3 text-red-600"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </aside>
    </>
  );
}
