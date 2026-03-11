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
export const pathPermissions = (permissions = []) => {


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
  // }

  /* ---------------- Branches ---------------- */
  // if (permissions.includes("BRANCHES")) {
  //   NAV_LINKS.push({
  //     name: "Branches",
  //     path: "/dashboard/store/branches",
  //     icon: Store,
  //   });
  // }

      NAV_LINKS.push({
      name: "Branches",
      path: "/dashboard/store/branches",
      icon: Store,
      children: [
        { name: "All Branches", path: "/dashboard/store/branches", icon: Store, permission: "BRANCHES" },
        { name: "Allowed Branches", path: "/dashboard/store/allowed-branches", icon: Store, permission: "BRANCHES" },
      ],
    });
  // addParentWithChildren("BRANCHES", Store, [
  //   { name: "All Branches", path: "/dashboard/store/branches", icon: Store, permission: "BRANCHES" },
  //   { name: "Allowed Branches", path: "/dashboard/store/allowed-branches", icon: Store, permission: "BRANCHES" },
  //    ]);



  /* ---------------- POS ---------------- */
  addParentWithChildren("POS", Store, [
    { name: "POS", path: "/dashboard/pos", icon: Store, permission: "POS" },
    { name: "Shift Summary", path: "/dashboard/pos/shift-summary", icon: Clock, permission: "POS" },
    { name: "Orders (me)", path: "/dashboard/pos/orders", icon: FileText, permission: "ORDERS" },
    { name: "Refunds (me)", path: "/dashboard/pos/refunds", icon: DollarSign, permission: "ORDERS" },
  ]);

  /* ---------------- Users ---------------- */
  addParentWithChildren("Users", Users, [
    { name: "Branch Users", path: "/dashboard/branch/users", icon: Users, permission: "USERS" },
    { name: "Store Users", path: "/dashboard/store/users", icon: Users, permission: "USERS" },
    { name: "Role Permissions", path: "/dashboard/branch/users/permissions", icon: ClipboardList, permission: "USERS" },
  ]);

  /* ---------------- Accounts ---------------- */
  addParentWithChildren("Accounts", DollarSign, [
    { name: "Chart of Accounts", path: "/dashboard/branch/accounts/chart-of-accounts", icon: Archive, permission: "ACCOUNTS" },
    { name: "Journal Entries", path: "/dashboard/branch/accounts/journals", icon: FileText, permission: "ACCOUNTS" },
    { name: "Profit & Loss", path: "/dashboard/branch/accounts/profit-loss", icon: Report, permission: "ACCOUNTS" },
    { name: "Balance Sheet", path: "/dashboard/branch/accounts/balance-sheet", icon: Report, permission: "ACCOUNTS" },
    { name: "Trial Balance", path: "/dashboard/branch/accounts/trial-balance", icon: Report, permission: "ACCOUNTS" },
  ]);

  /* ---------------- Orders / Transactions ---------------- */
  addParentWithChildren("Orders / Transactions", DollarSign, [
    { name: "Orders", path: "/dashboard/branch/orders", icon: Archive, permission: "ORDERS" },
    { name: "Refunds", path: "/dashboard/branch/orders/refunds", icon: FileText, permission: "ORDERS" },
    { name: "Store Orders", path: "/dashboard/store/orders", icon: Archive, permission: "ORDERS" },
    { name: "Store Refunds", path: "/dashboard/store/orders/refunds", icon: FileText, permission: "ORDERS" },
  ]);

   addParentWithChildren(" Transactions", DollarSign, [
    { name: "Branch Transactions", path: "/dashboard/branch/transactions", icon: Archive, permission: "TRANSACTIONS" },
    { name: "Store Transactions", path: "/dashboard/store/transactions", icon: Archive, permission: "TRANSACTIONS" },
    ]);

  

  /* ---------------- Products ---------------- */
  addParentWithChildren("Products", ClipboardList, [
    { name: "Products", path: "/dashboard/store/products", icon: Archive, permission: "PRODUCTS" },
    { name: "Product Variants", path: "/dashboard/store/products/variants", icon: FileText, permission: "PRODUCTS" },
    { name: "Product Categories", path: "/dashboard/store/products/categories", icon: FileText, permission: "PRODUCTS" },
    { name: "Product Brands", path: "/dashboard/store/products/brands", icon: FileText, permission: "PRODUCTS" },
  ]);

  /* ---------------- Inventory ---------------- */
  addParentWithChildren("Inventory", ClipboardList, [
    { name: "Inventory", path: "/dashboard/branch/inventory", icon: Archive, permission: "INVENTORY" },
    { name: "Inventory Movements", path: "/dashboard/branch/inventory/inventory-movements", icon: FileText, permission: "INVENTORY" },
    { name: "Purchase", path: "/dashboard/branch/inventory/purchases", icon: FileText, permission: "INVENTORY" },
    { name: "Suppliers", path: "/dashboard/branch/inventory/suppliers", icon: FileText, permission: "INVENTORY" },
  ]);

  addParentWithChildren("Payroll", ClipboardList, [
    { name: "Payroll Report", path: "/dashboard/branch/employee/payroll-dashboard", icon: Archive, permission: "PAYROLL" },
    { name: "Employee Salary ", path: "/dashboard/branch/employee/salary", icon: FileText, permission: "PAYROLL" },
    { name: "Payroll ", path: "/dashboard/branch/employee/payroll", icon: FileText, permission: "PAYROLL" },
  ]);

  /* ---------------- Payroll ---------------- */
  // if (permissions.includes("PAYROLL")) {
  //   NAV_LINKS.push({
  //     name: "Payroll",
  //     path: "/dashboard/branch/payroll",
  //     icon: FileText,
  //   });
  // }

  /* ---------------- Settings ---------------- */
  addParentWithChildren("Settings", Settings, [

    { name: "Store Settings", path: "/dashboard/settings", icon: Settings,  },
    { name: "Branch Settings", path: "/dashboard/branch/settings", icon: Settings, permission: "SETTINGS" },
    { name: "Profile Settings", path: "/dashboard/profile/settings", icon: Settings },
  ]);






  return NAV_LINKS;
};