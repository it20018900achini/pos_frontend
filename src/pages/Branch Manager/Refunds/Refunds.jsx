"use client";

import React from "react";
import { useSelector } from "react-redux";
import ContentLayout from "../../Dashboard/ContentLayout";
import RecentRefunds from "./RecentRefunds";

function Refunds() {
  const { branch } = useSelector((state) => state.branch);
  const { branches, loading, error } = useSelector((state) => state.branch);
  const { userProfile } = useSelector((state) => state.user);

  // If cashier → use their branch
  // Otherwise → use selected branch from slice
 

  return (
    <ContentLayout
      title="Refund History"
      subTitle="refunds"
    >
      {/* {JSON.stringify(branches)} */}
      <RecentRefunds branches={branches} />
    </ContentLayout>
  );
}

export default Refunds;