import { createSlice } from '@reduxjs/toolkit';
import { login, signup, forgotPassword, resetPassword } from './authThunk';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,

    loading: false,      // login/signup loading
    error: null,         // general error

    forgotPasswordLoading: false,
    forgotPasswordError: null,
    forgotPasswordSuccess: false,

    resetPasswordLoading: false,
    resetPasswordError: null,
    resetPasswordSuccess: false,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("jwt");   // ✅ FIXED
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
      // ✅ SIGNUP
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
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
        state.user = action.payload;
        state.isAuthenticated = true;
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
      });
  },
});

export const {
  logout,
  clearForgotPasswordState,
  clearResetPasswordState,
} = authSlice.actions;

export default authSlice.reducer;
