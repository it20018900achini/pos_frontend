import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedUser: null,
  messagesByUser: {},     // { userId: Message[] }
  unseenCount: 0,         // ✅ GLOBAL unseen badge
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    selectUser(state, action) {
      state.selectedUser = action.payload;
    },

    addChatMessage(state, action) {
      const { id, senderId, receiverId, content, timestamp, myId, seen } =
        action.payload;

      if (!myId) return;

      const chatUserId = senderId === myId ? receiverId : senderId;
      if (!chatUserId) return;

      if (!state.messagesByUser[chatUserId]) {
        state.messagesByUser[chatUserId] = [];
      }

      const exists = state.messagesByUser[chatUserId].some(m => m.id === id);
      if (exists) return;

      state.messagesByUser[chatUserId].push({
        id,
        senderId,
        receiverId,
        content,
        timestamp,
        seen,
      });

      state.messagesByUser[chatUserId].sort(
        (a, b) => a.timestamp - b.timestamp
      );
    },

    markConversationSeen(state, action) {
      const userId = action.payload;
      if (!state.messagesByUser[userId]) return;

      state.messagesByUser[userId].forEach(m => {
        m.seen = true;
      });
    },

    setUnseenCount(state, action) {
      state.unseenCount = action.payload;
    },

    incrementUnseen(state) {
      state.unseenCount += 1;
    },

    resetUnseen(state) {
      state.unseenCount = 0;
    },

    clearChatState() {
      return initialState;
    },
  },
});

export const {
  selectUser,
  addChatMessage,
  markConversationSeen,
  setUnseenCount,
  incrementUnseen,
  resetUnseen,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
