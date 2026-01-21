import { useEffect, useState } from "react";
import { connectPresenceSocket, disconnectPresenceSocket,  sendPresenceMessage} from "@/Redux Toolkit/features/presence/presenceSocket";

export default function Presence({ jwt, user }) {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!jwt) return;

    const socket = connectPresenceSocket(jwt, (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "ONLINE_USERS") setOnlineUsers(data.users);
      else if (data.type === "USER_JOINED") setOnlineUsers((prev) => [...prev, data.user]);
      else if (data.type === "USER_LEFT") setOnlineUsers((prev) => prev.filter((u) => u.id !== data.user.id));
    });

    // Notify server this user joined
    sendPresenceMessage({ type: "JOIN", userId: user.id });

    return () => {
      sendPresenceMessage({ type: "LEAVE", userId: user.id });
      disconnectPresenceSocket();
    };
  }, [jwt, user]);

  return (
    <div>
      <h2>Online Users</h2>
      <ul>
        {onlineUsers.map((u) => (
          <li key={u.id}>{u.fullName || u.email}</li>
        ))}
      </ul>
    </div>
  );
}
