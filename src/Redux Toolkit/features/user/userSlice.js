import { createSlice } from "@reduxjs/toolkit";
import {
  getUserProfile,
  getCustomers,
  getCashiers,
  getAllUsers,
  getUserById,
  logout,
} from "./userThunks";

/* ---------------- LocalStorage Helpers ---------------- */

const getStorage = (key) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

const setStorage = (key, value) => {
  if (typeof window !== "undefined") {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  }
};

/* ---------------- Initial State ---------------- */

const initialState = {
  userProfile: null,
  users: [],
  customers: [],
  cashiers: [],
  usersById: {},
  selectedUser: null,

  selectedBranchId: getStorage("selectedBranchId"),
  startTimeStamp: getStorage("startTimeStamp"),
  endTimeStamp: getStorage("endTimeStamp"),

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
      Object.assign(state, {
        userProfile: null,
        selectedUser: null,
        users: [],
        customers: [],
        cashiers: [],
        usersById: {},
        error: null,
        selectedBranchId: null,
        startTimeStamp: null,
        endTimeStamp: null,
      });

      setStorage("selectedBranchId", null);
      setStorage("startTimeStamp", null);
      setStorage("endTimeStamp", null);
    },

    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    setSelectedBranch: (state, action) => {
      state.selectedBranchId = action.payload;
      setStorage("selectedBranchId", action.payload);
    },

    setStartTimeStamp: (state, action) => {
      state.startTimeStamp = action.payload;
      setStorage("startTimeStamp", action.payload);
    },

    setEndTimeStamp: (state, action) => {
      state.endTimeStamp = action.payload;
      setStorage("endTimeStamp", action.payload);
    },

    setDateRange: (state, action) => {
      const { start, end } = action.payload;

      state.startTimeStamp = start;
      state.endTimeStamp = end;

      setStorage("startTimeStamp", start);
      setStorage("endTimeStamp", end);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.loading = false;
        state.initialized = true;

        if (!state.selectedBranchId) {
          const user = action.payload?.user;
          const branchId =
            user?.roleBranchMap?.[0]?.id || user?.defaultBranch?.id || null;

          state.selectedBranchId = branchId;
          setStorage("selectedBranchId", branchId);
        }
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.userProfile = null;
      })

      .addCase(getCustomers.fulfilled, (state, action) => {
        state.customers = action.payload;
      })

      .addCase(getCashiers.fulfilled, (state, action) => {
        state.cashiers = action.payload;
      })

      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;

        state.usersById = action.payload.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
      })

      .addCase(getUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })

      .addCase(logout.fulfilled, (state) => {
        state.userProfile = null;
        state.selectedUser = null;
        state.error = null;
        state.selectedBranchId = null;

        setStorage("selectedBranchId", null);
        setStorage("startTimeStamp", null);
        setStorage("endTimeStamp", null);
      });
  },
});

export const {
  clearUserState,
  selectUser,
  setSelectedBranch,
  setStartTimeStamp,
  setEndTimeStamp,
  setDateRange,
} = userSlice.actions;

export default userSlice.reducer;