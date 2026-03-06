import React from 'react'
import AssignUserRole from './AssignUserRole'
import UserRoleList from './UserRoleList'
import UserRolesByBranch from './UserRolesByBranch'
import UserRolesByUser from './UserRolesByUser'
import ContentLayout from '../../Dashboard/ContentLayout'

function AllowedBranches() {
  return (
    <ContentLayout title="Allowed Branches">
    <div>
        <AssignUserRole/>
        {/* <hr/>
        <UserRoleList/> */}
        {/* <hr/>
        <UserRolesByBranch/> */}
        <hr/>
        <UserRolesByUser/>
    </div>
    </ContentLayout>
  )
}

export default AllowedBranches