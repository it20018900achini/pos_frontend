import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api"; // axios instance with baseURL
import {
  addChatMessage,
  markConversationSeen,
  setUnseenCount,
} from "./chatSlice";

/* ---------------- CHAT HISTORY ---------------- */

export const loadChatHistory = createAsyncThunk(
  "chat/loadHistory",
  async ({ userId, before }, { dispatch, getState }) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
      const res = await api.get(`/api/chat/${userId}`, {
        params: before ? { before, limit: 20 } : { limit: 20 },
        headers: { Authorization: `Bearer ${token}` },
      });

      const myId = getState().user.userProfile?.id;
      if (!myId) return;

      res.data.forEach((msg) => {
        dispatch(
          addChatMessage({
            id: msg.id,
            senderId: msg.sender.id,
            receiverId: msg.receiver.id,
            content: msg.content,
            timestamp: new Date(msg.createdAt).getTime(),
            seen: msg.seen,
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
  async ({ otherUserId }, { dispatch, rejectWithValue }) => {
    if (!otherUserId) {
      console.error("❌ markMessagesAsSeen called with invalid userId");
      return rejectWithValue("Invalid otherUserId");
    }

    const token = localStorage.getItem("jwt");
    if (!token) return rejectWithValue("No JWT token");

    try {
      await api.post(
        `/api/chat/${otherUserId}/seen`,
        {}, // empty body
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(markConversationSeen(otherUserId));
    } catch (err) {
      console.error("Failed to mark messages as seen:", err);
      return rejectWithValue(err.message);
    }
  }
);
