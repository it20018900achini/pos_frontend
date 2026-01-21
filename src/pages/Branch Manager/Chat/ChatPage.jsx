"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  connectPresenceSocket,
  disconnectPresenceSocket,
  connectChatSocket,
  disconnectChatSocket,
  sendChatMessage,
} from "@/Redux Toolkit/features/presence/presenceSocket";
import { getAllUsers } from "@/Redux Toolkit/features/user/userThunks";
import { selectUser, addChatMessage } from "@/Redux Toolkit/features/presence/chatSlice";
import {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  wsConnected,
  wsDisconnected,
} from "@/Redux Toolkit/features/presence/presenceSlice";

export default function ChatPage() {
  const dispatch = useDispatch();
  const usersById = useSelector((s) => s.user.usersById);
  const selectedUser = useSelector((s) => s.chat.selectedUser);
  const messages = useSelector(
    (s) => s.chat.messagesByUser[selectedUser?.id] || []
  );
  const userProfile = useSelector((s) => s.user.userProfile);
  const wsIsConnected = useSelector((s) => s.presence.wsConnected);
  const [onlineIds, setOnlineIds] = useState([]);
  const messagesEndRef = useRef(null);
  const [text, setText] = useState("");

  // 1️⃣ Load all users
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // 2️⃣ Presence socket: online users
  useEffect(() => {
    if (!userProfile) return;
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const handlePresenceMessage = (data) => {
      if (!data || typeof data !== "object") return;

      if (data.type === "ONLINE_USERS" && Array.isArray(data.users)) {
        setOnlineIds(data.users);
        dispatch(setOnlineUsers(data.users));
      }
      if (data.event === "userJoined" && data.user?.id) {
        setOnlineIds((prev) =>
          prev.includes(data.user.id) ? prev : [...prev, data.user.id]
        );
        dispatch(addOnlineUser(data.user.id));
      }
      if (data.event === "userLeft" && data.user?.id) {
        setOnlineIds((prev) => prev.filter((id) => id !== data.user.id));
        dispatch(removeOnlineUser(data.user.id));
      }
    };

    connectPresenceSocket(token, handlePresenceMessage);
    dispatch(wsConnected());

    return () => {
      disconnectPresenceSocket();
      dispatch(wsDisconnected());
    };
  }, [dispatch, userProfile]);

  // 3️⃣ Chat socket: incoming messages
  useEffect(() => {
    if (!userProfile) return;
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const handleChatMessage = (data) => {
      if (data.type === "CHAT_MESSAGE") {
        dispatch(addChatMessage(data));
      }
    };

    connectChatSocket(token, handleChatMessage);
    return () => disconnectChatSocket();
  }, [dispatch, userProfile]);

  // 4️⃣ Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 5️⃣ Send message (offline fallback)
  const sendMessage = () => {
    if (!text.trim() || !selectedUser) return;

    if (wsIsConnected) {
      sendChatMessage({
        type: "CHAT_MESSAGE",
        receiverId: selectedUser.id,
        content: text,
        senderId: userProfile?.id,
      });
    } else {
      // fallback: store locally in Redux
      dispatch(
        addChatMessage({
          senderId: userProfile?.id,
          receiverId: selectedUser.id,
          content: text,
        })
      );
      console.warn("⚠️ WebSocket offline, message stored locally");
    }

    setText("");
  };

  // 6️⃣ Map online IDs to user objects
  const onlineUsers = onlineIds.map((id) => usersById[id]).filter(Boolean);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left: Online Users */}
      <div className="w-1/3 border-r bg-white p-2">
        <h2 className="font-bold text-lg mb-2">
          Users Online ({onlineUsers.length})
        </h2>
        {onlineUsers.length === 0 ? (
          <p className="text-sm text-gray-500">No users online</p>
        ) : (
          <ul className="text-sm space-y-1 max-h-64 overflow-auto">
            {onlineUsers.map((u) => (
              <li
                key={u.id}
                className={`cursor-pointer p-1 rounded hover:bg-gray-100 ${
                  selectedUser?.id === u.id ? "bg-blue-100 font-bold" : ""
                }`}
                onClick={() => dispatch(selectUser(u))}
              >
                {u.fullName || u.email || "Unknown"} ({u.role})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right: Chat Box */}
      <div className="flex-1 p-2 flex flex-col">
        {!selectedUser ? (
          <div className="border p-2 rounded bg-white shadow text-gray-500">
            Select a user to start chatting
          </div>
        ) : (
          <div className="flex flex-col flex-1 border rounded p-2 bg-white shadow">
            <h4 className="font-bold mb-2">
              Chat with {selectedUser.fullName || selectedUser.email || "Unknown"}
              {!wsIsConnected && (
                <span className="ml-2 text-xs text-red-500">(Offline)</span>
              )}
            </h4>

            <div className="flex-1 overflow-auto border p-2 space-y-1 mb-2 flex flex-col">
              {messages.length === 0 ? (
                <p className="text-sm text-gray-500">No messages yet</p>
              ) : (
                messages.map((m, i) => {
                  const isMine = m.senderId === userProfile?.id;
                  return (
                    <div
                      key={i}
                      className={`p-2 rounded max-w-xs break-words text-sm ${
                        isMine
                          ? "bg-blue-500 text-white self-end ml-auto"
                          : "bg-gray-200 text-gray-800 self-start"
                      }`}
                    >
                      {!isMine && (
                        <div className="text-xs font-semibold mb-1">
                          {selectedUser.fullName || selectedUser.email || "Unknown"}
                        </div>
                      )}
                      {m.content}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <input
              className="border p-1 w-full"
              placeholder={
                wsIsConnected
                  ? "Type a message..."
                  : "Offline, message will save locally"
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
