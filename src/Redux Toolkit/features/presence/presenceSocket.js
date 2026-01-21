let presenceSocket = null;
let chatSocket = null;

// 1️⃣ Presence WebSocket
export function connectPresenceSocket(jwt, onMessage) {
  if (presenceSocket && presenceSocket.readyState === WebSocket.OPEN) return presenceSocket;

  presenceSocket = new WebSocket(`ws://localhost:5000/ws/presence?token=${jwt}`);

  presenceSocket.onopen = () => console.log("✅ Presence WS connected");
  presenceSocket.onmessage = (event) => {
    if (!event?.data) return;
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch {
      console.warn("⚠️ WS ignored non-JSON:", event.data);
    }
  };
  presenceSocket.onerror = (err) => console.error("Presence WS error:", err);
  presenceSocket.onclose = () => console.log("❌ Presence WS disconnected");

  return presenceSocket;
};

// 2️⃣ Chat WebSocket
export function connectChatSocket(jwt, onMessage) {
  if (chatSocket && chatSocket.readyState === WebSocket.OPEN) return chatSocket;

  chatSocket = new WebSocket(`ws://localhost:5000/ws/chat?token=${jwt}`);

  chatSocket.onopen = () => console.log("✅ Chat WS connected");
  chatSocket.onmessage = (event) => {
    if (!event?.data) return;
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch {
      console.warn("⚠️ Chat WS ignored non-JSON:", event.data);
    }
  };
  chatSocket.onerror = (err) => console.error("Chat WS error:", err);
  chatSocket.onclose = () => console.log("❌ Chat WS disconnected");

  return chatSocket;
};

// 3️⃣ Send message (via chat socket)
export function sendChatMessage(payload) {
  if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
    chatSocket.send(JSON.stringify(payload));
  } else {
    console.warn("⚠️ Cannot send chat message, chat socket not open");
  }
}

// 4️⃣ Disconnect sockets
export function disconnectPresenceSocket() {
  if (presenceSocket) {
    if (presenceSocket.readyState === WebSocket.OPEN) presenceSocket.close();
    presenceSocket = null;
  }
}

export function disconnectChatSocket() {
  if (chatSocket) {
    if (chatSocket.readyState === WebSocket.OPEN) chatSocket.close();
    chatSocket = null;
  }
}
