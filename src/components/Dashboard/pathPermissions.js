// sidebarConfig.js

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

  /* ---------------- Dashboard ---------------- */
  if (permissions.includes("DASHBOARD")) {
    NAV_LINKS.push({
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    });
  }

  /* ---------------- Branches ---------------- */
  if (permissions.includes("BRANCHES")) {
    NAV_LINKS.push({
      name: "Branches",
      path: "/dashboard/store/branches",
      icon: Store,
    });
  }

  /* ---------------- POS ---------------- */
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

  /* ---------------- Users ---------------- */
  if (permissions.includes("USERS")) {
    NAV_LINKS.push({
      name: "Users",
      icon: Users,
      children: [
        { name: "Branch Users", path: "/dashboard/branch/users", icon: Users },
        { name: "Store Users", path: "/dashboard/store/users", icon: Users },
        {
          name: "Role Permissions",
          path: "/dashboard/branch/users/permissions",
          icon: ClipboardList,
        },
      ],
    });
  }

  /* ---------------- Accounts ---------------- */
  if (permissions.includes("ACCOUNTS")) {
    NAV_LINKS.push({
      name: "Accounts",
      icon: DollarSign,
      children: [
        {
          name: "Chart of Accounts",
          path: "/dashboard/branch/accounts/chart-of-accounts",
          icon: Archive,
        },
        {
          name: "Journal Entries",
          path: "/dashboard/branch/accounts/journals",
          icon: FileText,
        },
        {
          name: "Profit & Loss",
          path: "/dashboard/branch/accounts/profit-loss",
          icon: Report,
        },
        {
          name: "Balance Sheet",
          path: "/dashboard/branch/accounts/balance-sheet",
          icon: Report,
        },
        {
          name: "Trial Balance",
          path: "/dashboard/branch/accounts/trial-balance",
          icon: Report,
        },
      ],
    });
  }

  /* ---------------- Orders ---------------- */
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

  /* ---------------- Transactions ---------------- */
  if (permissions.includes("TRANSACTIONS")) {
    NAV_LINKS.push({
      name: "Transactions",
      path: "/dashboard/branch/transactions",
      icon: Settings,
    });
  }

  /* ---------------- Products ---------------- */
  if (permissions.includes("PRODUCTS")) {
    NAV_LINKS.push({
      name: "Products",
      icon: ClipboardList,
      children: [
        { name: "Products", path: "/dashboard/store/products", icon: Archive },
        {
          name: "Product Variants",
          path: "/dashboard/store/products/variants",
          icon: FileText,
        },
        {
          name: "Product Categories",
          path: "/dashboard/store/products/categories",
          icon: FileText,
        },
        {
          name: "Product Brands",
          path: "/dashboard/store/products/brands",
          icon: FileText,
        },
      ],
    });
  }

  /* ---------------- Inventory ---------------- */
  if (permissions.includes("INVENTORY")) {
    NAV_LINKS.push({
      name: "Inventory",
      icon: ClipboardList,
      children: [
        { name: "Inventory", path: "/dashboard/branch/inventory", icon: Archive },
        {
          name: "Inventory Movements",
          path: "/dashboard/branch/inventory/inventory-movements",
          icon: FileText,
        },
        {
          name: "Purchase",
          path: "/dashboard/branch/inventory/purchases",
          icon: FileText,
        },
        {
          name: "Suppliers",
          path: "/dashboard/branch/inventory/suppliers",
          icon: FileText,
        },
      ],
    });
  }

  /* ---------------- Payroll ---------------- */
  if (permissions.includes("PAYROLL")) {
    NAV_LINKS.push({
      name: "Payroll",
      path: "/dashboard/branch/payroll",
      icon: FileText,
    });
  }

  /* ---------------- Settings ---------------- */
  if (permissions.includes("SETTINGS")) {
    NAV_LINKS.push({
      name: "Settings (Store)",
      path: "/dashboard/settings",
      icon: Settings,
    });

    NAV_LINKS.push({
      name: "Settings (Branch)",
      path: "/dashboard/branch/settings",
      icon: Settings,
    });
  }

  return NAV_LINKS;
};