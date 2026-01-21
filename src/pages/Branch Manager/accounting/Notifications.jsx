"use client";
import React, { useEffect, useRef, useState } from "react";
import { connectPresenceSocket, disconnectPresenceSocket } from "@/Redux Toolkit/features/presence/presenceSocket";
import { useSelector } from "react-redux";

const STORAGE_KEY = "notifications";
const MAX_MESSAGES = 25;

export default function Notifications() {
  const { branchName } = useSelector((state) => ({
    branchName: state.user.userProfile?.branch?.name || "",
  }));

  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [localIP, setLocalIP] = useState(null);
  const seenMessagesRef = useRef(new Set());

  // 🌐 Fetch public IP
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((d) => setLocalIP(d.ip))
      .catch(() => setLocalIP(null));
  }, []);

  // 👤 Decode user ID
  const currentUserId = (() => {
    try {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) return null;
      return JSON.parse(atob(jwt.split(".")[1]))?.userId;
    } catch {
      return null;
    }
  })();

  // 📡 Connect WebSocket for notifications
  useEffect(() => {
    if (!localIP) return;
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    const handleSocketMessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.event === "userJoined" && data.user.id !== currentUserId) {
          addNotification(`${data.user.fullName || data.user.email} joined`);
        }

        if (data.event === "userLeft" && data.user.id !== currentUserId) {
          addNotification(`${data.user.fullName || data.user.email} left`);
        }
      } catch {}
    };

    connectPresenceSocket(jwt, handleSocketMessage);
    return () => disconnectPresenceSocket();
  }, [localIP, currentUserId]);

  // 🧠 Add notification with deduplication
  const addNotification = (msg) => {
    if (!localIP) return;

    const fingerprint = `${msg}-${localIP}-${branchName}`;
    if (seenMessagesRef.current.has(fingerprint)) return;

    seenMessagesRef.current.add(fingerprint);

    const timestamp = new Date().toLocaleTimeString();
    setNotifications((prev) => {
      const updated = [...prev, { msg, timestamp }].slice(-MAX_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // 🧹 Clear all notifications
  const clearNotifications = () => {
    seenMessagesRef.current.clear();
    localStorage.removeItem(STORAGE_KEY);
    setNotifications([]);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-bold text-sm">Notifications</h3>
        <button
          onClick={clearNotifications}
          className="text-xs text-red-500 hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="space-y-1 max-h-80 overflow-y-auto">
        {[...notifications].reverse().map((n, i) => (
          <div
            key={i}
            className="bg-green-200 p-2 rounded shadow text-sm flex justify-between animate-fade-in"
          >
            <span>{n.msg}</span>
            <span className="text-gray-600 text-xs ml-2">{n.timestamp}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
