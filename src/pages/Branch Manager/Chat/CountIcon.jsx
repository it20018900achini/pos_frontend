"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
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
import { markConversationAsSeen } from "@/Redux Toolkit/features/presence/chatApi";

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

import MessageNotification from "./MessageNotification";
import UsersTabs from "./UsersTabs";
import { setUnseenCount } from "../../../Redux Toolkit/features/presence/chatSlice";
import CountIconHeader from "./CountIconHeader";

/* ================= UTILS ================= */
const getToken = () => localStorage.getItem("jwt");

export default function CountIcon() {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  /* ================= REDUX STATE ================= */
  const usersById = useSelector((s) => s.user.usersById);
  const me = useSelector((s) => s.user.userProfile);
  const selectedUser = useSelector((s) => s.chat.selectedUser);
  const messagesByUser = useSelector((s) => s.chat.messagesByUser);
  const wsIsConnected = useSelector((s) => s.presence.wsConnected);

  const messages = messagesByUser[selectedUser?.id] || [];
  const usersLoaded = Object.keys(usersById || {}).length > 0;

  /* ================= LOCAL STATE ================= */
  const [onlineIds, setOnlineIds] = useState([]);
  const [text, setText] = useState("");
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  /* ================= FETCH USERS ================= */
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
        const ids = data.users || [];
        setOnlineIds(ids);
        dispatch(setOnlineUsers(ids));
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

      dispatch(addChatMessage({ ...data, myId: me?.user.id }));

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
  }, [dispatch, selectedUser, messages, loadingOlder, hasMore]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = useCallback(async () => {
    if (!text.trim() || !selectedUser || !me) return;

    const payload = {
      id: Date.now(),
      type: "CHAT_MESSAGE",
      senderId: me.user?.id,
      receiverId: selectedUser.id,
      content: text,
      timestamp: Date.now(),
      myId: me?.user.id,
    };

    dispatch(addChatMessage(payload));
    await sendChatMessage(payload);

    setText("");
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      50
    );
  }, [dispatch, text, selectedUser, me]);

  /* ================= SELECT USER ================= */
const handleSelectUser = useCallback(async (user) => {
  dispatch(selectUser(user));

  setLoadingMessages(true);
  const res = await dispatch(loadChatHistory({ userId: user.id }));
  setHasMore(res.payload?.length === 20);
  setLoadingMessages(false);

  dispatch(markMessagesAsSeen({ otherUserId: user.id }));

  const token = getToken();
  if (token) markConversationAsSeen(user.id, token);
}, [dispatch]);


  /* ================= ONLINE USERS ================= */
  const onlineUsers = onlineIds
    .map((id) => usersById[id])
    .filter((u) => u && u.id !== me?.user.id);

  /* ================= UI ================= */
  return <CountIconHeader  handleSelectUser={handleSelectUser}  />;
}
