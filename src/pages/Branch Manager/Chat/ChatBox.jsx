"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addChatMessage } from "@/Redux Toolkit/features/presence/chatSlice";
import { sendPresenceMessage } from "@/Redux Toolkit/features/presence/presenceSocket";

export default function ChatBox({ receiver }) {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  const messages = useSelector((state) => state.chat.messages[receiver.id] || []);

  const handleSend = () => {
    if (!input.trim()) return;

    const payload = {
      type: "CHAT_MESSAGE",
      to: receiver.id,
      from: "me", // mark this as the current user
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    // send via websocket
    sendPresenceMessage(payload);

    // add to local state
    dispatch(addChatMessage(payload));

    setInput("");
  };

  return (
    <div className="border p-2 rounded max-w-sm">
      <h4>Chat with {receiver.fullName || receiver.email}</h4>
      <div className="h-40 overflow-y-auto border p-1 mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.from === "me" ? "text-right" : "text-left"}>
            <span className={`inline-block px-2 py-1 rounded ${
              msg.from === "me" ? "bg-blue-200" : "bg-gray-200"
            }`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border rounded px-2 py-1 w-full"
        placeholder="Type a message..."
      />
      <button onClick={handleSend} className="mt-1 px-2 py-1 bg-blue-500 text-white rounded">
        Send
      </button>
    </div>
  );
}
