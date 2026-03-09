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
  ClipboardList,
} from "lucide-react";

/**
 * Build sidebar navigation based on permissions
 * @param {string[]} permissions
 * @returns {Array}
 */
export const pathPermissionsSuperAdmin = (permissions = [],isSuperAdmin) => {


  const NAV_LINKS = [];

  const addParentWithChildren = (parentName, parentIcon, children) => {
  const allowedChildren = children.filter((child) => {
    if (!child.permission) return true;
    return permissions.includes(child.permission);
  });

  if (allowedChildren.length > 0) {
    NAV_LINKS.push({
      name: parentName,
      icon: parentIcon,
      children: allowedChildren.map(({ name, path, icon }) => ({
        name,
        path,
        icon,
      })),
    });
  }
};

  /* ---------------- Dashboard ---------------- */
  // if (permissions.includes("DASHBOARD")) {
    NAV_LINKS.push({
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    });
    NAV_LINKS.push({
      name: "Stores",
      path: "/dashboard/admin/stores",
      icon: Store,
    });
    NAV_LINKS.push({
      name: "Requests",
      path: "/dashboard/admin/requests",
      icon: FileText,
    });
  // }

  /* ---------------- Branches ---------------- */
  // if (permissions.includes("BRANCHES")) {
  //   NAV_LINKS.push({
  //     name: "Branches",
  //     path: "/dashboard/store/branches",
  //     icon: Store,
  //   });
  // }

    
  // addParentWithChildren("BRANCHES", Store, [
  //   { name: "All Branches", path: "/dashboard/store/branches", icon: Store, permission: "BRANCHES" },
  //   { name: "Allowed Branches", path: "/dashboard/store/allowed-branches", icon: Store, permission: "BRANCHES" },
  //    ]);



  /* ---------------- Settings ---------------- */
  addParentWithChildren("Settings", Settings, [

    { name: "Profile Settings", path: "/dashboard/profile/settings", icon: Settings },
  ]);



// const SUPER_ADMIN_LINKS=isSuperAdmin?


  return isSuperAdmin?[{
      name: "Payroll",
      path: "/dashboard/branch/payroll",
      icon: FileText,
    }]:NAV_LINKS;
};