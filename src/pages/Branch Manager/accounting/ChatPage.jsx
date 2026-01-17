import { useEffect, useRef, useState } from "react";
import ChatBox from "./ChatBox";
import {
  connectPresenceSocket,
  disconnectPresenceSocket,
} from "@/utils/presenceSocket";

export default function ChatPage() {
  const [sender, setSender] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const socketRef = useRef(null);

  /* ---------------- Load current user ---------------- */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setSender(JSON.parse(stored));
    } catch {
      console.error("Invalid user in storage");
    }
  }, []);

  /* ---------------- Presence socket ---------------- */
  useEffect(() => {
    if (!sender) return;

    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    const onMessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (Array.isArray(data)) {
          setOnlineUsers(data.filter((u) => u.id !== sender.id));
          return;
        }

        if (data.event === "userJoined" && data.user.id !== sender.id) {
          setOnlineUsers((prev) =>
            prev.some((u) => u.id === data.user.id)
              ? prev
              : [...prev, data.user]
          );
        }

        if (data.event === "userLeft") {
          setOnlineUsers((prev) =>
            prev.filter((u) => u.id !== data.user.id)
          );
        }
      } catch (e) {
        console.error("Socket error", e);
      }
    };

    socketRef.current = connectPresenceSocket(jwt, onMessage);

    return () => {
      disconnectPresenceSocket();
      socketRef.current = null;
    };
  }, [sender]);

  if (!sender) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading user...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Online users */}
      <div className="w-1/4 bg-white border-r p-2">
        <h3 className="font-bold mb-2">
          Online Users ({onlineUsers.length})
        </h3>

        {onlineUsers.map((u) => (
          <div
            key={u.id}
            onClick={() => setSelectedUser(u)}
            className={`p-2 cursor-pointer rounded ${
              selectedUser?.id === u.id
                ? "bg-blue-200"
                : "hover:bg-gray-100"
            }`}
          >
            {u.fullName || u.email}
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex-1 p-2">
        {selectedUser ? (
          <ChatBox
            sender={sender}
            receiver={selectedUser}
            socket={socketRef.current}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a user to chat
          </div>
        )}
      </div>
    </div>
  );
}
