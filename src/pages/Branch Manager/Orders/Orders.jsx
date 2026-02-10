import React from 'react'
import RecentOrders from './RecentOrders'
import { useSelector } from 'react-redux';
import ContentLayout from '../../Dashboard/ContentLayout';

function Orders() {

      const { branch } = useSelector((state) => state.branch);
      const branchId = branch?.id;
  return (
    <ContentLayout title="Order History" subTitle="orders">{branchId&&<RecentOrders branchId={branchId}/>}</ContentLayout>
  )
}

export default Orders