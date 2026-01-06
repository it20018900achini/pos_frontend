"use client";
import React, { useEffect, useState } from "react";
import { connectPresenceSocket, disconnectPresenceSocket } from "@/utils/presenceSocket";

export default function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setOnlineUsers(data);
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
        <ul className="text-sm space-y-1">
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
