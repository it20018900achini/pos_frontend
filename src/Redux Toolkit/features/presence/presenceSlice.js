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
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter((id) => id !== action.payload);
    },
    wsConnected: (state) => {
      state.wsConnected = true;
    },
    wsDisconnected: (state) => {
      state.wsConnected = false;
    },
  },
});

export const { setOnlineUsers, addOnlineUser, removeOnlineUser, wsConnected, wsDisconnected } = presenceSlice.actions;
export default presenceSlice.reducer;
