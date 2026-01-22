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
import { loadChatHistory } from "@/Redux Toolkit/features/presence/chatThunks";

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
  const [text, setText] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const messagesRef = useRef(null);
  const messagesEndRef = useRef(null);

  /* ---------------- LOAD USERS ---------------- */
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  /* -------- RESTORE LAST CHAT AFTER REFRESH -------- */
  useEffect(() => {
    if (!usersById || !userProfile) return;

    const lastChatUserId = localStorage.getItem("lastChatUserId");
    if (!lastChatUserId) return;

    const lastUser = usersById[lastChatUserId];
    if (lastUser && lastUser.id !== userProfile.id) {
      dispatch(selectUser(lastUser));
    }
  }, [usersById, userProfile, dispatch]);

  /* ---------------- PRESENCE SOCKET ---------------- */
  useEffect(() => {
    if (!userProfile) return;

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
  }, [dispatch, userProfile]);

  /* ---------------- CHAT SOCKET ---------------- */
  useEffect(() => {
    if (!userProfile) return;

    const token = localStorage.getItem("jwt");
    if (!token) return;

    connectChatSocket(token, (data) => {
      if (data?.type === "CHAT_MESSAGE") {
        dispatch(addChatMessage({ ...data, myId: userProfile.id }));
      }
    });

    return () => disconnectChatSocket();
  }, [dispatch, userProfile]);

  /* -------- LOAD CHAT HISTORY WHEN USER SELECTED -------- */
  useEffect(() => {
    if (!selectedUser) return;
    dispatch(loadChatHistory(selectedUser.id));
  }, [dispatch, selectedUser]);

  /* -------- AUTO SCROLL TO BOTTOM -------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------- SCROLL TOP BUTTON -------- */
  const handleScroll = () => {
    if (!messagesRef.current) return;
    setShowScrollTop(messagesRef.current.scrollTop > 200);
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = () => {
    if (!text.trim() || !selectedUser) return;

    const payload = {
      type: "CHAT_MESSAGE",
      senderId: userProfile.id,
      receiverId: selectedUser.id,
      content: text,
      timestamp: Date.now(),
    };

    if (wsIsConnected) {
      sendChatMessage(payload);
    } else {
      dispatch(addChatMessage({ ...payload, myId: userProfile.id }));
    }

    setText("");
  };

  /* ---------------- USERS FILTER ---------------- */
  const me = userProfile;
  const onlineUsers = onlineIds
    .map((id) => usersById[id])
    .filter((u) => u && u.id !== me?.id);

  /* ======================= UI ======================= */
  return (
    <div className="flex h-screen bg-gray-100">

      {/* ---------- LEFT PANEL ---------- */}
      <div className="w-1/3 bg-white border-r p-3">

        {/* ME */}
        {me && (
          <div className="mb-4 p-2 rounded bg-green-100 font-semibold">
            👤 You: {me.fullName || me.email}
          </div>
        )}

        <h2 className="font-bold mb-2">
          Users Online ({onlineUsers.length})
        </h2>

        {onlineUsers.length === 0 ? (
          <p className="text-sm text-gray-500">No users online</p>
        ) : (
          <ul className="space-y-1">
            {onlineUsers.map((u) => (
              <li
                key={u.id}
                onClick={() => dispatch(selectUser(u))}
                className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${
                  selectedUser?.id === u.id
                    ? "bg-blue-100 font-bold"
                    : ""
                }`}
              >
                {u.fullName || u.email} ({u.role})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---------- RIGHT PANEL ---------- */}
      <div className="flex-1 flex flex-col p-3">

        {!selectedUser ? (
          <div className="text-gray-500">
            Select a user to start chatting
          </div>
        ) : (
          <>
            <h3 className="font-bold mb-2">
              Chat with {selectedUser.fullName || selectedUser.email}
            </h3>

            <div
              ref={messagesRef}
              onScroll={handleScroll}
              className="flex-1 overflow-auto border rounded p-2 bg-white space-y-1"
            >
              {messages.map((m, i) => {
                const isMine = m.senderId === me?.id;
                return (
                  <div
                    key={i}
                    className={`max-w-xs p-2 rounded text-sm ${
                      isMine
                        ? "bg-blue-500 text-white ml-auto"
                        : "bg-gray-200"
                    }`}
                  >
                    {m.content}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {showScrollTop && (
              <button
                onClick={() =>
                  messagesRef.current.scrollTo({ top: 0, behavior: "smooth" })
                }
                className="text-xs text-blue-500 mt-1"
              >
                ⬆ Scroll to top
              </button>
            )}

            <input
              className="border p-2 mt-2 rounded"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
          </>
        )}
      </div>
    </div>
  );
}
