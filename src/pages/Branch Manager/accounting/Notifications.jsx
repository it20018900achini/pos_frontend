"use client";
import React, { useEffect, useRef, useState } from "react";
import { connectPresenceSocket, disconnectPresenceSocket } from "@/utils/presenceSocket";
import { useSelector } from "react-redux";

const STORAGE_KEY = "notifications";
const MAX_MESSAGES = 15;

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

  const addNotification = (msg) => {
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

  return (
    <div className="space-y-1">
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
  );
}
