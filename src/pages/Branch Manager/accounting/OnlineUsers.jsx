"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { connectPresenceSocket, disconnectPresenceSocket } from "@/utils/presenceSocket";

export default function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const handleSocketMessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Full list
        if (Array.isArray(data)) {
          setOnlineUsers(data.filter((u) => u.id)); // filter out invalid users
        } 
        // Incremental updates
        else if (data.event === "userJoined") {
          setOnlineUsers((prev) => {
            if (prev.some((u) => u.id === data.user.id)) return prev;
            return [...prev, data.user];
          });
        } else if (data.event === "userLeft") {
          setOnlineUsers((prev) => prev.filter((u) => u.id !== data.user.id));
        }
      } catch (err) {
        console.error("Invalid WebSocket message", event.data);
      }
    };

    connectPresenceSocket(token, handleSocketMessage);

    return () => disconnectPresenceSocket(); // Cleanup
  }, []);

  return (
    <div className="mb-4">
      <h3 className="font-semibold">
        Online Users ({onlineUsers.length})
      </h3>
      <ul className="list-disc ml-5">
        {onlineUsers.map((u) => (
          <li key={u.id || u.email}>{u.fullName || u.email}</li>
        ))}
      </ul>
    </div>
  );
}
