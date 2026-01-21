import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedUser: null,        // The user you are currently chatting with
    messagesByUser: {},        // { userId: [message1, message2, ...] }
  },
  reducers: {
    // Select a user to chat with
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    // Add a chat message (sent or received)
    addChatMessage: (state, action) => {
      const { senderId, receiverId, content, timestamp } = action.payload;

      // Determine the "chat key" (the other user's id)
      const chatUserId = senderId === state.selectedUser?.id ? senderId : receiverId;

      if (!state.messagesByUser[chatUserId]) {
        state.messagesByUser[chatUserId] = [];
      }

      // Push the message
      state.messagesByUser[chatUserId].push({
        senderId,
        receiverId,
        content,
        timestamp: timestamp || Date.now(), // optional timestamp
      });
    },
  },
});

export const { selectUser, addChatMessage } = chatSlice.actions;
export default chatSlice.reducer;
