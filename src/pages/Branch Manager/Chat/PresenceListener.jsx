import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectPresenceSocket, disconnectPresenceSocket } from "@/Redux Toolkit/features/presence/presenceSocket";
import { setOnlineUsers, wsConnected, wsDisconnected } from "@/Redux Toolkit/features/presence/presenceSlice";

export default function PresenceListener() {
  const dispatch = useDispatch();
  const userProfile = useSelector(state => state.user.userProfile);

  useEffect(() => {
    if (!userProfile) return;

    const token = localStorage.getItem("jwt");
    if (!token) return;

    const socket = connectPresenceSocket(token, {
      onOpen: () => dispatch(wsConnected()),
      onMessage: (data) => {
        if (data.type === "ONLINE_USERS") {
          dispatch(setOnlineUsers(data.users));
        }
      },
      onClose: () => dispatch(wsDisconnected()),
      onError: () => dispatch(wsDisconnected()),
    });

    return () => disconnectPresenceSocket();
  }, [dispatch, userProfile]);

  return null;
}
