import React, { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ChevronUp, Menu, LogOut, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/hooks/useSidebar";
import { logout } from "@/Redux Toolkit/features/user/userThunks";
import { pathPermissions } from "./pathPermissions";

/* -----------------------------
   Premium Glass Modal
------------------------------ */
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm transition-all"
        onClick={onClose}
      />
      <div className="relative bg-white/30 dark:bg-neutral-900/30 backdrop-blur-lg border border-white/10 dark:border-neutral-700 rounded-2xl shadow-2xl w-80 max-h-[80vh] overflow-y-auto transition-all duration-300">
        {children}
      </div>
    </div>
  );
};

/* -----------------------------
   Premium Glass Sidebar
------------------------------ */
export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userProfile, selectedBranchId } = useSelector((state) => state.user);
  const user = userProfile?.user;

  const selectedBranch =
    user?.roleBranchMap?.find((b) => b.branchId === Number(selectedBranchId)) ||
    user?.defaultBranch;
  const permissions = selectedBranch?.permissions || [];

  const NAV_LINKS = useMemo(() => pathPermissions(permissions), [permissions]);

  const [openMenus, setOpenMenus] = useState({});
  const [dialogMenu, setDialogMenu] = useState(null);

  const isExactActive = (path) => location.pathname === path;
  const isParentActive = (link) =>
    link.children ? link.children.some((child) => isExactActive(child.path)) : isExactActive(link.path);

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
      <aside
        className={`
          
          fixed md:static z-50 h-screen top-0 left-0
          transition-all duration-500 ease-in-out
          border-r border-white/10 dark:border-neutral-700
          shadow-2xl  overflow-y-auto
          ${sidebarOpen
            ? "w-64 bg-white/30 dark:bg-neutral-900/30 backdrop-blur-md"
            : "w-20 bg-white/20 dark:bg-neutral-900/20 backdrop-blur-sm"
          }
        `}
      >
        <div className="flex flex-col h-full px-3 py-6">

          {/* HEADER */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/30 dark:bg-neutral-800/30 backdrop-blur-sm shadow-inner">
                <Store className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </div>

              {sidebarOpen && (
                <div className="flex flex-col leading-tight">
                  <span className="text-base font-semibold text-neutral-800 dark:text-neutral-100 truncate max-w-[160px]">
                    {user?.store?.name || "POS System"}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {user?.store?.storeType}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="p-2 rounded-lg hover:bg-white/30 dark:hover:bg-neutral-800/30 backdrop-blur-sm transition-all duration-300"
            >
              <Menu className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </button>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const active = isParentActive(link);
                const hasChildren = !!link.children;
                const isOpen = openMenus[link.name];

                return (
                  <li key={link.name} className="relative">
                    <button
                      onClick={() => handleParentClick(link)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-300
                        ${active
                          ? "bg-gradient-to-r from-indigo-400/20 via-pink-400/20 to-purple-400/20 text-indigo-700 dark:text-indigo-300 shadow-inner"
                          : "text-neutral-700 hover:bg-gradient-to-r hover:from-indigo-200/10 hover:via-pink-200/10 hover:to-purple-200/10 dark:text-neutral-300 dark:hover:bg-gradient-to-r dark:hover:from-indigo-400/10 dark:hover:via-pink-400/10 dark:hover:to-purple-400/10"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                        {sidebarOpen && <span className="text-sm font-medium">{link.name}</span>}
                      </div>
                      {hasChildren && sidebarOpen && (isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    </button>

                    {/* CHILDREN */}
                    {hasChildren && isOpen && sidebarOpen && (
                      <ul className="ml-9 mt-1 space-y-1">
                        {link.children.map((child) => {
                          const ChildIcon = child.icon;
                          const activeChild = isExactActive(child.path);

                          return (
                            <li key={child.name}>
                              <Link
                                to={child.path}
                                className={`
                                  flex items-center gap-2 px-3 py-1 text-sm rounded transition-all duration-300
                                  ${activeChild
                                    ? "bg-gradient-to-r from-indigo-400/20 via-pink-400/20 to-purple-400/20 text-indigo-700 font-medium dark:text-indigo-300 shadow-inner"
                                    : "text-neutral-600 hover:bg-gradient-to-r hover:from-indigo-200/10 hover:via-pink-200/10 hover:to-purple-200/10 dark:text-neutral-400 dark:hover:bg-gradient-to-r dark:hover:from-indigo-400/10 dark:hover:via-pink-400/10 dark:hover:to-purple-400/10"
                                  }
                                `}
                              >
                                <ChildIcon className="w-4 h-4" />
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
            className="mt-auto justify-start gap-3 text-red-600 dark:text-red-400 hover:brightness-110 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </aside>

      {/* DIALOG FOR COLLAPSED MODE */}
      {dialogMenu && (
        <Modal open={!!dialogMenu} onClose={() => setDialogMenu(null)}>
          <ul className="py-2">
            {NAV_LINKS.find((link) => link.name === dialogMenu)?.children?.map((child) => {
              const ChildIcon = child.icon;
              const activeChild = isExactActive(child.path);

              return (
                <li key={child.name}>
                  <Link
                    to={child.path}
                    onClick={() => setDialogMenu(null)}
                    className={`
                      flex items-center gap-2 px-4 py-2 text-sm rounded transition-all duration-300
                      ${activeChild
                        ? "bg-gradient-to-r from-indigo-400/20 via-pink-400/20 to-purple-400/20 text-indigo-700 font-medium dark:text-indigo-300 shadow-inner"
                        : "text-neutral-700 hover:bg-gradient-to-r hover:from-indigo-200/10 hover:via-pink-200/10 hover:to-purple-200/10 dark:text-neutral-300 dark:hover:bg-gradient-to-r dark:hover:from-indigo-400/10 dark:hover:via-pink-400/10 dark:hover:to-purple-400/10"
                      }
                    `}
                  >
                    <ChildIcon className="w-4 h-4" />
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