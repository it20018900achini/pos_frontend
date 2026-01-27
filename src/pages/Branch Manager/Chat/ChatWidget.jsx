"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import api from "@/utils/api";
import { setUnseenCountByUser } from "@/Redux Toolkit/features/presence/chatSlice";

export default function ChatWidget() {
  const dispatch = useDispatch();
  const me = useSelector((s) => s.user.userProfile, shallowEqual);
  const unseenByUser = useSelector(
    (s) => s.chat.unseenCountByUser || {},
    shallowEqual
  );
  const selectedUser = useSelector((s) => s.chat.selectedUser);

  const [isChatOpen, setIsChatOpen] = useState(false);

  /* ----------------------------------
     Fetch unseen counts on mount
  -----------------------------------*/
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

  /* ----------------------------------
     Calculate total unseen (ignore open chat)
  -----------------------------------*/
  const totalUnseen = useMemo(() => {
    return Object.entries(unseenByUser)
      .filter(([userId]) => Number(userId) !== selectedUser?.id)
      .reduce((sum, [, count]) => sum + count, 0);
  }, [unseenByUser, selectedUser]);

  return (
    <>
      {/* ================= FLOATING CHAT BUTTON ================= */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex items-center justify-center"
        >
          💬
          {totalUnseen > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
              {totalUnseen}
            </span>
          )}
        </button>
      )}

      {/* ================= CHAT WINDOW ================= */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-white rounded-xl shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="font-semibold text-sm">
              {selectedUser
                ? selectedUser.fullName || selectedUser.email
                : "Chat"}
            </span>

            <button
              onClick={() => setIsChatOpen(false)}
              className="text-gray-400 hover:text-red-500 text-lg font-bold"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 text-sm text-gray-500">
            Select a user to start chatting…
          </div>

          {/* Input */}
          <div className="border-t p-2">
            <input
              type="text"
              placeholder="Type a message…"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>
      )}
    </>
  );
}
