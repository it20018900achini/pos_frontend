import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addChatMessage } from "@/Redux Toolkit/features/presence/chatSlice";
import { connectPresenceSocket } from "@/Redux Toolkit/features/presence/presenceSocket";

export default function ChatListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

   const handleMessage = (event) => {
  if (!event?.data) return;

  let data;

  try {
    data = typeof event.data === "string"
      ? JSON.parse(event.data)
      : event.data;
  } catch (err) {
    console.warn("⚠️ WS non-JSON message:", event.data);
    return;
  }

  // ✅ Now safe
  if (data.type === "CHAT_MESSAGE") {
    dispatch(addChatMessage(data));
  }
};

    connectPresenceSocket(jwt, handleMessage);

  }, [dispatch]);

  return null;
}
