import React, { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  ChevronUp,
  Menu,
  LogOut,
  Store,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/hooks/useSidebar";
import { logout } from "@/Redux Toolkit/features/user/userThunks";
import {  pathPermissions } from "./pathPermissions";

/* -----------------------------
   Modal Component (Collapsed Mode)
------------------------------ */
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center pt-20">
      <div
        className="absolute inset-0 bg-black/30 dark:bg-black/40"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-neutral-900 rounded-lg shadow-lg w-80 max-h-[80vh] overflow-y-auto z-50">
        {children}
      </div>
    </div>
  );
};

/* -----------------------------
   Sidebar Component
------------------------------ */
export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userProfile, selectedBranchId } = useSelector(
    (state) => state.user
  );

  const user = userProfile?.user;

  // Get selected branch
  const selectedBranch =
    user?.roleBranchMap?.find(
      (b) => b.branchId === Number(selectedBranchId)
    ) || user?.defaultBranch;

  const permissions = selectedBranch?.permissions || [];

  // ✅ Memoized Navigation Links
  const NAV_LINKS = useMemo(
    () => pathPermissions(permissions),
    [permissions]
  );

  /* ---------------- Sidebar State ---------------- */
  const [openMenus, setOpenMenus] = useState({});
  const [dialogMenu, setDialogMenu] = useState(null);

  const isExactActive = (path) => location.pathname === path;

  const isParentActive = (link) =>
    link.children
      ? link.children.some((child) => isExactActive(child.path))
      : isExactActive(link.path);

  const handleParentClick = (link) => {
    if (link.children) {
      if (sidebarOpen) {
        setOpenMenus((prev) => ({
          ...prev,
          [link.name]: !prev[link.name],
        }));
      } else {
        setDialogMenu((prev) =>
          prev === link.name ? null : link.name
        );
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
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-50 h-screen top-0 left-0 bg-white dark:bg-neutral-900 border-r dark:border-neutral-700 shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } overflow-y-auto`}
      >
        <div className="flex flex-col h-full px-1 py-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <Store className="w-7 h-7 text-neutral-600 dark:text-neutral-400" />

            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Menu className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </button>
          </div>

          {/* Navigation */}
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        active
                          ? "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                          : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                        {sidebarOpen && (
                          <span className="text-sm font-medium">
                            {link.name}
                          </span>
                        )}
                      </div>

                      {hasChildren && sidebarOpen && (
                        isOpen ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )
                      )}
                    </button>

                    {/* Children */}
                    {hasChildren && isOpen && sidebarOpen && (
                      <ul className="ml-9 mt-1 space-y-1">
                        {link.children.map((child) => {
                          const ChildIcon = child.icon;
                          const active = isExactActive(child.path);

                          return (
                            <li key={child.name}>
                              <Link
                                to={child.path}
                                className={`flex items-center gap-2 px-3 py-1 text-sm rounded ${
                                  active
                                    ? "bg-neutral-50 text-neutral-700 font-medium dark:bg-neutral-800 dark:text-neutral-300"
                                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                }`}
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

          {/* Logout */}
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

      {/* Dialog for collapsed mode */}
      {dialogMenu && (
        <Modal open={!!dialogMenu} onClose={() => setDialogMenu(null)}>
          <ul className="py-2">
            {NAV_LINKS.find(
              (link) => link.name === dialogMenu
            )?.children?.map((child) => {
              const ChildIcon = child.icon;
              const active = isExactActive(child.path);

              return (
                <li key={child.name}>
                  <Link
                    to={child.path}
                    onClick={() => setDialogMenu(null)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded ${
                      active
                        ? "bg-neutral-50 text-neutral-700 font-medium dark:bg-neutral-800 dark:text-neutral-300"
                        : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    }`}
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