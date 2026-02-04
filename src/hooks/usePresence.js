// src/hooks/usePresence.js
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { settings } from "../constant";

export const usePresence = (jwt) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  // WebSocket URL (replace with your backend)
  const WS_URL = `${settings.ws}/ws/presence?token=${jwt}`;

  const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (!lastMessage) return;

    try {
      const data = JSON.parse(lastMessage.data);

      if (data.event === "userJoined") {
        setOnlineUsers((prev) => [...prev, data.user]);
      } else if (data.event === "userLeft") {
        setOnlineUsers((prev) =>
          prev.filter((u) => u.id !== data.user.id)
        );
      } else {
        // Full online list (on initial connection)
        setOnlineUsers(data);
      }
    } catch (err) {
      console.error("Failed to parse WS message:", err);
    }
  }, [lastMessage]);

  return { onlineUsers, readyState, sendMessage };
};
