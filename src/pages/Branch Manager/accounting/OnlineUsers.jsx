"use client";
import React, { useEffect, useState } from "react";
import { connectPresenceSocket, disconnectPresenceSocket, sendPresenceMessage } from "@/utils/presenceSocket";
import ChatBox from "./ChatBox";
import ChatPage from "./ChatPage";

export default function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receiver, setReceiver] = useState(null); // selected user to chat

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setLoading(false);
      return;
    }

    const handleSocketMessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // 1️⃣ Initial online users list
        if (Array.isArray(data)) {
          setOnlineUsers(data.filter(u => u && u.id));
          setLoading(false);
          return;
        }

        // 2️⃣ User joined
        if (data.event === "userJoined") {
          setOnlineUsers((prev) =>
            prev.some((u) => u.id === data.user.id)
              ? prev
              : [...prev, data.user]
          );
          return;
        }

        // 3️⃣ User left
        if (data.event === "userLeft") {
          setOnlineUsers((prev) =>
            prev.filter((u) => u.id !== data.user.id)
          );
        }
      } catch (err) {
        console.error("Socket parse error", err);
        setLoading(false);
      }
    };

    connectPresenceSocket(jwt, handleSocketMessage);

    return () => disconnectPresenceSocket();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="p-2 border rounded bg-white shadow text-sm text-gray-500">
  //       Loading online users...
  //     </div>
  //   );
  // }

  return (
    <div className="p-2 border rounded bg-white shadow space-y-2">
      <h3 className="font-bold">Online Users ({onlineUsers.length})</h3>
<ChatPage/>
      {onlineUsers.length === 0 ? (
        <p className="text-sm text-gray-500">No users online</p>
      ) : (
        <ul className="text-sm space-y-1 max-h-64 overflow-auto">
          {onlineUsers.map((u) =>
            u ? (
              <li
                key={u.id}
                onClick={() => setReceiver(u)}
                className={`cursor-pointer p-1 rounded ${
                  receiver?.id === u.id ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
              >
                {u.fullName || u.email || "Unknown"}
              </li>
            ) : null
          )}
        </ul>
      )}

      {receiver && <ChatBox receiver={receiver} />}
    </div>
  );
}
