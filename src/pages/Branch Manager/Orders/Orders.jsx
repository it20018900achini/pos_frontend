import React from 'react'
import RecentOrders from './RecentOrders'
import { useSelector } from 'react-redux';

function Orders() {

      const { branch } = useSelector((state) => state.branch);
      const branchId = branch?.id;
  return (
    <div><RecentOrders branchId={branchId}/></div>
  )
}

export default Orders