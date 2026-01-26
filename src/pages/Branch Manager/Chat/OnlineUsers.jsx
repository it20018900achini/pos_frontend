"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux slice actions
import {
  selectUser,
  addChatMessage,
  resetUnseenForUser,
} from "@/Redux Toolkit/features/presence/chatSlice";

// Async thunks
import { fetchUnseenCountByUser } from "@/Redux Toolkit/features/presence/chatThunks";

// WebSocket helpers
import { connectChatSocket, disconnectChatSocket } from "@/Redux Toolkit/features/presence/chatSocket";

export default function OnlineUsers() {
  const dispatch = useDispatch();

  const usersById = useSelector((state) => state.user.usersById);
  const myId = useSelector((state) => state.user.userProfile?.id);
  const unseenCountByUser = useSelector((state) => state.chat.unseenCountByUser);

  const [onlineIds, setOnlineIds] = useState([]);

  // Fetch unseen counts when component mounts
  useEffect(() => {
    if (myId) dispatch(fetchUnseenCountByUser());
  }, [dispatch, myId]);

  // Connect WebSocket for real-time updates
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    connectChatSocket({
      token,
      onMessage: (data) => {
        if (!data) return;

        switch (data.type) {
          case "ONLINE_USERS":
            if (Array.isArray(data.users)) setOnlineIds(data.users);
            break;

          case "USER_JOINED":
            if (data.user?.id)
              setOnlineIds((prev) =>
                prev.includes(data.user.id) ? prev : [...prev, data.user.id]
              );
            break;

          case "USER_LEFT":
            if (data.user?.id)
              setOnlineIds((prev) => prev.filter((id) => id !== data.user.id));
            break;

          case "NEW_MESSAGE":
            const msg = data.message;
            // Only handle messages sent to me
            if (!msg || msg.receiverId !== myId) break;

            dispatch(
              addChatMessage({
                id: msg.id,
                senderId: msg.senderId,
                receiverId: msg.receiverId,
                content: msg.content,
                timestamp: new Date(msg.timestamp).getTime(),
                seen: false,
                myId,
              })
            );
            break;

          default:
            break;
        }
      },
    });

    return () => disconnectChatSocket();
  }, [dispatch, myId]);

  // Compute online and offline users
  const onlineUsers = onlineIds.map((id) => usersById[id]).filter(Boolean);
  const offlineUsers = Object.values(usersById).filter(
    (u) => u.id !== myId && !onlineIds.includes(u.id)
  );

  // When clicking a user → select + reset unseen
  const handleUserClick = (user) => {
    dispatch(selectUser(user));
    dispatch(resetUnseenForUser(user.id));
  };

  // Render each user with unseen badge
  const renderUser = (user) => (
    <li
      key={user.id}
      className="bg-green-500 cursor-pointer p-1 rounded hover:bg-gray-100 flex justify-between items-center"
      onClick={() => handleUserClick(user)}
    >
      <span>{user.fullName || user.email} ({user.role})</span>
      {unseenCountByUser[user.id] > 0 && (
        <span className="ml-2 text-xs text-white bg-red-500 rounded-full px-2 py-0.5">
          {unseenCountByUser[user.id]}
        </span>
      )}
    </li>
  );

  return (
    <div className="p-2 border rounded bg-white shadow space-y-4">
      {/* Online Users */}
      <div>
        <h3 className="font-bold mb-2">Online Users ({onlineUsers.length})</h3>
        {onlineUsers.length === 0 ? (
          <p className="text-sm text-gray-500">No users online</p>
        ) : (
          <ul className="space-y-1 max-h-64 overflow-auto text-sm">
            {onlineUsers.map(renderUser)}
          </ul>
        )}
      </div>

      {/* Offline Users */}
      <div>
        <h3 className="font-bold mb-2">Offline Users ({offlineUsers.length})</h3>
        {offlineUsers.length === 0 ? (
          <p className="text-sm text-gray-500">No offline users</p>
        ) : (
          <ul className="space-y-1 max-h-64 overflow-auto text-sm">
            {offlineUsers.map(renderUser)}
          </ul>
        )}
      </div>
    </div>
  );
}
