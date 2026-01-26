import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/utils/api";
import { setUnseenCount } from "@/Redux Toolkit/features/presence/chatSlice";

export default function MessageNotification() {
  const dispatch = useDispatch();
  const me = useSelector(state => state.user.userProfile);
  const unseen = useSelector(state => state.chat.unseenCount);

  useEffect(() => {
    if (!me) return;

    const token = localStorage.getItem("jwt");
    if (!token) return;

    api
      .get("/api/chat/unseen/count", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => dispatch(setUnseenCount(res.data)))
      .catch(console.error);
  }, [dispatch, me]);

  if (!unseen || unseen === 0) return null;

  return (
    <span className="relative">
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
        {unseen}
      </span>
    </span>
  );
}
