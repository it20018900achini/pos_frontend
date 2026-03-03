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

    addChatMessage: (state, action) => {
      const msg = {
        ...action.payload,
        // ⚡ normalize content field
        content: action.payload.content ?? action.payload.message ?? "",
      };

      const userId =
        msg.senderId === state.selectedUser?.id
          ? msg.senderId
          : msg.receiverId;

      if (!state.messagesByUser[userId]) state.messagesByUser[userId] = [];

      // Avoid duplicates by clientId
      if (msg.clientId) {
        const exists = state.messagesByUser[userId].some(
          (m) => m.clientId === msg.clientId
        );
        if (exists) return;
      }

      state.messagesByUser[userId].push(msg);

      // ⚡ increment unseen count if not sent by me
      if (msg.senderId !== msg.myId) {
        state.unseenCountByUser[userId] =
          (state.unseenCountByUser[userId] || 0) + 1;
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
      console.log("Calculating unseen count for meId:", meId);
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
  state.unseenCountByUser = action.payload || {};
},

incrementUnseenByUser(state, action) {
  const senderId = action.payload;
  state.unseenCountByUser[senderId] = (state.unseenCountByUser[senderId] || 0) + 1;
},

    resetUnseenForUser(state, action) {
      delete state.unseenCountByUser[action.payload];
    },

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
