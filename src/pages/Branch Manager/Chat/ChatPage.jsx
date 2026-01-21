import PresenceListener from "./PresenceListener";
import ChatListener from "./ChatListener";
import OnlineUsers from "./OnlineUsers";

export default function ChatPage() {
  return (
    <div>
      <PresenceListener />
      <ChatListener />
      <OnlineUsers />
    </div>
  );
}
