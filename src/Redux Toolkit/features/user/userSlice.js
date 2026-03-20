import { createSlice } from "@reduxjs/toolkit";
import {
  getUserProfile,
  getCustomers,
  getCashiers,
  getAllUsers,
  getUserById,
  logout,
} from "./userThunks";
import { switchBranch } from "../auth/authThunk";

/* ---------------- LocalStorage Helpers ---------------- */

const getStorage = (key) => {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem(key);
  return value === "null" ? null : value;
};

const setStorage = (key, value) => {
  if (typeof window === "undefined") return;

  if (value === null || value === undefined) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, value);
  }
};

/* ---------------- Default Dates ---------------- */

const today = new Date().toISOString().split("T")[0];

const defaultStart = getStorage("startTimeStamp") || today;
const defaultEnd = getStorage("endTimeStamp") || today;

/* ---------------- Initial State ---------------- */

const initialState = {
  userProfile: null,
  users: [],
  customers: [],
  cashiers: [],
  usersById: {},
  selectedUser: null,

  selectedBranchId: getStorage("selectedBranchId"),
    branchLoading: false,   // ✅ ADD THIS


  startTimeStamp: defaultStart,
  endTimeStamp: defaultEnd,

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
      state.startTimeStamp = today;
      state.endTimeStamp = today;

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


.addCase(switchBranch.pending, (state) => {
  state.branchLoading = true;
})

.addCase(switchBranch.fulfilled, (state, action) => {
  state.branchLoading = false;

  const branchId = action.meta.arg;
  state.selectedBranchId = branchId;
  setStorage("selectedBranchId", branchId);

  if (action.payload?.user) {
    state.userProfile = {
      ...state.userProfile,
      user: action.payload.user,
    };
  }
})

.addCase(switchBranch.rejected, (state, action) => {
  state.branchLoading = false;
  state.error = action.payload;
})


      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })

      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.userProfile = action.payload;

        if (!state.selectedBranchId) {
          const user = action.payload?.user;

          const branchId =
            user?.roleBranchMap?.[0]?.id ||
            user?.defaultBranch?.id ||
            null;

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
  setDateRange,
} = userSlice.actions;

export default userSlice.reducer;