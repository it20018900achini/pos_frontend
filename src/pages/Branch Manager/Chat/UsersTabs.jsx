"use client";

import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import api from "@/utils/api";
import { setUnseenCountByUser } from "@/Redux Toolkit/features/presence/chatSlice";
import MessageNotification from "./MessageNotification";

export default function UsersTabs({ handleSelectUser }) {
  const dispatch = useDispatch();

  // ------------------ REDUX SELECTORS ------------------
  const usersById = useSelector((state) => state.user.usersById);
  const me = useSelector((state) => state.user.userProfile);
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  const onlineIds = useSelector((state) => state.presence.onlineUsers || []);
  const unseenByUser = useSelector(
    (state) => state.chat.unseenCountByUser,
    shallowEqual
  );

  // ------------------ FETCH UNSEEN COUNTS ------------------
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

  // ------------------ USERS WITH META ------------------
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

  // ------------------ RENDER SINGLE USER ------------------
  const renderUser = (user) => {
    // Hide badge if selected
    const count = selectedUser?.id === user.id ? 0 : user.unseen;

    return (
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
          {user.fullName || user.email} {me?.id === user.id && `(You)`}
        </span>

        <div className="flex items-center gap-2">
          {count > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 rounded-full">
              {count}
            </span>
          )}
          <span className={`text-xs ${user.online ? "text-green-600" : "text-gray-400"}`}>
            {user.online ? "online" : "offline"}
          </span>
        </div>
      </li>
    );
  };

  // ------------------ RENDER ------------------
  if (!usersWithMeta.length) {
    return <p className="text-sm text-gray-400 text-center mt-4">No users found</p>;
  }

  return (
    <div className="w-full bg-white  p-4 flex flex-col overflow-auto h-full">
      {/* Header with your info and total unseen */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold">{me?.fullName || me?.email}</span>
        <MessageNotification />
      </div>

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
