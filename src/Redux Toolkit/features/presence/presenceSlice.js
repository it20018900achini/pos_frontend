// src/Redux Toolkit/features/presence/presenceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineUsers: [], // array of user IDs
  wsConnected: false,
};

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
    addOnlineUser: (state, action) => {
      const id = action.payload;
      if (!state.onlineUsers.includes(id)) {
        state.onlineUsers.push(id);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload
      );
    },
    wsConnected: (state) => {
      state.wsConnected = true;
    },
    wsDisconnected: (state) => {
      state.wsConnected = false;
      state.onlineUsers = []; // reset on disconnect
    },
  },
});

export const {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  wsConnected,
  wsDisconnected,
} = presenceSlice.actions;

export default presenceSlice.reducer;
