import { createSlice } from "@reduxjs/toolkit";

/* ---------- HELPERS ---------- */

const calculateUnseenCount = (messagesByUser, myId) => {
  if (!myId) return 0;

  let count = 0;

  Object.values(messagesByUser).forEach(messages => {
    messages.forEach(m => {
      if (!m.seen && m.receiverId === myId) {
        count++;
      }
    });
  });

  return count;
};

/* ---------- STATE ---------- */

const initialState = {
  selectedUser: null,
  messagesByUser: {},     // { userId: Message[] }
  unseenCount: 0,         // ✅ keep for compatibility
    unseenCountByUser: {},  // { senderId: count }

};

/* ---------- SLICE ---------- */

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

  state.messagesByUser[chatUserId].sort((a, b) => a.timestamp - b.timestamp);

  // ✅ global unseen
  state.unseenCount = calculateUnseenCount(state.messagesByUser, myId);

  // ✅ per-user unseen (ONLY if message is incoming + unseen)
  if (!seen && receiverId === myId) {
    state.unseenCountByUser[senderId] =
      (state.unseenCountByUser[senderId] || 0) + 1;
  }
},


    markConversationSeen(state, action) {
  const { userId, myId } = action.payload;
  if (!state.messagesByUser[userId]) return;

  state.messagesByUser[userId].forEach(m => {
    m.seen = true;
  });

  // ✅ reset per-user unseen
  state.unseenCountByUser[userId] = 0;

  state.unseenCount = calculateUnseenCount(state.messagesByUser, myId);
},

    // 🔒 Keep legacy actions (do NOT break old code)
     setUnseenCount: (state, action) => {
    if (action.payload !== undefined) {
      // if payload passed, set it directly (from API)
      state.unseenCount = action.payload;
    } else {
      // recalc from messagesByUser
      let total = 0;
      const meId = state.selectedUser?.id; // get current user
      Object.values(state.messagesByUser).forEach(msgs => {
        total += msgs.filter(m => !m.seen && m.senderId !== meId).length;
      });
      state.unseenCount = total;
    }
  },

    incrementUnseen(state) {
      state.unseenCount += 1;
    },

    resetUnseen(state) {
      state.unseenCount = 0;
    },

    //
    setUnseenCountByUser(state, action) {
  // action.payload = { senderId: count }
  state.unseenCountByUser = action.payload;
},

incrementUnseenByUser(state, action) {
  const senderId = action.payload;
  state.unseenCountByUser[senderId] = (state.unseenCountByUser[senderId] || 0) + 1;
},

resetUnseenForUser(state, action) {
  const userId = action.payload;
  state.unseenCountByUser[userId] = 0;
}
,

    clearChatState() {
      return initialState;
    },
  },
});

/* ---------- EXPORTS ---------- */

export const {
  selectUser,
  addChatMessage,
  markConversationSeen,
  setUnseenCount,
  incrementUnseen,
  resetUnseen,
    setUnseenCountByUser,
    incrementUnseenByUser,
    resetUnseenForUser,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
