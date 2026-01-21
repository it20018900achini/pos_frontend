"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { connectPresenceSocket, disconnectPresenceSocket } from "@/Redux Toolkit/features/presence/presenceSocket";

import { getAllUsers } from "@/Redux Toolkit/features/user/userThunks";
import { selectUser } from "@/Redux Toolkit/features/presence/chatSlice"; // ✅ still used

export default function OnlineUsers() {
  const dispatch = useDispatch();
  const usersById = useSelector((state) => state.user.usersById);
  const [onlineIds, setOnlineIds] = useState([]);

  // Load all users
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Connect presence socket
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    const handleSocketMessage = (data) => {
      if (data.type === "ONLINE_USERS" && Array.isArray(data.users)) {
        setOnlineIds(data.users);
      }
      if (data.event === "userJoined" && data.user?.id) {
        setOnlineIds((prev) =>
          prev.includes(data.user.id) ? prev : [...prev, data.user.id]
        );
      }
      if (data.event === "userLeft" && data.user?.id) {
        setOnlineIds((prev) => prev.filter((id) => id !== data.user.id));
      }
    };

    connectPresenceSocket(jwt, handleSocketMessage);
    return () => disconnectPresenceSocket();
  }, []);

  // Map online IDs to user objects
  const onlineUsers = onlineIds.map((id) => usersById[id]).filter(Boolean);

  // Click user → select chat
  const handleUserClick = (user) => dispatch(selectUser(user));

  return (
    <div className="p-2 border rounded bg-white shadow space-y-2">
      <h3 className="font-bold">Online Users ({onlineUsers.length})</h3>
      {onlineUsers.length === 0 ? (
        <p className="text-sm text-gray-500">No users online</p>
      ) : (
        <ul className="text-sm space-y-1 max-h-64 overflow-auto">
          {onlineUsers.map((u) => (
            <li
              key={u.id}
              className="cursor-pointer p-1 rounded hover:bg-gray-100"
              onClick={() => handleUserClick(u)}
            >
              {u.fullName || u.email || "Unknown"} ({u.role})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
