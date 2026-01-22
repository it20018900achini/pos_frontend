import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedUser: null,        // user currently chatting with
  messagesByUser: {},        // { userId: [messages] }
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {

    /* ---------------- SELECT USER ---------------- */
    selectUser: (state, action) => {
      state.selectedUser = action.payload;

      // 💾 remember last chat
      if (action.payload?.id) {
        localStorage.setItem(
          "lastChatUserId",
          action.payload.id.toString()
        );
      }
    },

    /* ---------------- ADD MESSAGE ---------------- */
    addChatMessage: (state, action) => {
      const {
        senderId,
        receiverId,
        content,
        timestamp,
        myId, // 👈 REQUIRED (current logged-in user id)
      } = action.payload;

      if (!myId) return;

      // 🧠 determine "other user"
      const chatUserId =
        senderId === myId ? receiverId : senderId;

      if (!chatUserId) return;

      if (!state.messagesByUser[chatUserId]) {
        state.messagesByUser[chatUserId] = [];
      }

      state.messagesByUser[chatUserId].push({
        senderId,
        receiverId,
        content,
        timestamp: timestamp || Date.now(),
      });

      // 🔁 keep messages ordered
      state.messagesByUser[chatUserId].sort(
        (a, b) => a.timestamp - b.timestamp
      );
    },

    /* ---------------- CLEAR CHAT ---------------- */
    clearChatState: () => initialState,
  },
});

export const {
  selectUser,
  addChatMessage,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
