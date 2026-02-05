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
  X,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/hooks/useSidebar";

const NAV_LINKS = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  {
    name: "POS",
    path: "/pos",
    icon: Store,
    children: [
      { name: "POS", path: "/dashboard/pos" },
      { name: "Shift Summary", path: "/dashboard/pos/shift-summary" },
      { name: "Refunds", path: "/dashboard/refunds" },
    ],
  },
  { name: "Subscription Plans", path: "/subscriptions", icon: FileText },
  { name: "Pending Requests", path: "/requests", icon: Clock },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [openMenus, setOpenMenus] = useState({}); // Track submenu state

  // Auto-open submenu if current path matches a child
  useEffect(() => {
    const newOpenMenus = {};
    NAV_LINKS.forEach((link) => {
      if (link.children) {
        newOpenMenus[link.name] = link.children.some(
          (child) => child.path === location.pathname
        );
      }
    });
    setOpenMenus(newOpenMenus);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    setSidebarOpen(false);
    navigate("/auth/login");
  };

  const isExactActive = (path) => location.pathname === path;

  const isParentActive = (link) => {
    if (!link.children) return isExactActive(link.path);
    return link.children.some((child) => isExactActive(child.path));
  };

  const toggleSubMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleParentClick = (link) => {
    if (link.children) {
      toggleSubMenu(link.name);
    } else {
      navigate(link.path);
      setSidebarOpen(true); // keep sidebar open
    }
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static z-50 h-screen left-0 top-0
          bg-white border-r shadow-lg
          overflow-y-auto
          transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-20 md:w-56"}
        `}
      >
        <div className="flex flex-col h-full px-4 py-6">
          {/* HEADER */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="w-7 h-7 text-indigo-600" />
              {sidebarOpen && (
                <span className="text-lg font-bold text-gray-800">
                  Super Admin
                </span>
              )}
            </div>

            {/* TOGGLE / CLOSE BUTTON */}
            <div className="flex items-center gap-2">
              {sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
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
                  <li key={link.name}>
                    {/* PARENT LINK */}
                    <button
                      onClick={() => handleParentClick(link)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg
                        transition-colors duration-300
                        ${active
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-700 hover:bg-gray-100"}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className="w-5 h-5 text-indigo-500" />}
                        {sidebarOpen && (
                          <span className="text-sm font-medium">{link.name}</span>
                        )}
                      </div>

                      {hasChildren && sidebarOpen && (
                        <span>
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </button>

                    {/* SUBMENU */}
                    {hasChildren && isOpen && sidebarOpen && (
                      <ul className="ml-9 mt-1 space-y-1">
                        {link.children.map((child) => {
                          const childActive = isExactActive(child.path);
                          return (
                            <li key={child.name}>
                              <Link
                                to={child.path}
                                onClick={() => setSidebarOpen(true)}
                                className={`
                                  block px-3 py-1 rounded-md text-sm
                                  ${childActive
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-gray-600 hover:bg-gray-100"}
                                `}
                              >
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
          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
