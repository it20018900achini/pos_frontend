"use client";

import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import api from "@/utils/api";
import { setUnseenCountByUser } from "@/Redux Toolkit/features/presence/chatSlice";
import MessageNotification from "./MessageNotification";

export default function CountIconHeader({ handleSelectUser }) {
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
  



  // ------------------ RENDER ------------------
 

  return<MessageNotification />
}
