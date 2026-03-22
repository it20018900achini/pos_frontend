// src/pages/userRoles/AssignUserRole.jsx

"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useAssignUserRoleMutation } from "@/Redux Toolkit/features/role/roleApi";

import { getAllBranchesByStore } from "@/Redux Toolkit/features/branch/branchThunks";
import { selectBranches } from "@/Redux Toolkit/features/branch/branchSelectors";

const AssignUserRole = ({ userId, roles = [] }) => {
  const dispatch = useDispatch();

  const [assignUserRole, { isLoading }] = useAssignUserRoleMutation();

  const branches = useSelector(selectBranches);
  const { userProfile } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    userId: userId || "",
    roleId: "",
    branchId: "",
  });

  /* Load branches */
  useEffect(() => {
    if (!userProfile?.user?.store?.id) return;

    dispatch(
      getAllBranchesByStore({
        storeId: userProfile.user.store.id,
        jwt: localStorage.getItem("jwt"),
      })
    );
  }, [dispatch, userProfile]);

  /* update userId when employee selected */
  useEffect(() => {
    if (userId) {
      setForm((prev) => ({ ...prev, userId }));
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.roleId || !form.branchId) {
      alert("Please select role and branch");
      return;
    }

    try {
      await assignUserRole({
        user: { id: Number(form.userId) },
        role: { id: Number(form.roleId) },
        branch: { id: Number(form.branchId) },
      }).unwrap();

      alert("Role Assigned Successfully");

      setForm({
        userId,
        roleId: "",
        branchId: "",
      });
    } catch (err) {
      console.error("Assign Role Error:", err);
      alert("Error assigning role");
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ✅ Role Select */}
        <div>
          <p className="font-semibold mb-1">Select Role</p>
          <select
            className="border p-2 w-full rounded"
            value={form.roleId}
            onChange={(e) =>
              setForm({ ...form, roleId: e.target.value })
            }
          >
            <option value="">-- Select Role --</option>

            {roles.length === 0 ? (
              <option disabled>No roles available</option>
            ) : (
              roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* ✅ Branch Selection */}
        <div>
          <p className="font-semibold mb-1">Select Branch</p>

          {branches?.length > 0 ? (
            branches.map((branch) => (
              <div key={branch.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="branch"
                  value={branch.id}
                  checked={form.branchId === String(branch.id)}
                  onChange={(e) =>
                    setForm({ ...form, branchId: e.target.value })
                  }
                />
                <label>{branch.name}</label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No branches available</p>
          )}
        </div>

        {/* ✅ Submit */}
        <button
          disabled={isLoading}
          className="bg-indigo-600 text-white px-4 py-2 w-full rounded"
        >
          {isLoading ? "Assigning..." : "Assign Role"}
        </button>
      </form>
    </div>
  );
};

export default AssignUserRole;