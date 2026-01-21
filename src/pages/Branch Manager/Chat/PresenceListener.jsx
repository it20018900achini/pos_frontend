// src/components/PresenceListener.jsx
"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  wsConnected,
  wsDisconnected,
} from "@/Redux Toolkit/features/presence/presenceSlice";
import {
  connectPresenceSocket,
  disconnectPresenceSocket,
} from "@/Redux Toolkit/features/presence/presenceSocket";

export default function PresenceListener() {
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user.userProfile);

  useEffect(() => {
    if (!userProfile) return;

    const token = localStorage.getItem("jwt");
    if (!token) return;

    connectPresenceSocket(token, (data) => {
      if (!data || typeof data !== "object") return;

      if (data.type === "ONLINE_USERS") {
        dispatch(setOnlineUsers(data.users));
      }

      if (data.event === "userJoined" && data.user?.id) {
        dispatch(addOnlineUser(data.user.id));
      }

      if (data.event === "userLeft" && data.user?.id) {
        dispatch(removeOnlineUser(data.user.id));
      }
    });

    dispatch(wsConnected());

    return () => {
      dispatch(wsDisconnected());
      disconnectPresenceSocket();
    };
  }, [dispatch, userProfile]);

  return null;
}
