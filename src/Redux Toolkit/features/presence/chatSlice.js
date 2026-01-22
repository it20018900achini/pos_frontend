import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedUser: null,
  messagesByUser: {}, // { userId: [messages] }
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    addChatMessage: (state, action) => {
      const { senderId, receiverId, content, timestamp, myId, id, seen } = action.payload;
      if (!myId) return;

      const chatUserId = senderId === myId ? receiverId : senderId;
      if (!chatUserId) return;

      if (!state.messagesByUser[chatUserId]) state.messagesByUser[chatUserId] = [];

      // avoid duplicates
      if (!state.messagesByUser[chatUserId].some((m) => m.id === id)) {
        state.messagesByUser[chatUserId].push({
          id,
          senderId,
          receiverId,
          content,
          timestamp: timestamp || Date.now(),
          seen: seen || false,
        });
      }

      state.messagesByUser[chatUserId].sort((a, b) => a.timestamp - b.timestamp);
    },

    markMessagesAsSeen: (state, action) => {
      const userId = action.payload;
      if (!state.messagesByUser[userId]) return;
      state.messagesByUser[userId] = state.messagesByUser[userId].map((m) => ({
        ...m,
        seen: true,
      }));
    },

    clearChatState: () => initialState,
  },
});

export const { selectUser, addChatMessage, markMessagesAsSeen, clearChatState } = chatSlice.actions;
export default chatSlice.reducer;
