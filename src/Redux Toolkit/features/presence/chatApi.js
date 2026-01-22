// src/utils/chatApi.js
import api from "@/utils/api";

export const markConversationAsSeen = async (otherUserId, token) => {
  try {
    await api.post(`/api/chat/${otherUserId}/seen`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error("Failed to mark conversation as seen", err);
  }
};

export const getUnseenCount = async (token) => {
  try {
    const res = await api.get(`/api/chat/unseen/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // number of unseen messages
  } catch (err) {
    console.error("Failed to fetch unseen messages count", err);
    return 0;
  }
};
