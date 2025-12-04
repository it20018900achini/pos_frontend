import React from 'react'
import RecentRefunds from './RecentRefunds'
import { useSelector } from 'react-redux';

function Refunds() {
  
    const { branch } = useSelector((state) => state.branch);
    const branchId = branch?.id;
  return (
    <div>
<RecentRefunds branchId={branchId} />

    </div>
  )
}

export default Refunds