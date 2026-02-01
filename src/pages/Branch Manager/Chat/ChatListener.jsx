import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addChatMessage } from "@/Redux Toolkit/features/presence/chatSlice";
import { connectChatSocket, disconnectChatSocket } from "@/Redux Toolkit/features/presence/chatSocket";

export default function ChatListener() {
  const dispatch = useDispatch();
  const me = useSelector(s => s.user.userProfile);

  useEffect(() => {
    if (!me) return;

    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    const handleMessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      if (data.type === "CHAT_MESSAGE") {
        dispatch(addChatMessage({
          ...data,
          myId: me?.user.id,
        }));
      }
    };

    connectChatSocket(jwt, handleMessage);
    return () => disconnectChatSocket();
  }, [dispatch, me]);

  return null;
}
