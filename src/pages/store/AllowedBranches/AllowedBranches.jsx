import React from 'react'
import AssignUserRole from './AssignUserRole'
import UserRoleList from './UserRoleList'
import UserRolesByBranch from './UserRolesByBranch'
import UserRolesByUser from './UserRolesByUser'
import ContentLayout from '../../Dashboard/ContentLayout'
import { useSelector } from 'react-redux'

import {
  useGetUserRolesByUserQuery,
  useDeleteUserRoleMutation,
} from "@/Redux Toolkit/features/role/roleApi";
import ReusableTable from '../../common/ReusableTable'
function AllowedBranches() {
  
    const { userProfile } = useSelector(
      (state) => state.user
    );
  const  userId  = userProfile?.user?.id;
  const { data, isLoading } = useGetUserRolesByUserQuery(userId);
  const [deleteUserRole] = useDeleteUserRoleMutation();

  return (
    <ContentLayout loadingSpinner={isLoading} title="Allowed Branches" subTitle={"View and manage your branch access"} >
    <div>
        {/* <AssignUserRole/> */}
        {/* <hr/>
        <UserRoleList/> */}
        {/* <hr/>
        <UserRolesByBranch/> */}
{/* <pre>
  
{
  JSON.stringify(data,null,2)
}
</pre> */}

<ReusableTable
  columns={[
  { header: "Branch Name", accessor: "branchName", sortable: true },
  { header: "role", accessor: "role", sortable: true },
  { header: "permissions", accessor: "permissions" },
]}
// view="list"
  data={data?.map(data => ({
  branchName: data.branchName,
  role: data?.role?.name,
  permissions: <div className='max-w-[400px]  break-words whitespace-normal'>{data?.role?.permissions?.join(", ")}</div>,
}))}
  loading={isLoading}
  isClient={true}               // client-side pagination
  pageSize={10}   
  exportTypes={["excel","csv"]}

  searchFields={["branchName", "role"]} // searchable fields
  actions={(row) => (
    <div className="flex gap-2 justify-end">
     
    <button
                  onClick={() => deleteUserRole(row.id)}
                  className="text-red-600"
                >
                  Remove
                </button>
    </div>
  )}
  enableExport={true}  // optional: enable PDF/Excel/CSV export
/>



        {/* <UserRolesByUser/> */}
    </div>
    </ContentLayout>
  )
}

export default AllowedBranches