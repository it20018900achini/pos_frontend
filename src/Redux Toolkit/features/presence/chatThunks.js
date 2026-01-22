import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { addChatMessage } from "./chatSlice";

/**
 * Load chat history or older messages
 * @param userId - ID of the user we are chatting with
 * @param before - optional timestamp to load messages older than this
 */
export const loadChatHistory = createAsyncThunk(
  "chat/loadChatHistory",
  async ({ userId, before }, { dispatch, getState }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) return { messages: [], hasMore: false };

      // Call API with optional "before" param for infinite scroll
      const res = await api.get(`/api/chat/${userId}`, {
        params: before ? { before, limit: 20 } : { limit: 20 }, // fetch in chunks
        headers: { Authorization: `Bearer ${token}` },
      });

      const myId = getState().user.userProfile?.id;
      if (!myId) return { messages: [], hasMore: false };

      // Map API messages to store-friendly format
      res.data.forEach(msg => {
        dispatch(addChatMessage({
          id: msg.id,
          senderId: msg.sender.id,
          receiverId: msg.receiver.id,
          content: msg.content,
          timestamp: new Date(msg.createdAt).getTime(),
          seen: msg.seen,
          myId,
        }));
      });

      // Determine if there are more messages to load
      const hasMore = res.data.length === 20; // if less than 20, we reached the start

      return { messages: res.data, hasMore };
    } catch (err) {
      console.error("Failed to load chat history:", err);
      throw err;
    }
  }
);
