"use client";

import React from "react";
import { useSelector } from "react-redux";
import RecentOrders from "./RecentOrders";
import ContentLayout from "../../Dashboard/ContentLayout";

function Orders() {
  const { branch } = useSelector((state) => state.branch);
  const { branches, loading, error } = useSelector((state) => state.branch);
  const { userProfile } = useSelector((state) => state.user);

  return (
    <ContentLayout
      title="Order History"
      subTitle="orders"
    >
      
      <RecentOrders branches={userProfile?.user?.branch?.id ? branches.filter(b => b.id === userProfile.user.branch.id):branches} />
    </ContentLayout>
  );
}

export default Orders;