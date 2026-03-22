// store/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { login, signup, forgotPassword, resetPassword, logoutThunk, switchBranch } from "./authThunk";

// Load persisted data from localStorage


const persistedUserRaw = localStorage.getItem("user");
let persistedUser = null;

try {
  if (persistedUserRaw && persistedUserRaw !== "undefined") {
    persistedUser = JSON.parse(persistedUserRaw);
  }
} catch (err) {
  console.warn("Failed to parse persisted user from localStorage:", err);
  persistedUser = null;
}

const persistedToken = localStorage.getItem("jwt");

const initialState = {
  user: persistedUser || null,
  token: persistedToken || null,
isAuthenticated: !!persistedToken, // 🔥 better

  loading: false,
  error: null,

  forgotPasswordLoading: false,
  forgotPasswordError: null,
  forgotPasswordSuccess: false,

  resetPasswordLoading: false,
  resetPasswordError: null,
  resetPasswordSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
    },
    clearForgotPasswordState: (state) => {
      state.forgotPasswordLoading = false;
      state.forgotPasswordError = null;
      state.forgotPasswordSuccess = false;
    },
    clearResetPasswordState: (state) => {
      state.resetPasswordLoading = false;
      state.resetPasswordError = null;
      state.resetPasswordSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder


//  .addCase(switchBranch.pending, (state) => {
//     state.loading = true;
//     state.error = null;
//   })
//   .addCase(switchBranch.fulfilled, (state, action) => {
//   state.user = action.payload.user;
//   state.token = action.payload.jwt;
//   state.selectedBranchId = action.payload.user.selectedBranchId; // auth slice
//   state.isAuthenticated = true;
// })

.addCase(switchBranch.fulfilled, (state, action) => {
  state.token = action.payload.token; // ✅ use token, not jwt
  state.user = action.payload.user;

  localStorage.setItem("jwt", action.payload.token);
  localStorage.setItem("user", JSON.stringify(action.payload.user));
})
  .addCase(switchBranch.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })




      // ✅ SIGNUP
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.jwt;
        state.isAuthenticated = true;

        // Persist
        localStorage.setItem("jwt", action.payload.jwt);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.jwt;
        state.isAuthenticated = true;

        // Persist
        localStorage.setItem("jwt", action.payload.jwt);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordLoading = true;
        state.forgotPasswordError = null;
        state.forgotPasswordSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordError = action.payload;
        state.forgotPasswordSuccess = false;
      })

      // ✅ RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordLoading = true;
        state.resetPasswordError = null;
        state.resetPasswordSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordLoading = false;
        state.resetPasswordSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = action.payload;
        state.resetPasswordSuccess = false;
      })

      // ✅ LOGOUT
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
      });
  },
});

export const { logout, clearForgotPasswordState, clearResetPasswordState } = authSlice.actions;
export default authSlice.reducer;
