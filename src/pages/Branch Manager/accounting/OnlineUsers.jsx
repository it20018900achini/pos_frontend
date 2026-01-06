"use client";
import React, { useEffect, useState } from "react";
import { connectPresenceSocket, disconnectPresenceSocket } from "@/utils/presenceSocket";

export default function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    const handleSocketMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          setOnlineUsers(data);
        }
      } catch {}
    };

    connectPresenceSocket(jwt, handleSocketMessage);
    return () => disconnectPresenceSocket();
  }, []);

  return (
    <div className="p-2 border rounded bg-white shadow">
      <h3 className="font-bold">Online Users ({onlineUsers.length})</h3>
      <ul className="text-sm">
        {onlineUsers.map((u) => (
          <li key={u.id}>
            {u.fullName || u.email || "Unknown"}
          </li>
        ))}
      </ul>
    </div>
  );
}
