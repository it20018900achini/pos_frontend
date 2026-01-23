import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";

import {
  connectPresenceSocket,
  disconnectPresenceSocket,
  connectChatSocket,
  disconnectChatSocket,
  sendChatMessage,
} from "@/Redux Toolkit/features/presence/presenceSocket";

import { getAllUsers } from "@/Redux Toolkit/features/user/userThunks";
import { loadChatHistory } from "@/Redux Toolkit/features/presence/chatThunks";
import { markConversationAsSeen } from "@/Redux Toolkit/features/presence/chatApi";

import {
  selectUser,
  addChatMessage,
  markMessagesAsSeen,
} from "@/Redux Toolkit/features/presence/chatSlice";

import {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  wsConnected,
  wsDisconnected,
} from "@/Redux Toolkit/features/presence/presenceSlice";
// import { getAllUsers } from "@/Redux Toolkit/features/user/userThunks";

import MessageNotification from "./MessageNotification";
import UsersTabs from "./UsersTabs";

export default function ChatPage() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);

  /* ---------------- Redux State ---------------- */
  const usersById = useSelector((s) => s.user.usersById);
  const userProfile = useSelector((s) => s.user.userProfile);
  const selectedUser = useSelector((s) => s.chat.selectedUser);
  const messagesByUser = useSelector((s) => s.chat.messagesByUser);
  const wsIsConnected = useSelector((s) => s.presence.wsConnected);

  const messages = messagesByUser[selectedUser?.id] || [];
  const usersLoaded = Object.keys(usersById || {}).length > 0;
  const me = userProfile;

  /* ---------------- Local State ---------------- */
  const [onlineIds, setOnlineIds] = useState([]);
  const [text, setText] = useState("");
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const messagesRef = useRef(null);
  const messagesEndRef = useRef(null);

  /* =========================================================
     1️⃣ FETCH ALL USERS FIRST
     ========================================================= */
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  /* =========================================================
     2️⃣ PRESENCE SOCKET (AFTER USERS LOADED)
     ========================================================= */
  useEffect(() => {
    if (!me || !usersLoaded) return;

    const token = localStorage.getItem("jwt");
    if (!token) return;

    const handlePresenceMessage = (data) => {
      if (data?.type === "ONLINE_USERS") {
        setOnlineIds(data.users || []);
        dispatch(setOnlineUsers(data.users || []));
      }

      if (data?.event === "userJoined") {
        dispatch(addOnlineUser(data.user.id));
      }

      if (data?.event === "userLeft") {
        dispatch(removeOnlineUser(data.user.id));
      }
    };

    connectPresenceSocket(token, handlePresenceMessage);
    dispatch(wsConnected());

    return () => {
      disconnectPresenceSocket();
      dispatch(wsDisconnected());
    };
  }, [dispatch, me, usersLoaded]);

  /* =========================================================
     3️⃣ CHAT SOCKET (AFTER PRESENCE CONNECTED)
     ========================================================= */
  useEffect(() => {
    if (!me || !wsIsConnected) return;

    const token = localStorage.getItem("jwt");
    if (!token) return;

    const handleChatMessage = (data) => {
      if (data?.type === "CHAT_MESSAGE") {
        dispatch(addChatMessage({ ...data, myId: me.id }));

        // auto mark seen if chat open
        if (selectedUser?.id === data.senderId) {
          dispatch(markMessagesAsSeen(data.senderId));
          markConversationAsSeen(data.senderId, token);
        }
      }
    };

    connectChatSocket(token, handleChatMessage);
    return () => disconnectChatSocket();
  }, [dispatch, me, wsIsConnected, selectedUser]);

  /* =========================================================
     LOAD OLDER MESSAGES
     ========================================================= */
  const loadOlderMessages = async () => {
    if (!selectedUser || loadingOlder) return;

    setLoadingOlder(true);
    const oldest = messages[0];

    const res = await dispatch(
      loadChatHistory({
        userId: selectedUser.id,
        before: oldest?.timestamp,
      })
    );

    setHasMore(res.payload?.length === 20);
    setLoadingOlder(false);
  };

  /* =========================================================
     SEND MESSAGE
     ========================================================= */
  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    const payload = {
      id: Date.now(),
      type: "CHAT_MESSAGE",
      senderId: me.id,
      receiverId: selectedUser.id,
      content: text,
      timestamp: Date.now(),
      myId: me.id,
    };

    dispatch(addChatMessage(payload));
    await sendChatMessage(payload);

    setText("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  /* =========================================================
     SELECT USER
     ========================================================= */
  const handleSelectUser = async (user) => {
    dispatch(selectUser(user));

    const res = await dispatch(loadChatHistory({ userId: user.id }));
    setHasMore(res.payload?.length === 20);

    const token = localStorage.getItem("jwt");
    dispatch(markMessagesAsSeen(user.id));
    markConversationAsSeen(user.id, token);
  };

  /* =========================================================
     ONLINE USERS
     ========================================================= */
  const onlineUsers = onlineIds
    .map((id) => usersById[id])
    .filter((u) => u && u.id !== me?.id);

  /* =========================================================
     UI
     ========================================================= */



  return (
    <div className="flex h-screen bg-gray-50">
      {/* LEFT PANEL */}
      <UsersTabs/>
      <div className="w-1/3 bg-white border-r p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">{me?.fullName || me?.email}</span>
          <MessageNotification />
        </div>

        <h2 className="font-bold mb-2">Online Users ({onlineUsers.length})</h2>

        <ul className="space-y-2 overflow-auto flex-1">
          {onlineUsers.map((u) => {
            const unseen =
              messagesByUser[u.id]?.filter(
                (m) => !m.seen && m.senderId !== me.id
              ).length || 0;

            return (
              <li
                key={u.id}
                onClick={() => handleSelectUser(u)}
                className={`cursor-pointer p-2 rounded flex justify-between ${
                  selectedUser?.id === u.id ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
              >
                <span>
                  {u.fullName || u.email}
                  {unseen > 0 && (
                    <span className="ml-2 text-xs bg-red-500 text-white px-2 rounded-full">
                      {unseen}
                    </span>
                  )}
                </span>
                <span className="w-2 h-2 rounded-full bg-green-500" />
              </li>
            );
          })}
        </ul>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col p-4">
        {!selectedUser ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a user to start chatting
          </div>
        ) : (
          <>
            <h3 className="font-bold border-b pb-2 mb-2">
              {selectedUser.fullName || selectedUser.email}
            </h3>

            <div
              ref={messagesRef}
              className="flex-1 overflow-auto space-y-2 p-2 bg-gray-100 rounded"
              onScroll={(e) => {
                if (e.target.scrollTop < 50 && hasMore) loadOlderMessages();
              }}
            >
              {loadingOlder && (
                <div className="text-xs text-center text-gray-400">
                  Loading older messages...
                </div>
              )}

              {messages.map((m) => {
                const mine = m.senderId === me.id;
                return (
                  <div
                    key={m.id}
                    className={`max-w-xs p-2 rounded text-sm ${
                      mine
                        ? "ml-auto bg-blue-500 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    {m.content}
                    <div className="text-[10px] opacity-70 text-right">
                      {format(new Date(m.timestamp), "HH:mm")}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="mt-2 flex">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 border p-2 rounded-l"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 rounded-r"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
