import PresenceListener from "./PresenceListener";
import OnlineUsers from "./OnlineUsers";

function AppContent() {
  return (
    <>
      <PresenceListener />
      <OnlineUsers />
      {/* Your other components */}
    </>
  );
}

export default AppContent;
