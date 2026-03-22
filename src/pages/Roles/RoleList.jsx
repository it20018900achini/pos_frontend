"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Edit, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  useGetRolesQuery,
  useDeleteRoleMutation,
} from "@/Redux Toolkit/features/role/roleApi";
import ReusableTable from "../common/ReusableTable";


const RoleList = ({ onEdit }) => {
  const { userProfile } = useSelector((state) => state.user);
  const storeId = userProfile?.user?.store?.id;

  const { data: roles, isLoading } = useGetRolesQuery({ storeId });
  const [deleteRole] = useDeleteRoleMutation();

  const [filters, setFilters] = useState({ search: "", status: "" });

  const columns = [
    { header: "ID", accessor: "id", sortable: true },
    { header: "Role Name", accessor: "name", sortable: true },
    { 
      header: "Permissions", 
      accessor: "permissions",
      // Custom render function to handle the array of objects
      render: (permissions) => (
        <div className="flex flex-wrap gap-1 max-w-[450px]">
          {permissions?.map((p) => (
            <Badge 
              key={p.id} 
              variant="secondary" 
              className="text-[10px] px-2 py-0 bg-slate-100 text-slate-600 border-none font-semibold hover:bg-slate-200"
            >
              {p.name}
            </Badge>
          ))}
          {!permissions?.length && <span className="text-xs text-slate-400 italic">No permissions assigned</span>}
        </div>
      )
    },
  ];

  const renderActions = (role) => (
    <div className="flex items-center gap-2">
      <Button 
        size="icon" 
        variant="ghost" 
        className="h-8 w-8 text-blue-600 hover:bg-blue-50" 
        onClick={() => onEdit(role.id)}
      >
        <Edit size={14} />
      </Button>
      <Button 
        size="icon" 
        variant="ghost" 
        className="h-8 w-8 text-destructive hover:bg-red-50" 
        onClick={() => { if(confirm("Delete this role?")) deleteRole(role.id); }}
      >
        <Trash2 size={14} />
      </Button>
    </div>
  );

  return (
    <Card className="border-none shadow-sm  overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
          <ShieldCheck className="h-5 w-5 text-emerald-600" /> Roles & Permissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReusableTable
          columns={columns}
          data={roles || []}
          loading={isLoading}
          isServer={false} // Client-side search
          enableSearch={true}
          filters={filters}
          setFilters={setFilters}
          onFilter={setFilters}
          actions={renderActions}
        />
      </CardContent>
    </Card>
  );
};

export default RoleList;