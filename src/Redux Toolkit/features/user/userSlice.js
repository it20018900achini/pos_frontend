import { createSlice } from "@reduxjs/toolkit";
import {
  getUserProfile,
  getCustomers,
  getCashiers,
  getAllUsers,
  getUserById,
  logout,
} from "./userThunks";

/* ---------------- Helpers ---------------- */
const getInitialBranch = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("selectedBranchId");
  }
  return null;
};

/* ---------------- Initial State ---------------- */
const initialState = {
  userProfile: null,
  users: [],
  customers: [],
  cashiers: [],
  usersById: {},
  selectedUser: null,

  selectedBranchId: getInitialBranch(), // Redux + fallback to localStorage

  loading: false,
  error: null,
  initialized: false,
};

/* ---------------- Slice ---------------- */
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.userProfile = null;
      state.selectedUser = null;
      state.users = [];
      state.customers = [];
      state.cashiers = [];
      state.usersById = {};
      state.error = null;
      state.selectedBranchId = null;

      if (typeof window !== "undefined") localStorage.removeItem("selectedBranchId");
    },

    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    setSelectedBranch: (state, action) => {
      state.selectedBranchId = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("selectedBranchId", action.payload);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------------- GET USER PROFILE ---------------- */
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.loading = false;
        state.initialized = true;

        // ✅ Automatically set selectedBranchId if not set
        if (!state.selectedBranchId) {
          const user = action.payload?.user;
          const branchId =
            user?.roleBranchMap?.[0]?.id || user?.defaultBranch?.id || null;

          state.selectedBranchId = branchId;

          if (typeof window !== "undefined" && branchId) {
            localStorage.setItem("selectedBranchId", branchId);
          }
        }
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.userProfile = null;
      })

      /* ---------------- CUSTOMERS & CASHIERS ---------------- */
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.customers = action.payload;
      })
      .addCase(getCashiers.fulfilled, (state, action) => {
        state.cashiers = action.payload;
      })

      /* ---------------- ALL USERS ---------------- */
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.usersById = action.payload.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
      })

      /* ---------------- USER BY ID ---------------- */
      .addCase(getUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })

      /* ---------------- LOGOUT ---------------- */
      .addCase(logout.fulfilled, (state) => {
        state.userProfile = null;
        state.selectedUser = null;
        state.error = null;
        state.selectedBranchId = null;

        if (typeof window !== "undefined") {
          localStorage.removeItem("selectedBranchId");
        }
      })

      /* ---------------- ERROR HANDLING ---------------- */
      .addMatcher(
        (action) => action.type.startsWith("user/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const { clearUserState, selectUser, setSelectedBranch } = userSlice.actions;
export default userSlice.reducer;