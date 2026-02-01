"use client";

import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "@/Redux Toolkit/features/presence/chatSlice";
import MessageNotification from "./MessageNotification";

export default function UsersTabs({ handleSelectUser }) {
  const dispatch = useDispatch();

  const usersById = useSelector((s) => s.user.usersById);
  const me = useSelector((s) => s.user.userProfile);
  const selectedUser = useSelector((s) => s.chat.selectedUser);
  const onlineIds = useSelector((s) => s.presence.onlineUsers || []);
  const messagesByUser = useSelector((s) => s.chat.messagesByUser);

  const { onlineUsers, offlineUsers } = useMemo(() => {
    const online = [];
    const offline = [];
    Object.values(usersById).forEach((u) => {
      if (!u || u.id === me?.user.id) return;
      (onlineIds.includes(u.id) ? online : offline).push(u);
    });
    return { onlineUsers: online, offlineUsers: offline };
  }, [usersById, onlineIds, me?.user.id]);

 const getUnseenCount = (userId) => {
  if (selectedUser?.id === userId) return 0; // ✅ reset badge for selected user
  return messagesByUser[userId]?.filter((m) => !m.seen && m.senderId !== me?.user.id).length || 0;
};



  const renderUser = (u, isOnline) => {
    const unseen = getUnseenCount(u.id);

    return (
      <li
        key={u.id}
                onClick={() => handleSelectUser(u)} // ✅ call the prop instead of dispatch directly

        className={`p-2 rounded cursor-pointer flex justify-between items-center
          ${selectedUser?.id === u.id ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"}`}
      >
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`} />
          {u.fullName || u.email}
        </span>

        <div className="flex items-center gap-2">
          {unseen > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 rounded-full">{unseen}</span>
          )}
          <span className={`text-xs ${isOnline ? "text-green-600" : "text-gray-400"}`}>
            {isOnline ? "online" : "offline"}
          </span>
        </div>
      </li>
    );
  };

  return (
    <div>
      <pre>{JSON.stringify(onlineUsers,null,2)}</pre>
         <div className="w-1/3 bg-white border-r p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">{me?.fullName || me?.email}</span>
          <MessageNotification />
        </div>

        
      </div>
    <ul className="space-y-1 overflow-auto">
      {onlineUsers.length > 0 && <p className="text-xs text-gray-500 mt-2 mb-1">ONLINE</p>}
      {onlineUsers.map((u) => renderUser(u, true))}

      {offlineUsers.length > 0 && <p className="text-xs text-gray-500 mt-4 mb-1">OFFLINE</p>}
      {offlineUsers.map((u) => renderUser(u, false))}

      {Object.keys(usersById || {}).length === 0 && (
        <p className="text-sm text-gray-400 text-center mt-4">No users found</p>
      )}
    </ul></div>
  );
}
