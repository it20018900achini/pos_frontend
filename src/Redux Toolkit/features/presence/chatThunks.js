import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { addChatMessage } from "./chatSlice";

// Load chat history with a specific user
export const loadChatHistory = createAsyncThunk(
  "chat/loadChatHistory",
  async (userId, { dispatch }) => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await api.get(`/api/chat/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Dispatch each message to store them in chat slice
      res.data.forEach((msg) => {
        dispatch(
          addChatMessage({
            senderId: msg.sender.id,
            receiverId: msg.receiver.id,
            content: msg.content,
            timestamp: new Date(msg.createdAt).getTime(),
          })
        );
      });

      return res.data;
    } catch (err) {
      console.error("Failed to load chat history:", err);
      throw err;
    }
  }
);
