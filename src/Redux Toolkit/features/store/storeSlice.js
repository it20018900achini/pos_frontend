import { createSlice } from "@reduxjs/toolkit";
import {
  createStore,
  getStoreById,
  getAllStores,
  updateStore,
  deleteStore,
  getStoreByAdmin,
  getStoreByEmployee,
  getStoreEmployees,
  addEmployee,
  moderateStore,
} from "./storeThunks";

const initialState = {
  store: null,
  stores: [],
  employees: [],
  loading: false,
  error: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    clearStoreState: (state) => {
      state.store = null;
      state.employees = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------------- CREATE ---------------- */
      .addCase(createStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload;
        state.stores.push(action.payload);
      })
      .addCase(createStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- GET BY ID ---------------- */
      .addCase(getStoreById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreById.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload;
      })
      .addCase(getStoreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- GET ALL ---------------- */
      .addCase(getAllStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(getAllStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- UPDATE ---------------- */
      .addCase(updateStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload;

        const index = state.stores.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.stores[index] = action.payload;
        }
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- DELETE ---------------- */
      .addCase(deleteStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.loading = false;
        state.store = null;
        state.stores = state.stores.filter(
          (s) => s.id !== action.payload
        );
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- ADMIN / EMPLOYEE ---------------- */
      .addCase(getStoreByAdmin.fulfilled, (state, action) => {
        state.store = action.payload;
      })
      .addCase(getStoreByEmployee.fulfilled, (state, action) => {
        state.store = action.payload;
      })

      /* ---------------- EMPLOYEES ---------------- */
      .addCase(getStoreEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStoreEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(getStoreEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })

      /* ---------------- MODERATION ---------------- */
      .addCase(moderateStore.fulfilled, (state, action) => {
        const updated = action.payload;

        state.store =
          state.store?.id === updated.id ? updated : state.store;

        state.stores = state.stores.map((s) =>
          s.id === updated.id ? updated : s
        );
      });
  },
});

export const { clearStoreState } = storeSlice.actions;
export default storeSlice.reducer;
