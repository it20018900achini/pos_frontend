// src/Redux Toolkit/features/auth/authSelectors.ts

export const selectAuthUser = (state) => state.auth.user || null;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectUserRoles = (state) => state.auth.user?.roles || [];
export const selectUserBranchName = (state) => state.auth.user?.branch?.name || null;
