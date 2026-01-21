import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: {}, // { [userId]: [{ from, text, timestamp }] }
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChatMessage: (state, action) => {
      const { from, to, text, timestamp } = action.payload;

      // store messages by conversation partner id
      const partnerId = from !== "me" ? from : to;
      if (!state.messages[partnerId]) state.messages[partnerId] = [];

      state.messages[partnerId].push({
        from,
        to,
        text,
        timestamp: timestamp || new Date().toISOString(),
      });
    },
    clearChat: (state) => {
      state.messages = {};
    },
  },
});

export const { addChatMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
