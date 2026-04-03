import { createSlice, createSelector } from "@reduxjs/toolkit";

/**
 * Pro Tip: Use a constant for tax rates to make 
 * global changes easier in the future.
 */
const TAX_RATE = 0.00; 

const initialState = {
  items: [],
  selectedCustomer: null,
  note: "",
  discount: { type: "percentage", value: 0 },
  paymentMethod: "CASH",
  heldOrders: [],
  currentOrder: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Advanced: Handles both flat products and nested productVariant objects
    addToCart: (state, action) => {
      const payload = action.payload;
      // Handle the nested structure from your ProductCard
      const product = payload?.productVariant ? payload.productVariant : payload;
      
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...product,
          quantity: 1,
          // Store safe numeric values to avoid calculation errors later
          price: Number(product.sellingPrice || product.price || 0),
        });
      }
    },

    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      
      if (item) {
        const newQty = Math.max(0, quantity);
        if (newQty === 0) {
          state.items = state.items.filter((i) => i.id !== id);
        } else {
          item.quantity = newQty;
        }
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },

    // ✅ Crucial for your Premium UI 'Disconnect' feature
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },

    setNote: (state, action) => {
      state.note = action.payload;
    },

    setDiscount: (state, action) => {
      state.discount = {
        type: action.payload.type || "percentage",
        value: Number(action.payload.value || 0)
      };
    },

    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload?.toUpperCase() || "CASH";
    },
holdOrder: (state) => {
      if (state.items.length > 0) {
        // 1. Push the current cart into held orders
        state.heldOrders.push({
          id: Date.now(),
          items: [...state.items],
          customer: state.selectedCustomer,
          note: state.note,
          discount: { ...state.discount },
          timestamp: new Date().toISOString(),
        });

        // 2. MANUALLY reset the fields instead of returning initialState
        state.items = [];
        state.selectedCustomer = null;
        state.note = "";
        state.discount = { type: "percentage", value: 0 };
        state.paymentMethod = "CASH";
        // Notice: We do NOT return anything here.
      }
    },

    resumeOrder: (state, action) => {
      const order = action.payload;
      
      // 1. Update state with the resumed order data
      state.items = order.items;
      state.selectedCustomer = order.customer;
      state.note = order.note;
      state.discount = order.discount;
      
      // 2. Filter out the resumed order from the held list
      state.heldOrders = state.heldOrders.filter((o) => o.id !== order.id);
      
      // Again: No "return state" or "return { ... }"
    },
    
// Add this specifically
    setCurrentOrder: (state, action) => {
      const order = action.payload;
      state.items = order.items || [];
      state.selectedCustomer = order.selectedCustomer || null;
      state.note = order.note || "";
      state.discount = order.discount || { type: "percentage", value: 0 };
      // If you track order IDs for held orders:
      state.currentOrderId = order.id || null; 
    },
    clearCart: () => initialState,
  },
});

// --- Memoized Selectors (Performance Optimized) ---

export const selectCartItems = (state) => state.cart.items;
export const selectSelectedCustomer = (state) => state.cart.selectedCustomer;
export const selectDiscount = (state) => state.cart.discount;
export const selectHeldOrders = (state) => state.cart.heldOrders;
export const selectNote = (state) => state.cart.note;
export const selectPaymentMethod = (state) => state.cart.paymentMethod;
export const selectCurrentOrder = (state) => state.cart.currentOrder;

export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((count, item) => count + item.quantity, 0)
);

export const selectSubtotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => {
    const price = Number(item.price || item.sellingPrice || 0);
    return total + (price * item.quantity);
  }, 0)
);

export const selectTax = createSelector(
  [selectSubtotal],
  (subtotal) => subtotal * TAX_RATE
);

export const selectDiscountAmount = createSelector(
  [selectSubtotal, selectDiscount],
  (subtotal, discount) => {
    if (discount.type === "percentage") {
      return subtotal * (discount.value / 100);
    }
    return Number(discount.value || 0);
  }
);

export const selectTotal = createSelector(
  [selectSubtotal, selectTax, selectDiscountAmount],
  (subtotal, tax, discountAmount) => {
    const result = subtotal + tax - discountAmount;
    return Math.max(0, result); // Never return negative total
  }
);
// At the bottom of your cartSlice.js
export const {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  resetOrder = clearCart, // Add this alias here
  setSelectedCustomer,
  clearSelectedCustomer,
  setNote,
  setDiscount,
  setPaymentMethod,
  holdOrder,
  resumeOrder,
  setCurrentOrder,
} = cartSlice.actions;

export default cartSlice.reducer;