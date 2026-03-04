// src/pages/userRoles/AssignUserRole.jsx
import React, { useEffect, useState } from "react";
import { useAssignUserRoleMutation } from "@/Redux Toolkit/features/role/roleApi";
import { useDispatch, useSelector } from "react-redux";

import { getAllBranchesByStore } from "@/Redux Toolkit/features/branch/branchThunks";
import { selectBranches } from "@/Redux Toolkit/features/branch/branchSelectors";
// import { selectStore } from "@/Redux Toolkit/features/branch/storeSelectors";

const AssignUserRole = () => {
      const dispatch = useDispatch();
    
  const [assignUserRole, { isLoading }] = useAssignUserRoleMutation();

  
    const branches = useSelector(selectBranches);
      const { userProfile } = useSelector((state) => state.user);
    
  
    /* ✅ Load branches ONLY when store exists */
    useEffect(() => {
       if (!userProfile?.user?.store?.id) return;
  
      dispatch(
        getAllBranchesByStore({
          storeId:userProfile?.user?.store?.id,
          jwt: localStorage.getItem("jwt"),
        })
      );
    }, [dispatch,userProfile]);
  const [form, setForm] = useState({
    userId: "",
    roleId: "",
    branchId: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await assignUserRole({
        user: { id: Number(form.userId) },
        role: { id: Number(form.roleId) },
        branch: { id: Number(form.branchId) },
      }).unwrap();

      alert("Role Assigned Successfully");
      setForm({ userId: "", roleId: "", branchId: "" });
    } catch (err) {
        console.error("Failed to assign role:", err);
      alert("Error assigning role");
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">Assign User Role</h2>
{/* {JSON.stringify(branches)} */}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="User ID"
          value={form.userId}
          onChange={(e) =>
            setForm({ ...form, userId: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Role ID"
          value={form.roleId}
          onChange={(e) =>
            setForm({ ...form, roleId: e.target.value })
          }
        />
        <p className="font-semibold">Select Branch:</p>

{branches?.map((branch) => (
  <div key={branch.id}>
    <input
        type="radio"
        name="branch"
        value={branch.id}
        checked={form.branchId === String(branch.id)}
        onChange={(e) =>
          setForm({ ...form, branchId: e.target.value })
        }   
    />
    <label className="ml-2">{branch.name}</label>
  </div>
))}
        {/* <input
          className="border p-2 w-full"
          placeholder="Branch ID"
          value={form.branchId}
          onChange={(e) =>
            setForm({ ...form, branchId: e.target.value })
          }
        /> */}

        <button
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 w-full"
        >
          {isLoading ? "Assigning..." : "Assign Role"}
        </button>
      </form>
    </div>
  );
};

export default AssignUserRole;