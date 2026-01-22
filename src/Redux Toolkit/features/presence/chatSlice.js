import { createSlice } from "@reduxjs/toolkit";

const savedMessages = JSON.parse(localStorage.getItem("chatMessages") || "{}");

const initialState = {
  selectedUser: null,
  messagesByUser: savedMessages, // persist messages
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {

    /* ---------------- SELECT USER ---------------- */
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
      if (action.payload?.id) {
        localStorage.setItem("lastChatUserId", action.payload.id.toString());
      }
    },

    /* ---------------- ADD MESSAGE ---------------- */
    addChatMessage: (state, action) => {
      const { senderId, receiverId, content, timestamp, myId, id, seen } = action.payload;
      if (!myId) return;

      const chatUserId = senderId === myId ? receiverId : senderId;
      if (!chatUserId) return;

      if (!state.messagesByUser[chatUserId]) state.messagesByUser[chatUserId] = [];

      // Avoid duplicate messages
      if (!state.messagesByUser[chatUserId].some(m => m.id === id)) {
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

      // Persist messages to localStorage
      localStorage.setItem("chatMessages", JSON.stringify(state.messagesByUser));
    },

    /* ---------------- CLEAR CHAT ---------------- */
    clearChatState: () => initialState,
  },
});

export const { selectUser, addChatMessage, clearChatState } = chatSlice.actions;
export default chatSlice.reducer;
