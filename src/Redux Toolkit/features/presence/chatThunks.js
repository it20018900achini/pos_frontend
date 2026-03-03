import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api"; // axios instance with baseURL
import {
  addChatMessage,
  markConversationSeen,
  setUnseenCount,
  setUnseenCountByUser,
  resetUnseenForUser
} from "./chatSlice";
// import { resetUnseenForUser } from "./chatSlice";

/* ---------------- CHAT HISTORY ---------------- */

export const loadChatHistory = createAsyncThunk(
  "chat/loadHistory",
  async ({ userId, before }, { dispatch, getState }) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
      const res = await api.get(`/api/chat/${userId}`, {
        params: before ? { before, limit: 15 } : { limit: 15 },
        headers: { Authorization: `Bearer ${token}` },
      });

      const myId = getState().user.userProfile?.user.id;
      console.log("Loading chat history with myId:", myId);
      if (!myId) return;
console.log("Received chat messages:", res.data);
     res.data.forEach((msg, index) => {
  dispatch(
    addChatMessage({
      id: `${msg.senderId}-${msg.timestamp}-${index}`, // generate unique id
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      content: msg.content,
      timestamp: new Date(msg.timestamp).getTime(), // convert ISO string
      seen: true, // backend does not send it
      myId,
    })
  );
});

      return res.data; // useful if component wants to check length
    } catch (err) {
      console.error("Failed to load chat history:", err);
      throw err;
    }
  }
);

/* ---------------- UNSEEN COUNT (RELOAD SAFE) ---------------- */

export const fetchUnseenCount = createAsyncThunk(
  "chat/fetchUnseenCount",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
      const res = await api.get("/api/chat/unseen/count", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assuming backend returns an object like { userId: count, ... }
      dispatch(setUnseenCount(res.data));
    } catch (err) {
      console.error("Failed to fetch unseen counts:", err);
    }
  }
);

/* ---------------- MARK MESSAGES AS SEEN ---------------- */

export const markMessagesAsSeen = createAsyncThunk(
  "chat/markSeen",
  async ({ otherUserId }, { dispatch }) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
      await api.post(`/api/chat/${otherUserId}/seen`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(resetUnseenForUser(otherUserId));
    } catch (err) {
      console.error("Failed to mark messages as seen:", err);
    }
  }
);


export const fetchUnseenCountByUser = createAsyncThunk(
  "chat/fetchUnseenCountByUser",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
      const res = await api.get("/api/chat/unseen/count-per-user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(setUnseenCountByUser(res.data));
    } catch (err) {
      console.error("Failed to fetch unseen counts:", err);
    }
  }
);