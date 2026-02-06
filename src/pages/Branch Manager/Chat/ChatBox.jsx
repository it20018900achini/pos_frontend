"use client";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/Redux Toolkit/features/presence/presenceSocket";
import { addChatMessage } from "@/Redux Toolkit/features/presence/chatSlice";

export default function ChatBox() {
  const selectedUser = useSelector((s) => s.chat.selectedUser);
  const messages = useSelector((s) => s.chat.messagesByUser[selectedUser?.id] || []);
  const wsIsConnected = useSelector((s) => s.presence.wsConnected);
  const userProfile = useSelector((s) => s.user.userProfile);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !selectedUser) return;

    if (wsIsConnected) {
      sendChatMessage({
        type: "CHAT_MESSAGE",
        receiverId: selectedUser.id,
        content: text,
        senderId: userProfile?.user.id,
      });
    } else {
      // Fallback: store locally in Redux
      addChatMessage({
        senderId: userProfile?.user.id,
        receiverId: selectedUser.id,
        content: text,
      });
      console.warn("⚠️ WebSocket offline, message stored locally");
    }

    setText("");
  };

  if (!selectedUser) return null;

  return (
    <div className="border p-2 rounded mt-2 bg-white shadow flex flex-col">
      <h4 className="font-bold mb-2">
        Chat with {selectedUser.fullName || selectedUser.email || "Unknown"}
        {!wsIsConnected && <span className="ml-2 text-xs text-red-500">(Offline)</span>}
      </h4>

      <div className="flex-1 overflow-auto border p-2 space-y-1 mb-2 flex flex-col">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500">No messages yet</p>
        ) : (
          messages.map((m, i) => {
            const isMine = m.senderId === userProfile?.user.id;
            return (
              <div
                key={i}
                className={`p-2 rounded max-w-xs break-words text-sm ${
                  isMine
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-gray-200 text-gray-800 self-start"
                }`}
              >
                {!isMine && (
                  <div className="text-xs font-semibold mb-1">
                    {selectedUser.fullName || selectedUser.email || "Unknown"}
                  </div>
                )}
                {m.content}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <input
        className="border p-1 w-full"
        placeholder={
          wsIsConnected
            ? "Type a message..."
            : "Offline, message will save locally"
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
    </div>
  );
}
