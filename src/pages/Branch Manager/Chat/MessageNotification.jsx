"use client";

import { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import api from "@/utils/api";
import { setUnseenCountByUser } from "@/Redux Toolkit/features/presence/chatSlice";

export default function MessageNotification() {
  const dispatch = useDispatch();
  const me = useSelector((state) => state.user.userProfile, shallowEqual);
  const unseenByUser = useSelector((state) => state.chat.unseenCountByUser, shallowEqual);
  const selectedUser = useSelector((state) => state.chat.selectedUser);

  // Step 1: Fetch unseen count from API on mount
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

  // Step 2: Recalculate total unseen count whenever unseenByUser changes
  const totalUnseen = Object.entries(unseenByUser || {})
    .filter(([userId]) => Number(userId) !== selectedUser?.id) // ignore selected user
    .reduce((sum, [, count]) => sum + count, 0);

  if (!totalUnseen) return null;

  const arrayUnseen = Object.entries(unseenByUser).map(([userId, count]) => ({
    userId: Number(userId),
    count,
  }));

  return (
    <div>
      <pre className="bg-blue-400">{JSON.stringify(arrayUnseen, null, 2)}</pre>
      <span className="relative">
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
          {totalUnseen}
        </span>
      </span>
    </div>
  );
}
