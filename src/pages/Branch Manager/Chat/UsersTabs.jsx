import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/Redux Toolkit/features/user/userThunks";
import { selectUser } from "@/Redux Toolkit/features/user/userSlice";

export default function UsersList() {
  const dispatch = useDispatch();

  const users = useSelector((s) => s.user.users);
  const me = useSelector((s) => s.user.userProfile);
  const selectedUser = useSelector((s) => s.user.selectedUser);

  const onlineIds = useSelector((s) => s.presence.onlineUsers || []);
  const messagesByUser = useSelector((s) => s.chat.messagesByUser);

  /* Load users once */
  useEffect(() => {
    if (!users.length) {
      dispatch(getAllUsers());
    }
  }, [dispatch, users.length]);

  /* Group users: online first, then offline */
  const { onlineUsers, offlineUsers } = useMemo(() => {
    const online = [];
    const offline = [];

    users.forEach((u) => {
      if (u.id === me?.id) return;

      if (onlineIds.includes(u.id)) {
        online.push(u);
      } else {
        offline.push(u);
      }
    });

    return { onlineUsers: online, offlineUsers: offline };
  }, [users, onlineIds, me?.id]);

  /* Helper: unseen count */
  const getUnseenCount = (userId) =>
    messagesByUser[userId]?.filter(
      (m) => !m.seen && m.senderId !== me?.id
    ).length || 0;

  /* Render user row */
  const renderUser = (u, isOnline) => {
    const unseen = getUnseenCount(u.id);
// Total unseen messages (all users)

    return (
      <li
        key={u.id}
        onClick={() => dispatch(selectUser(u))}
        className={`p-2 rounded cursor-pointer flex justify-between items-center
          ${
            selectedUser?.id === u.id
              ? "bg-blue-100 font-semibold"
              : "hover:bg-gray-100"
          }`}
      >
        <span className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          {u.fullName || u.email}
        </span>

        <div className="flex items-center gap-2">
          {unseen > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 rounded-full">
              {unseen}
            </span>
          )}
          <span
            className={`text-xs ${
              isOnline ? "text-green-600" : "text-gray-400"
            }`}
          >
            {isOnline ? "online" : "offline"}
          </span>
        </div>
      </li>
    );
  };

  const totalUnseenCount = useMemo(() => {
  const myId = me?.id;
  if (!myId) return 0;

  let total = 0;

  Object.values(messagesByUser).forEach((messages) => {
    messages.forEach((m) => {
      if (!m.seen && m.senderId !== myId) {
        total += 1;
      }
    });
  });

  return total;
}, [messagesByUser, me?.id]);
  return (
    <ul className="space-y-1 overflow-auto">
      {/* ONLINE */}
      <div className="flex justify-between items-center mb-2">
  <h2 className="text-sm font-semibold text-gray-700">Users</h2>
  {totalUnseenCount > 0 && (
    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
      {totalUnseenCount}
    </span>
  )}
</div>

      {onlineUsers.length > 0 && (
        <p className="text-xs text-gray-500 mt-2 mb-1">ONLINE</p>
      )}
      {onlineUsers.map((u) => renderUser(u, true))}

      {/* OFFLINE */}
      {offlineUsers.length > 0 && (
        <p className="text-xs text-gray-500 mt-4 mb-1">OFFLINE</p>
      )}
      {offlineUsers.map((u) => renderUser(u, false))}

      {users.length === 0 && (
        <p className="text-sm text-gray-400 text-center mt-4">
          No users found
        </p>
      )}
    </ul>
  );
}
