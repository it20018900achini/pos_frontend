"use client";
import React, { useEffect, useState } from "react";
import { connectPresenceSocket, disconnectPresenceSocket } from "@/utils/presenceSocket";

export default function Notifications() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    const handleSocketMessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // ------------------ ONLINE USERS ------------------
        if (Array.isArray(data)) {
          // Full list of online users
          setOnlineUsers(data);
        } else if (data.event === "userJoined") {
          setOnlineUsers((prev) => {
            if (prev.some((u) => u.id === data.user.id)) return prev;
            return [...prev, data.user];
          });
          addNotification(`${data.user.fullName || data.user.email} joined the system`);
        } else if (data.event === "userLeft") {
          setOnlineUsers((prev) =>
            prev.filter((u) => u.id !== data.user.id)
          );
          addNotification(`${data.user.fullName || data.user.email} left the system`);
        }

        // ------------------ SYSTEM NOTIFICATIONS ------------------
        else if (data.type === "notification") {
          addNotification(data.message);
        }
      } catch (err) {
        console.error("Invalid WebSocket message", event.data);
      }
    };

    connectPresenceSocket(jwt, handleSocketMessage);

    return () => disconnectPresenceSocket();
  }, []);

  // Add a notification and auto-remove after 5s
  const addNotification = (msg) => {
    setNotifications((prev) => [...prev, msg]);
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 5000);
  };

  return (
    <>
      {/* Online Users */}
      <div className="p-2 border rounded mb-2 bg-white shadow">
        <h3 className="font-bold">Online Users ({onlineUsers.length})</h3>
        <ul className="text-sm">
          {onlineUsers.map((user) => (
            <li key={user.id || Math.random()}>
              {user.fullName || user.email || "Unknown"}
            </li>
          ))}
        </ul>
      </div>

      {/* Notifications */}
      <div className="fixed top-2 right-2 w-64 space-y-1 z-50">
        {notifications.map((msg, i) => (
          <div
            key={i}
            className="bg-green-200 p-2 rounded shadow text-sm"
          >
            {msg}
          </div>
        ))}
      </div>
    </>
  );
}
