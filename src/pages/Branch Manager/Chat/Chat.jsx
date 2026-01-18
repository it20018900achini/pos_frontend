import { useEffect, useState } from "react";
import { connectPresenceSocket, sendPresenceMessage, disconnectPresenceSocket } from "@/utils/presenceSocket";

export default function Chat({ jwt, user, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!jwt) return;

    const socket = connectPresenceSocket(jwt, (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "MESSAGE" && (data.senderId === receiverId || data.receiverId === receiverId)) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => disconnectPresenceSocket();
  }, [jwt, receiverId]);

  const sendMessage = () => {
    if (!input) return;

    const payload = {
      type: "MESSAGE",
      senderId: user.id,
      receiverId,
      content: input,
    };

    sendPresenceMessage(payload);
    setMessages((prev) => [...prev, payload]);
    setInput("");
  };

  return (
    <div>
      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid gray", padding: "5px" }}>
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.senderId === user.id ? "You" : "Other"}:</b> {m.content}
          </div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
