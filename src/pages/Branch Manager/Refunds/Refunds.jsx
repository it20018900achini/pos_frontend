import React from 'react'
import RecentRefunds from './RecentRefunds'
import { useSelector } from 'react-redux';
import ContentLayout from '../../Dashboard/ContentLayout';

function Refunds() {
  
    const { branch } = useSelector((state) => state.branch);
    const branchId = branch?.id;
  return (
    <ContentLayout title="Refund History" subTitle="refunds">
<RecentRefunds branchId={branchId} />

    </ContentLayout>
  )
}

export default Refunds