import React from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout'
import TodayOverview from '../Branch Manager/Dashboard/TodayOverview'
import { useSelector } from 'react-redux';
import { DashboardStats } from '../store/Dashboard';

function Dashboard() {
    const { userProfile } = useSelector((state) => state.user);

  return (
    <div>
      {userProfile?.user?.branch?.id ? <TodayOverview/>:<DashboardStats/>}
      
    </div>
  )
}

export default Dashboard