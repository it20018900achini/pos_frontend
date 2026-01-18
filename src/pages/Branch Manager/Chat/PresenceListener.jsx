import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectPresenceSocket, disconnectPresenceSocket } from "@/utils/presenceSocket";
import { setOnlineUsers, wsConnected, wsDisconnected } from "@/Redux Toolkit/features/presence/presenceSlice";

export default function PresenceListener() {
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user.userProfile);

  useEffect(() => {
    if (!userProfile) return;
  const jwt = localStorage.getItem("jwt");
   

    const socket = connectPresenceSocket(jwt, (data) => {
      if (data.type === "ONLINE_USERS") {
        dispatch(setOnlineUsers(data.users));
      }
    });

    dispatch(wsConnected());

    return () => {
      disconnectPresenceSocket();
      dispatch(wsDisconnected());
    };
  }, [userProfile, dispatch]);

  return null;
}
