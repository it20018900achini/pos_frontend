"use client";
import React, { useEffect, useState } from "react";
import { connectPresenceSocket, disconnectPresenceSocket } from "@/utils/presenceSocket";

export default function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setLoading(false);
      return;
    }

    const handleSocketMessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Full online users list
        if (Array.isArray(data)) {
          setOnlineUsers(data);
          setLoading(false); // ✅ stop loading once data arrives
        }
      } catch {
        setLoading(false);
      }
    };

    connectPresenceSocket(jwt, handleSocketMessage);
    return () => disconnectPresenceSocket();
  }, []);

  if (loading) {
    return (
      <div className="p-2 border rounded bg-white shadow text-sm text-gray-500">
        Loading online users...
      </div>
    );
  }

  return (
    <div className="p-2 border rounded bg-white shadow">
      <h3 className="font-bold">Online Users ({onlineUsers.length})</h3>

      {onlineUsers.length === 0 ? (
        <p className="text-sm text-gray-500">No users online</p>
      ) : (
        <ul className="text-sm">
          {onlineUsers.map((u) => (
            <li key={u.id}>
              {u.fullName || u.email || "Unknown"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
