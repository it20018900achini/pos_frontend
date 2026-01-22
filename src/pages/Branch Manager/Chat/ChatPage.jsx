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
import { selectUser, addChatMessage, markMessagesAsSeen } from "@/Redux Toolkit/features/presence/chatSlice";
import {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  wsConnected,
  wsDisconnected,
} from "@/Redux Toolkit/features/presence/presenceSlice";
import { loadChatHistory } from "@/Redux Toolkit/features/presence/chatThunks";
import { format } from "date-fns";
import { markConversationAsSeen } from "@/Redux Toolkit/features/presence/chatApi";

export default function ChatPage() {
  const dispatch = useDispatch();
  const usersById = useSelector((s) => s.user.usersById);
  const selectedUser = useSelector((s) => s.chat.selectedUser);
  const messages = useSelector((s) => s.chat.messagesByUser[selectedUser?.id] || []);
  const messagesByUser = useSelector((s) => s.chat.messagesByUser);
  const userProfile = useSelector((s) => s.user.userProfile);
  const wsIsConnected = useSelector((s) => s.presence.wsConnected);

  const [onlineIds, setOnlineIds] = useState([]);
  const [text, setText] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const messagesRef = useRef(null);
  const messagesEndRef = useRef(null);
  const me = userProfile;

  /* ---------------- Load Users ---------------- */
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  /* ---------------- Presence WebSocket ---------------- */
  useEffect(() => {
    if (!userProfile) return;
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const handlePresenceMessage = (data) => {
      if (data?.type === "ONLINE_USERS") {
        setOnlineIds(data.users || []);
        dispatch(setOnlineUsers(data.users || []));
      }
      if (data?.event === "userJoined") dispatch(addOnlineUser(data.user.id));
      if (data?.event === "userLeft") dispatch(removeOnlineUser(data.user.id));
    };

    connectPresenceSocket(token, handlePresenceMessage);
    dispatch(wsConnected());

    return () => {
      disconnectPresenceSocket();
      dispatch(wsDisconnected());
    };
  }, [dispatch, userProfile]);

  /* ---------------- Chat WebSocket ---------------- */
  useEffect(() => {
    if (!userProfile) return;
    const token = localStorage.getItem("jwt");
    if (!token) return;

    connectChatSocket(token, (data) => {
      if (data?.type === "CHAT_MESSAGE") {
        dispatch(addChatMessage({ ...data, myId: userProfile.id }));

        // Mark as seen if chat open
        if (selectedUser?.id === data.senderId) {
          dispatch(markMessagesAsSeen(data.senderId));
          markConversationAsSeen(data.senderId, token);
        }

        const ref = messagesRef.current;
        if (ref && ref.scrollHeight - ref.scrollTop - ref.clientHeight < 100) {
          setTimeout(() => ref.scrollTo({ top: ref.scrollHeight, behavior: "smooth" }), 50);
        }
      }
    });

    return () => disconnectChatSocket();
  }, [dispatch, userProfile, selectedUser]);

  /* ---------------- Load Older Messages ---------------- */
  const loadOlderMessages = async () => {
    if (!selectedUser) return;
    setLoadingOlder(true);
    const oldestMessage = messages[0];
    const res = await dispatch(
      loadChatHistory({ userId: selectedUser.id, before: oldestMessage?.timestamp })
    );
    setHasMore(res.payload?.length === 20);
    setLoadingOlder(false);
    if (messagesRef.current) messagesRef.current.scrollTop = 50;
  };

  const handleScroll = () => {
    if (!messagesRef.current) return;
    const scrollTop = messagesRef.current.scrollTop;
    const scrollHeight = messagesRef.current.scrollHeight;
    const clientHeight = messagesRef.current.clientHeight;

    setShowScrollTop(scrollTop > 200);
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 50);

    if (scrollTop < 50 && !loadingOlder && hasMore && messages.length > 0) {
      loadOlderMessages();
    }
  };

  /* ---------------- Send Message ---------------- */
  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    const tempId = Date.now();
    const payload = {
      id: tempId,
      type: "CHAT_MESSAGE",
      senderId: userProfile.id,
      receiverId: selectedUser.id,
      content: text,
      timestamp: Date.now(),
      myId: userProfile.id,
    };

    dispatch(addChatMessage(payload));

    // ✅ wait for WebSocket to connect before sending
    try {
      await sendChatMessage(payload);
    } catch (err) {
      console.error("Failed to send message via WS:", err);
    }

    setText("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  /* ---------------- Select User ---------------- */
  const handleSelectUser = async (user) => {
    dispatch(selectUser(user));
    const res = await dispatch(loadChatHistory({ userId: user.id }));
    setHasMore(res.payload?.length === 20);

    dispatch(markMessagesAsSeen(user.id));
  };

  const onlineUsers = onlineIds
    .map((id) => usersById[id])
    .filter((u) => u && u.id !== me?.id);

  /* ---------------- UI ---------------- */
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel */}
      <div className="w-1/3 bg-white border-r p-4 flex flex-col">
        {me && (
          <div className="mb-4 p-3 rounded bg-green-100 font-semibold flex items-center justify-between">
            <span>👤 {me.fullName || me.email}</span>
            <span className="text-xs text-gray-500">{me.role}</span>
          </div>
        )}

        <h2 className="font-bold mb-3 text-gray-700">Users Online ({onlineUsers.length})</h2>

        <ul className="space-y-2 overflow-auto flex-1">
          {onlineUsers.length === 0 && <p className="text-sm text-gray-400">No users online</p>}
          {onlineUsers.map((u) => {
            const unseenCount =
              messagesByUser[u.id]?.filter((m) => !m.seen && m.senderId !== me.id).length || 0;
            return (
              <li
                key={u.id}
                onClick={() => handleSelectUser(u)}
                className={`cursor-pointer p-2 rounded flex items-center justify-between hover:bg-gray-100 transition ${
                  selectedUser?.id === u.id ? "bg-blue-100 font-bold" : ""
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{u.fullName || u.email}</span>
                  {unseenCount > 0 && (
                    <span className="text-xs text-white bg-red-500 px-1 rounded-full">
                      {unseenCount}
                    </span>
                  )}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    onlineIds.includes(u.id) ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col p-4 relative">
        {!selectedUser ? (
          <div className="text-gray-500 flex items-center justify-center h-full">
            Select a user to start chatting
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3 border-b pb-2 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg">{selectedUser.fullName || selectedUser.email}</h3>
              <span
                className={`w-3 h-3 rounded-full ${
                  onlineIds.includes(selectedUser.id) ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
            </div>

            <div
              ref={messagesRef}
              onScroll={handleScroll}
              className="flex-1 overflow-auto bg-gray-50 p-3 rounded space-y-2"
            >
              {loadingOlder && (
                <div className="text-center text-xs text-gray-400 animate-pulse">
                  Loading older messages...
                </div>
              )}

              {messages.map((m) => {
                const isMine = m.senderId === me?.id;
                let time = m.timestamp ? new Date(m.timestamp) : null;
                return (
                  <div
                    key={m.id}
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm break-words relative ${
                      isMine ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {m.content}
                    {time && !isNaN(time.getTime()) ? (
                      <span className="text-[10px] absolute bottom-0 right-1 text-gray-100">
                        {format(time, "HH:mm")}
                      </span>
                    ) : (
                      <span className="text-[10px] absolute bottom-0 right-1 text-gray-400">
                        Sending...
                      </span>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll buttons */}
            {showScrollTop && (
              <button
                onClick={() => messagesRef.current.scrollTo({ top: 0, behavior: "smooth" })}
                className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gray-200 px-2 py-1 rounded shadow text-xs hover:bg-gray-300 transition"
              >
                ⬆ Scroll to Top
              </button>
            )}
            {showScrollBottom && (
              <button
                onClick={() =>
                  messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" })
                }
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-200 px-2 py-1 rounded shadow text-xs hover:bg-blue-300 transition"
              >
                ⬇ Scroll to Bottom
              </button>
            )}

            <div className="mt-2 flex">
              <input
                className="flex-1 border p-2 rounded-l focus:outline-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 px-4 text-white rounded-r hover:bg-blue-600 transition"
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
