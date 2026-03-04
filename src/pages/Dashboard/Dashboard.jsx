import React from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout'
import TodayOverview from '../Branch Manager/Dashboard/TodayOverview'
import { useSelector } from 'react-redux';
import { DashboardStats } from '../store/Dashboard';
import GetSelectedBranch from '../../utils/getSelectedBranch';

function Dashboard() {
    const { userProfile,selectedBranchId } = useSelector((state) => state.user);
    const selectedBranch=GetSelectedBranch();

  return (
    <div className='p-4 space-y-4'>
      
      
      {selectedBranchId ? <TodayOverview/>:<DashboardStats/>}
      
    </div>
  )
}

export default Dashboard