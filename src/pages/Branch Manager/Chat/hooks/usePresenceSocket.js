import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectPresenceSocket, disconnectPresenceSocket } from "@/Redux Toolkit/features/presence/presenceSocket";
import { userJoined, userLeft } from "@/Redux Toolkit/features/presence/presenceSlice";

export default function usePresenceSocket() {
  const dispatch = useDispatch();

  const jwt = useSelector((state) => state.auth.jwt);
  const initialized = useSelector((state) => state.user.initialized);

  useEffect(() => {
    if (!jwt || !initialized) return;

    const socket = connectPresenceSocket(jwt, (message) => {
      console.log("📡 Presence event:", message);

      switch (message.type) {
        case "USER_JOINED":
          dispatch(userJoined(message.user));
          break;

        case "USER_LEFT":
          dispatch(userLeft(message.userId));
          break;

        default:
          console.warn("Unknown presence event", message);
      }
    });

    return () => {
      disconnectPresenceSocket();
    };
  }, [jwt, initialized, dispatch]);
}
