"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import UsersTabs from "./UsersTabs";
import MessageNotification from "./MessageNotification";

import {
  connectPresenceSocket,
  disconnectPresenceSocket,
  connectChatSocket,
  disconnectChatSocket,
  sendChatMessage,
} from "@/Redux Toolkit/features/presence/presenceSocket";

import { getAllUsers } from "@/Redux Toolkit/features/user/userThunks";
import { selectUser, addChatMessage } from "@/Redux Toolkit/features/presence/chatSlice";
import { loadChatHistory, markMessagesAsSeen } from "@/Redux Toolkit/features/presence/chatThunks";
import {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  wsConnected,
  wsDisconnected,
} from "@/Redux Toolkit/features/presence/presenceSlice";
import { markConversationAsSeen } from "@/Redux Toolkit/features/presence/chatApi";

const getToken = () => localStorage.getItem("jwt");

export default function ChatPage() {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);

  /* ================= REDUX ================= */
  const usersById = useSelector((s) => s.user.usersById);
  const me = useSelector((s) => s.user.userProfile);
  const selectedUser = useSelector((s) => s.chat.selectedUser);
  const messagesByUser = useSelector((s) => s.chat.messagesByUser);
  const unseenByUser = useSelector((s) => s.chat.unseenCountByUser || {});
  const wsIsConnected = useSelector((s) => s.presence.wsConnected);

  const messages = messagesByUser[selectedUser?.id] || [];
  const usersLoaded = Object.keys(usersById || {}).length > 0;

  /* ================= LOCAL STATE ================= */
  const [onlineIds, setOnlineIds] = useState([]);
  const [text, setText] = useState("");
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  /* ================= TOTAL UNSEEN ================= */
  const totalUnseen = useMemo(() => {
    return Object.entries(unseenByUser)
      .filter(([userId]) => Number(userId) !== selectedUser?.id)
      .reduce((sum, [, count]) => sum + count, 0);
  }, [unseenByUser, selectedUser]);

  /* ================= USERS ================= */
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  /* ================= PRESENCE SOCKET ================= */
  useEffect(() => {
    if (!me || !usersLoaded) return;
    const token = getToken();
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
  }, [dispatch, me, usersLoaded]);

  /* ================= CHAT SOCKET ================= */
  useEffect(() => {
    if (!me || !wsIsConnected) return;
    const token = getToken();
    if (!token) return;

    const handleChatMessage = (data) => {
      if (data?.type !== "CHAT_MESSAGE") return;

      if (data.senderId === me.id) return; // ignore own messages

      dispatch(addChatMessage({ ...data, myId: me.id }));

      if (selectedUser?.id === data.senderId) {
        dispatch(markMessagesAsSeen({ otherUserId: data.senderId }));
        markConversationAsSeen(data.senderId, token);
      }
    };

    connectChatSocket(token, handleChatMessage);
    return () => disconnectChatSocket();
  }, [dispatch, me, wsIsConnected, selectedUser?.id]);

  /* ================= LOAD OLDER ================= */
  const loadOlderMessages = useCallback(async () => {
    if (!selectedUser || loadingOlder || !hasMore) return;
    const container = scrollRef.current;
    if (!container) return;

    if (container.scrollTop !== 0) return; // Only load when scroll at very top

    setLoadingOlder(true);
    const prevScrollHeight = container.scrollHeight;

    const oldest = messages[0];
    const res = await dispatch(
      loadChatHistory({ userId: selectedUser.id, before: oldest?.timestamp })
    );

    setHasMore(res?.payload?.length === 5);
    setLoadingOlder(false);

    // restore scroll position
    requestAnimationFrame(() => {
      const newScrollHeight = container.scrollHeight;
      container.scrollTop = newScrollHeight - prevScrollHeight;
    });
  }, [dispatch, selectedUser, messages, loadingOlder, hasMore]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = useCallback(async () => {
    if (!text.trim() || !selectedUser || !me) return;

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
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, [dispatch, text, selectedUser, me]);

  /* ================= SELECT USER ================= */
  const handleSelectUser = useCallback(
    async (user) => {
      setIsChatOpen(true);
      dispatch(selectUser(user));

      const res = await dispatch(loadChatHistory({ userId: user.id }));
      setHasMore(res?.payload?.length === 5);

      dispatch(markMessagesAsSeen({ otherUserId: user.id }));
      const token = getToken();
      if (token) markConversationAsSeen(user.id, token);
    },
    [dispatch]
  );

  /* ================= SCROLL TO BOTTOM ================= */
  useEffect(() => {
    if (!isChatOpen || !selectedUser) return;
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, 50);
  }, [isChatOpen, selectedUser, messages.length]);

  /* ================= UI ================= */
  return (
    <>
      {/* FLOATING TOGGLE BUTTON */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center"
        >
          💬
          {totalUnseen > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
              {totalUnseen}
            </span>
          )}
        </button>
      )}

      {/* USERS PANEL */}
     {isChatOpen && (
  <div className="fixed bottom-0 right-0 w-72 h-[70vh] bg-white border shadow-xl z-40 flex flex-col">
    <div className="flex justify-between items-center p-2 border-b">
      <h2 className="font-bold text-sm">Users</h2>
      <button
        onClick={() => setIsChatOpen(false)}
        className="text-gray-400 hover:text-red-500 font-bold"
      >
        ✕
      </button>
    </div>
    <div className="flex-1 overflow-y-auto">
      <UsersTabs handleSelectUser={handleSelectUser} />
    </div>
  </div>
)}{isChatOpen && (
  <div className="fixed bottom-0 right-0 w-72 h-[70vh] bg-white border shadow-xl z-40 flex flex-col">
    <div className="flex justify-between items-center p-2 border-b">
      <h2 className="font-bold text-sm">
        {me?.fullName }<br/>
        <span className="text-neutral-400 text-xs font-semibold">{me?.email}</span>
      </h2>
      <button
        onClick={() => setIsChatOpen(false)}
        className="text-gray-400 hover:text-red-500 font-bold"
      >
        ✕
      </button>
    </div>
    <div className="flex-1 overflow-y-auto">
      <UsersTabs handleSelectUser={handleSelectUser} />
    </div>
  </div>
)}

      {/* CHAT BOX */}
   {/* CHAT BOX ONLY WHEN USER SELECTED */}
{isChatOpen && selectedUser && (
  <div className="fixed bottom-0 right-72 w-96 h-[70vh] z-40 flex flex-col">
    <Card className="h-full flex flex-col shadow-xl">
      {/* HEADER */}
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <CardTitle>{selectedUser.fullName || selectedUser.email}</CardTitle>
        <div className="flex gap-2 items-center">
          {/* <MessageNotification /> */}
          <button
            onClick={() => dispatch(selectUser(null))}
            className="text-gray-400 hover:text-red-500 font-bold"
          >
            ✕
          </button>
        </div>
      </CardHeader>

      {/* MESSAGES */}
      <ScrollArea
        ref={scrollRef}
        className="flex-1 p-4 space-y-2 overflow-y-hidden"
        onScroll={(e) => {
          if (e.currentTarget.scrollTop <= 5) {
            loadOlderMessages();
          }
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
              className={`max-w-xs p-2 rounded text-sm mt-1 ${
                mine
                  ? "ml-auto bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
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
      </ScrollArea>

      {/* INPUT */}
      <div className="flex border-t p-3 gap-2">
        <Input
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </Card>
  </div>
)}

    </>
  );
}
