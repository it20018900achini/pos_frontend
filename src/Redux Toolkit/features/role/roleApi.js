// src/Redux Toolkit/api/roleApi.js
import { apiSlice } from "@/Redux Toolkit/api/apiSlice";

export const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

   getRoles: builder.query({
  query: ({ storeId }) => `/roles?storeId=${storeId}`,
  providesTags: ["Role"],
    }),
    getRoleById: builder.query({
      query: (id) => `/roles/${id}`,
      providesTags: (result, error, id) => [{ type: "Role", id }],
    }),
    createRole: builder.mutation({
      query: (role) => ({
        url: "/roles",
        method: "POST",
        body: role,
      }),
      invalidatesTags: ["Role"],
    }),
    updateRole: builder.mutation({
      query: ({ id, ...role }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body: role,
      }),
      invalidatesTags: ["Role"],
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Role"],
    }),



    // UserRole endpoints
    
    /* =====================================================
       USER ROLE ENDPOINTS
    ====================================================== */

    // Assign role to user
    assignUserRole: builder.mutation({
      query: (data) => ({
        url: "/user-roles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserRole"],
    }),

    // Get all user-role mappings
    getAllUserRoles: builder.query({
      query: () => "/user-roles",
      providesTags: ["UserRole"],
    }),

    // Get user-role by ID
    getUserRoleById: builder.query({
      query: (id) => `/user-roles/${id}`,
      providesTags: (result, error, id) => [{ type: "UserRole", id }],
    }),

    // Get roles by user (DTO version)
    getUserRolesByUser: builder.query({
      query: (userId) => `/user-roles/user/${userId}`,
      providesTags: ["UserRole"],
    }),

    // Get roles by user & branch
    getUserRolesByUserAndBranch: builder.query({
      query: ({ userId, branchId }) =>
        `/user-roles/user/${userId}/branch/${branchId}`,
      providesTags: ["UserRole"],
    }),

    // Delete user-role mapping
    deleteUserRole: builder.mutation({
      query: (id) => ({
        url: `/user-roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserRole"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,



    // UserRole hooks
  useAssignUserRoleMutation,
  useGetAllUserRolesQuery,
  useGetUserRoleByIdQuery,
  useGetUserRolesByUserQuery,
  useGetUserRolesByUserAndBranchQuery,
  useDeleteUserRoleMutation,
} = roleApi;


