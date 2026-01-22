import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedUser: null,
  messagesByUser: {}, // Only store in Redux
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Select user
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    // Add message to Redux
    addChatMessage: (state, action) => {
      const { senderId, receiverId, content, timestamp, myId, id, seen } = action.payload;
      if (!myId) return;

      const chatUserId = senderId === myId ? receiverId : senderId;
      if (!chatUserId) return;

      if (!state.messagesByUser[chatUserId]) state.messagesByUser[chatUserId] = [];

      // Avoid duplicates
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

      // Keep messages sorted
      state.messagesByUser[chatUserId].sort((a, b) => a.timestamp - b.timestamp);
    },

    // Mark messages as seen in Redux only
    markMessagesAsSeen: (state, action) => {
      const userId = action.payload;
      if (!userId || !state.messagesByUser[userId]) return;

      state.messagesByUser[userId] = state.messagesByUser[userId].map((m) => ({
        ...m,
        seen: true,
      }));
    },

    clearChatState: () => initialState,
  },
});

export const { selectUser, addChatMessage, clearChatState, markMessagesAsSeen } = chatSlice.actions;
export default chatSlice.reducer;
