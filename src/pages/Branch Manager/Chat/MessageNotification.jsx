"use client";

import { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import api from "@/utils/api";
import { setUnseenCountByUser } from "@/Redux Toolkit/features/presence/chatSlice";
import { Mail } from "lucide-react";

export default function MessageNotification() {
  const dispatch = useDispatch();
  const me = useSelector((state) => state.user.userProfile, shallowEqual);
  const unseenByUser = useSelector((state) => state.chat.unseenCountByUser, shallowEqual);
  const selectedUser = useSelector((state) => state.chat.selectedUser);

  // Fetch unseen counts from API on mount
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

  // Total unseen messages (excluding selected user)
  const totalUnseen = Object.entries(unseenByUser || {})
    .filter(([userId]) => Number(userId) !== selectedUser?.id)
    .reduce((sum, [, count]) => sum + count, 0);

  if (!totalUnseen) return null;

  return (
    <div className="relative bg-white p-2 border border-neutral-800 rounded-sm hover:bg-gray-100 cursor-pointer">
      {/* Chat icon (replace with any icon or SVG you like) */}
      <Mail className="w-5 h-5 text-neutral-800" />

      {/* Badge */}
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
        {totalUnseen}
      </span>
    </div>
  );
}
