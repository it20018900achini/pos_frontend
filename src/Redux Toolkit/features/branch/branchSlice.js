import { createSlice } from "@reduxjs/toolkit";
import {
  createBranch,
  getBranchById,
  getAllBranchesByStore,
  updateBranch,
  deleteBranch,
} from "./branchThunks";

const initialState = {
  branch: null,
  branches: [],
  loading: false,
  error: null,
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    clearBranchState: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      /* -------- CREATE -------- */
      .addCase(createBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches.push(action.payload);
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- GET BY ID -------- */
      .addCase(getBranchById.fulfilled, (state, action) => {
        state.branch = action.payload;
      })

      /* -------- GET BY STORE -------- */
      .addCase(getAllBranchesByStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBranchesByStore.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(getAllBranchesByStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- UPDATE -------- */
      .addCase(updateBranch.fulfilled, (state, action) => {
        const index = state.branches.findIndex(
          (b) => b.id === action.payload.id
        );
        if (index !== -1) state.branches[index] = action.payload;
      })

      /* -------- DELETE -------- */
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.branches = state.branches.filter(
          (b) => b.id !== action.payload
        );
      });
  },
});

export const { clearBranchState } = branchSlice.actions;
export default branchSlice.reducer;
