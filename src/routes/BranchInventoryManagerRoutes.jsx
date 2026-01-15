import React from "react";
import { Routes, Route } from "react-router";
import InventoryManagerDashboard from "../pages/InventoryManager/Dashboard/InventoryManagerDashboard";
import Dashboard from "../pages/InventoryManager/Dashboard/Dashboard";
import {
  Inventory,
} from "../pages/InventoryManager";

import Purchase from "../pages/InventoryManager/purchase/Purchase";
import Suppliers from "../pages/InventoryManager/supplier/Suppliers";
// Import Branch Manager Dashboard Layout

// Import Branch Manager pages

// import PayrollOverview from "../pages/Branch Manager/payroll/PayrollOverview";

const BranchInventoryManagerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<InventoryManagerDashboard />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="inventory" element={<Inventory />} />

        
        <Route path="purchases" element={<Purchase />} />
        <Route path="suppliers" element={<Suppliers />} />
      </Route>
    </Routes>
  );
};

export default BranchInventoryManagerRoutes;