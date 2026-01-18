import { useSelector } from "react-redux";

export default function OnlineUsers() {
  const onlineUsers = useSelector((state) => state.presence.onlineUsers);

  if (!onlineUsers.length) return <p>No users online</p>;

  return (
    <div>
      <h4>Online Users</h4>
      <ul>
        {onlineUsers.map((u) => (
          <li key={u.id}>{u.fullName || u.email}</li>
        ))}
      </ul>
    </div>
  );
}
