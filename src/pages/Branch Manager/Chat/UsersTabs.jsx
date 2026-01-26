"use client";

import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "@/utils/api";
import { setUnseenCount } from "@/Redux Toolkit/features/presence/chatSlice";
import MessageNotification from "./MessageNotification";
import { setUnseenCountByUser } from "../../../Redux Toolkit/features/presence/chatSlice";

export default function UsersTabs({ handleSelectUser }) {
  const dispatch = useDispatch();

  // Selectors
  const usersById = useSelector((state) => state.user.usersById);
  const me = useSelector((state) => state.user.userProfile);
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  const onlineIds = useSelector((state) => state.presence.onlineUsers || []);
  const messagesByUser = useSelector((state) => state.chat.messagesByUser);
  const unseenFromStore = useSelector((state) => state.chat.unseenCount);





  // Fetch unseen counts from backend on mount
  useEffect(() => {
    if (!me) return;
    const token = localStorage.getItem("jwt");
    if (!token) return;

    api
      .get("/api/chat/unseen/count-per-user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => dispatch(setUnseenCountByUser(res.data)))
      .catch(console.error);
  }, [dispatch, me]);

  // Recalculate unseen per user based on messagesByUser and selectedUser
  const arrayUnseen = useMemo(() => {
    if (!messagesByUser) return [];

    return Object.entries(messagesByUser)
      .map(([userId, msgs]) => ({
        userId: Number(userId),
        count:
          selectedUser?.id === Number(userId)
            ? 0
            : msgs.filter((m) => !m.seen && m.senderId !== me?.id).length,
      }))
      .filter((u) => u.count > 0);
  }, [messagesByUser, selectedUser, me?.id]);

  // Normalize unseen array for easy lookup
  const unseenByUser = useMemo(() => {
    return arrayUnseen.reduce((acc, { userId, count }) => {
      acc[userId] = count;
      return acc;
    }, {});
  }, [arrayUnseen]);

  // Total unseen messages
  const totalUnseen = useMemo(() => {
    return Object.values(unseenByUser).reduce((sum, n) => sum + n, 0);
  }, [unseenByUser]);

  // Combine user info + online + unseen
  const usersWithMeta = useMemo(() => {
    return Object.values(usersById).map((user) => ({
      ...user,
      online: onlineIds.includes(user.id),
      unseen: unseenByUser[user.id] || 0,
    }));
  }, [usersById, onlineIds, unseenByUser]);

  const onlineUsers = useMemo(
    () => usersWithMeta.filter((u) => u.online),
    [usersWithMeta]
  );

  const offlineUsers = useMemo(
    () => usersWithMeta.filter((u) => !u.online),
    [usersWithMeta]
  );

  // Render a single user row
  const renderUser = (user) => (
    <li
      key={user.id}
      onClick={() => handleSelectUser(user)}
      className={`p-2 rounded cursor-pointer flex justify-between items-center
        ${selectedUser?.id === user.id ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"}`}
    >
      <span className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            user.online ? "bg-green-500" : "bg-gray-400"
          }`}
        />
    <pre>
      {JSON.stringify(arrayUnseen.find(u => u.userId === user.id)?.count || "No", null, 2)}
      </pre> {user?.id}---   {user.fullName || user.email}
      </span>

      <div className="flex items-center gap-2">
        {user.unseen > 0 && (
          <span className="text-xs bg-red-500 text-white px-2 rounded-full">
            {user.unseen}
          </span>
        )}
        <span className={`text-xs ${user.online ? "text-green-600" : "text-gray-400"}`}>
          {user.online ? "online" : "offline"}
        </span>
      </div>
    </li>
  );

  // Nothing to show if no users
  if (!usersWithMeta.length) {
    return <p className="text-sm text-gray-400 text-center mt-4">No users found</p>;
  }

  return (
    <div className="w-1/3 bg-white border-r p-4 flex flex-col">
    <pre>
      {JSON.stringify(arrayUnseen, null, 2)}
      </pre>  

      {/* Header with your info and total unseen */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold">{me?.fullName || me?.email}</span>
        <MessageNotification />
      </div>

      {/* Optional total unseen */}
      {/* {totalUnseen > 0 && (
        <div className="mb-2 text-sm font-semibold text-red-600">
          Total Unseen: {totalUnseen}
        </div>
      )} */}

      {/* Online Users */}
      {onlineUsers.length > 0 && (
        <>
          <p className="text-xs text-gray-500 mt-2 mb-1">ONLINE</p>
          <ul className="space-y-1">{onlineUsers.map(renderUser)}</ul>
        </>
      )}

      {/* Offline Users */}
      {offlineUsers.length > 0 && (
        <>
          <p className="text-xs text-gray-500 mt-4 mb-1">OFFLINE</p>
          <ul className="space-y-1">{offlineUsers.map(renderUser)}</ul>
        </>
      )}
    </div>
  );
}
