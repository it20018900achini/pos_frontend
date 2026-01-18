import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineUsers: [],
  wsConnected: false,
};

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    wsConnected: (state) => {
      state.wsConnected = true;
    },
    wsDisconnected: (state) => {
      state.wsConnected = false;
    },
  },
});

export const { setOnlineUsers, wsConnected, wsDisconnected } = presenceSlice.actions;
export default presenceSlice.reducer;
