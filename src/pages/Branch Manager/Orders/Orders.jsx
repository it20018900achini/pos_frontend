"use client";

import React from "react";
import { useSelector } from "react-redux";
import RecentOrders from "./RecentOrders";
import ContentLayout from "../../Dashboard/ContentLayout";

function Orders() {
  const { branch } = useSelector((state) => state.branch);
  const { branches, loading, error } = useSelector((state) => state.branch);
  const { userProfile,selectedBranchId } = useSelector((state) => state.user);

  return (
    <ContentLayout
      title="Order History"
      subTitle="orders"
    >
      
      <RecentOrders branches={selectedBranchId ? branches.filter(b => b.id === selectedBranchId):branches} />
    </ContentLayout>
  );
}

export default Orders;