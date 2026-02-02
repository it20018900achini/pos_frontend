"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import UsersTabs from "./UsersTabs";

import {
  connectPresenceSocket,
  disconnectPresenceSocket,
  connectChatSocket,
  disconnectChatSocket,
  sendChatMessage,
} from "@/Redux Toolkit/features/presence/presenceSocket";

import { getAllUsers } from "@/Redux Toolkit/features/user/userThunks";
import {
  selectUser,
  addChatMessage,
} from "@/Redux Toolkit/features/presence/chatSlice";
import {
  loadChatHistory,
  markMessagesAsSeen,
} from "@/Redux Toolkit/features/presence/chatThunks";
import {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  wsConnected,
  wsDisconnected,
} from "@/Redux Toolkit/features/presence/presenceSlice";
import { markConversationAsSeen } from "@/Redux Toolkit/features/presence/chatApi";

const PAGE_SIZE = 15;
const getToken = () => localStorage.getItem("jwt");

export default function ChatPage() {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const messagesEndRef = useRef(null);

  /* ================= REDUX ================= */
  const usersById = useSelector((s) => s.user.usersById);
  const me = useSelector((s) => s.user.userProfile);
  const selectedUser = useSelector((s) => s.chat.selectedUser);
  const messagesByUser = useSelector((s) => s.chat.messagesByUser);
  const unseenByUser = useSelector((s) => s.chat.unseenCountByUser || {});
  const wsIsConnected = useSelector((s) => s.presence.wsConnected);

  const messages = messagesByUser[selectedUser?.id] || [];
  const usersLoaded = Object.keys(usersById || {}).length > 0;

  /* ================= LOCAL ================= */
  const [text, setText] = useState("");
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);

  /* ================= TOTAL UNSEEN ================= */
  const totalUnseen = useMemo(() => {
    return Object.entries(unseenByUser)
      .filter(([id]) => Number(id) !== selectedUser?.id)
      .reduce((sum, [, count]) => sum + count, 0);
  }, [unseenByUser, selectedUser]);

  /* ================= LOAD USERS ================= */
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  /* ================= PRESENCE SOCKET ================= */
  useEffect(() => {
    if (!me || !usersLoaded) return;

    const token = getToken();
    if (!token) return;

    connectPresenceSocket(token, (data) => {
      if (data?.type === "ONLINE_USERS") {
        dispatch(setOnlineUsers(data.users || []));
      }
      if (data?.event === "userJoined") dispatch(addOnlineUser(data.user.id));
      if (data?.event === "userLeft") dispatch(removeOnlineUser(data.user.id));
    });

    dispatch(wsConnected());
    return () => {
      disconnectPresenceSocket();
      dispatch(wsDisconnected());
    };
  }, [dispatch, me, usersLoaded]);

/* ================= CHAT SOCKET ================= */
useEffect(() => {
  if (!me || !wsIsConnected) return;
  // alert(JSON.stringify(me));
  const token = getToken();
  if (!token) return;

  const handleMessage = (data) => {
    if (data?.type !== "CHAT_MESSAGE") return;

    const userMessages = messagesByUser[data.senderId] || [];

    // ⚡ Ignore messages that were already added locally (clientId match)
    if (data.clientId && userMessages.some((m) => m.clientId === data.clientId)) return;

    dispatch(addChatMessage({ ...data, myId: me?.user.id }));

    if (selectedUser?.id === data.senderId) {
      dispatch(markMessagesAsSeen({ otherUserId: data.senderId }));
      markConversationAsSeen(data.senderId, token);
    }
  };

  connectChatSocket(token, handleMessage);

  return () => {
    disconnectChatSocket();
  };
}, [dispatch, me, wsIsConnected, selectedUser?.id, messagesByUser]);

  /* ================= INITIAL LOAD ================= */
  const handleSelectUser = useCallback(
    
    async (user) => {
    
    // alert(JSON.stringify(user));
      setIsChatOpen(true);
      dispatch(selectUser(user));

      const res = await dispatch(
        loadChatHistory({
          userId: user.id,
          limit: PAGE_SIZE,
        })
      );

      setHasMore(res?.payload?.length === PAGE_SIZE);

      dispatch(markMessagesAsSeen({ otherUserId: user.id }));
      const token = getToken();
      if (token) markConversationAsSeen(user.id, token);

      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      });
    },
    [dispatch]
  );

  /* ================= LOAD OLDER ================= */
  const loadOlderMessages = useCallback(async () => {
    if (!selectedUser || loadingOlder || !hasMore) return;

    const container = scrollRef.current;
    if (!container) return;

    const oldest = messages[0];
    if (!oldest) return;

    setLoadingOlder(true);
    const prevHeight = container.scrollHeight;

    const res = await dispatch(
      loadChatHistory({
        userId: selectedUser.id,
        before: new Date(oldest.timestamp).toISOString(),
        limit: PAGE_SIZE,
      })
    );

    setHasMore(res?.payload?.length === PAGE_SIZE);
    setLoadingOlder(false);

    requestAnimationFrame(() => {
      container.scrollTop =
        container.scrollHeight - prevHeight;
    });
  }, [dispatch, selectedUser, messages, loadingOlder, hasMore]);

  /* ================= SEND ================= */
  const sendMessage = useCallback(async () => {
    if (!text.trim() || !selectedUser || !me) return;

    const clientId = Date.now();
    const payload = {
      clientId,
      type: "CHAT_MESSAGE",
      senderId: me?.user.id,
      receiverId: selectedUser.id,
      content: text,
      timestamp: Date.now(),
      myId: me?.user.id,
    };

    dispatch(addChatMessage(payload));
    await sendChatMessage(payload);
    setText("");

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 30);
  }, [dispatch, text, selectedUser, me]);

  /* ================= UI ================= */
  return (
    <>
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg"
        >
          💬
          {totalUnseen > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-2">
              {totalUnseen}
            </span>
          )}
        </button>
      )}

      {isChatOpen && (
        <>
          <div className="fixed bottom-0 right-0 w-72 h-[70vh] bg-white border z-40">
            <div className="flex justify-between items-center p-3 border-b">
              <h2 className="text-lg font-semibold">Chat Users  {totalUnseen > 0 && (
            <span className="text-white bg-neutral-800 text-xs rounded-full px-2">
              {totalUnseen}
            </span>
          )}</h2>
              <button onClick={() => {
                setIsChatOpen(false);
                dispatch(selectUser(null));
              }}>✖️</button>
            </div>
            <UsersTabs handleSelectUser={handleSelectUser} />
          </div>

          <div className="fixed bottom-0 right-72 w-96 h-[70vh] z-40">
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b">
                <CardTitle>
                  {selectedUser
                    ? selectedUser.fullName || selectedUser.email
                    : "Select a user"}
                </CardTitle>
              </CardHeader>

              {selectedUser ? (
                <>
                  <ScrollArea ref={scrollRef} className="flex-1 p-4 overflow-y-auto">
                    {hasMore && (
                      <div className="text-center mb-2">
                        <Button
                          size="sm"
                          onClick={loadOlderMessages}
                          disabled={loadingOlder}
                        >
                          {loadingOlder ? "Loading..." : "Load more"}
                        </Button>
                      </div>
                    )}
{
  JSON.stringify(messages,null,2)
}
                             {messages.map((m) => {
              const mine = m.senderId === me?.user.id;
              return (
                <div
                  key={m.clientId || m.id}
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

                  <div className="border-t p-3 flex gap-2">
                    <Input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button onClick={sendMessage}>Send</Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Select a user
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </>
  );
}
