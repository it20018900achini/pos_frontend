import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedUser: null,
    messagesByUser: {},
  },
  reducers: {
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    addChatMessage: (state, action) => {
      const { senderId } = action.payload;
      if (!state.messagesByUser[senderId]) {
        state.messagesByUser[senderId] = [];
      }
      state.messagesByUser[senderId].push(action.payload);
    },
  },
});

export const { selectUser, addChatMessage } = chatSlice.actions;
export default chatSlice.reducer;
