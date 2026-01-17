import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../../Redux Toolkit/features/user/userThunks";

export default function ChatBox({ receiver, socket }) {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userProfile?.id);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messageQueue = useRef([]);
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // 🔹 Load user profile
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) dispatch(getUserProfile(jwt));
  }, [dispatch]);

  // 🔹 Guard render
  if (!userId || !receiver) {
    return (
      <div className="fixed bottom-4 right-4 w-96 p-2 bg-white border rounded shadow-lg text-center text-gray-500">
        Loading chat...
      </div>
    );
  }

  // 🔹 Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 🔹 Incoming socket messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.event === "chatMessage") {
          const { senderId, receiverId } = data.message;

          if (
            (senderId === receiver.id && receiverId === userId) ||
            (senderId === userId && receiverId === receiver.id)
          ) {
            setMessages((prev) => [...prev, data.message]);
          }
        }

        if (data.event === "typing" && data.senderId === receiver.id) {
          setIsTyping(true);
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1500);
        }
      } catch (err) {
        console.error("WebSocket error:", err);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, receiver, userId]);

  // 🔹 Send message
  const handleSend = () => {
    if (!input.trim()) return;

    const payload = {
      event: "chatMessage",
      message: {
        senderId: userId,
        receiverId: receiver.id,
        message: input,
        timestamp: new Date().toISOString(),
      },
    };

    setMessages((prev) => [...prev, payload.message]);
    setInput("");
    sendOrQueue(payload);
  };

  // 🔹 Typing indicator
  const handleTyping = (e) => {
    setInput(e.target.value);

    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          event: "typing",
          senderId: userId,
          receiverId: receiver.id,
        })
      );
    }
  };

  // 🔹 Send or queue
  const sendOrQueue = (payload) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
    } else {
      messageQueue.current.push(payload);
    }
  };

  // 🔹 Retry queued messages
  useEffect(() => {
    if (socket?.readyState === WebSocket.OPEN) {
      while (messageQueue.current.length) {
        socket.send(JSON.stringify(messageQueue.current.shift()));
      }
    }
  }, [socket]);

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed bottom-4 right-4 w-96 p-2 bg-white border rounded shadow-lg flex flex-col">
      <h4 className="font-bold mb-2">
        {receiver.fullName || receiver.email}
      </h4>
{JSON.stringify(receiver)}
      <div className="flex-1 overflow-y-auto border p-2 mb-2 bg-gray-50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`mb-1 ${
              m.senderId === userId ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-3 py-1 rounded ${
                m.senderId === userId ? "bg-blue-100" : "bg-gray-200"
              }`}
            >
              {m.message}
            </div>
            <div className="text-xs text-gray-400">
              {formatTime(m.timestamp)}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="text-sm text-gray-500">
            {receiver.fullName} is typing...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="flex space-x-1">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white px-3 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
