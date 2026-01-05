"use client";
import React, { useEffect, useState } from "react";
import { connectPresenceSocket, disconnectPresenceSocket } from "@/utils/presenceSocket";

const STORAGE_KEY = "notifications";
const MAX_MESSAGES = 15;

export default function Notifications() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [localIP, setLocalIP] = useState("Fetching IP...");

  // Detect device from userAgent
  const getDevice = () => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) return "iPhone/iPad";
    if (/Android/i.test(ua)) return "Android";
    if (/Windows/i.test(ua)) return "Windows PC";
    if (/Macintosh/i.test(ua)) return "Mac";
    return "Unknown device";
  };
  const device = getDevice();

  // Get public IP from frontend (no backend needed)
  const fetchPublicIP = async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      setLocalIP(data.ip || "Unknown IP");
    } catch {
      setLocalIP("Unknown IP");
    }
  };

  // Get current user ID from JWT
  const currentUserId = (() => {
    try {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) return null;
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      return payload.userId || null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    fetchPublicIP(); // fetch IP on load

    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    let selfJoined = false;

    const handleSocketMessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // ------------------ ONLINE USERS ------------------
        if (Array.isArray(data)) {
          setOnlineUsers(data);

          if (!selfJoined && currentUserId) {
            addNotification(`✅ You joined from ${device} (${localIP})`);
            selfJoined = true;
          }
        } else if (data.event === "userJoined") {
          if (data.user.id !== currentUserId) {
            addNotification(
              `${data.user.fullName || data.user.email} joined from ${device} (${localIP})`
            );
          }

          setOnlineUsers((prev) => {
            if (prev.some((u) => u.id === data.user.id)) return prev;
            return [...prev, data.user];
          });
        } else if (data.event === "userLeft") {
          if (data.user.id !== currentUserId) {
            addNotification(
              `${data.user.fullName || data.user.email} left the system`
            );
          }

          setOnlineUsers((prev) =>
            prev.filter((u) => u.id !== data.user.id)
          );
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
  }, [currentUserId, device, localIP]);

  // Add notification and save last 15 in localStorage
  const addNotification = (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    setNotifications((prev) => {
      const newList = [...prev, { msg, timestamp }];
      const limitedList = newList.slice(-MAX_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedList));
      return limitedList;
    });
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
      <div className="fixed top-2 right-2 w-72 space-y-1 z-50">
        {notifications.map((n, i) => (
          <div
            key={i}
            className="bg-green-200 p-2 rounded shadow text-sm flex justify-between"
          >
            <span>{n.msg}</span>
            <span className="text-gray-600 text-xs ml-2">{n.timestamp}</span>
          </div>
        ))}
      </div>
    </>
  );
}
