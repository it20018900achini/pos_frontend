// src/components/roles/RoleList.jsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  useGetRolesQuery,
  useDeleteRoleMutation,
} from "@/Redux Toolkit/features/role/roleApi";
import { useSelector } from "react-redux";

const RoleList = ({ onEdit }) => {
  const {userProfile}=useSelector((state)=>state.user)
 
 const storeId=userProfile?.user?.store?.id
 const { data: roles, isLoading } = useGetRolesQuery({ storeId });  
  const [deleteRole] = useDeleteRoleMutation();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Loading roles...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles & Permissions</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {roles?.length ? (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    {role.id}
                  </TableCell>

                  <TableCell>{role.name}</TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions?.map((p) => (
                        <Badge
                          key={p.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {p.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(role.id)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteRole(role.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-6"
                >
                  No roles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RoleList;
