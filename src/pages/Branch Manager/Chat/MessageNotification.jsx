"use client";

import { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import api from "@/utils/api";
import { setUnseenCount } from "@/Redux Toolkit/features/presence/chatSlice";

export default function MessageNotification() {
  const dispatch = useDispatch();
  const me = useSelector((state) => state.user.userProfile, shallowEqual);
  const messagesByUser = useSelector(
    (state) => state.chat.messagesByUser,
    shallowEqual
  );
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  const unseen = useSelector((state) => state.chat.unseenCount);

  // Step 1: Fetch unseen count from API on mount
  useEffect(() => {
    if (!me) return;

    const token = localStorage.getItem("jwt");
    if (!token) return;

    api
      .get("/api/chat/unseen/count", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => dispatch(setUnseenCount(res.data)))
      .catch(console.error);
  }, [dispatch, me]);

  // Step 2: Recalculate total unseen count whenever messagesByUser or selectedUser changes
  useEffect(() => {
    if (!messagesByUser) return;

    let total = 0;
    Object.entries(messagesByUser).forEach(([userId, msgs]) => {
      // ignore messages from currently selected user
      if (selectedUser?.id === userId) return;
      total += msgs.filter((m) => !m.seen && m.senderId !== me?.id).length;
    });

    dispatch(setUnseenCount(total));
  }, [dispatch, messagesByUser, selectedUser, me?.id]);

  if (!unseen || unseen === 0) return null;

  return (
    <span className="relative">
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
        {unseen}
      </span>
    </span>
  );
}
