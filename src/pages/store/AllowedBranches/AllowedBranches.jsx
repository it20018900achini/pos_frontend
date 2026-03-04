import React from 'react'
import AssignUserRole from './AssignUserRole'
import UserRoleList from './UserRoleList'
import UserRolesByBranch from './UserRolesByBranch'
import UserRolesByUser from './UserRolesByUser'

function AllowedBranches() {
  return (
    <div>
        <AssignUserRole/>
        <hr/>
        <UserRoleList/>
        <hr/>
        <UserRolesByBranch/>
        <hr/>
        <UserRolesByUser/>
    </div>
  )
}

export default AllowedBranches