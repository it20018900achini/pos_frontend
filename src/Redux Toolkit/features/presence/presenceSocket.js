let presenceSocket = null;
let chatSocket = null;
let chatMessageQueue = [];
let chatSocketReadyPromise = null;

// Get backend URL from environment variables
const BACKEND_WS_URL = "ws://localhost:5000";

// ----------------- Presence WS -----------------
export function connectPresenceSocket(jwt, onMessage) {
  if (presenceSocket && presenceSocket.readyState === WebSocket.OPEN) return presenceSocket;

  const url = `${BACKEND_WS_URL}/ws/presence?token=${jwt}`;
  presenceSocket = new WebSocket(url);

  presenceSocket.onopen = () => console.log("✅ Presence WS connected");
  presenceSocket.onmessage = (event) => {
    if (!event?.data) return;
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch {
      console.warn("⚠️ Presence WS ignored non-JSON:", event.data);
    }
  };
  presenceSocket.onerror = (err) => console.error("Presence WS error:", err);
  presenceSocket.onclose = () => console.log("❌ Presence WS disconnected");

  return presenceSocket;
}

// ----------------- Chat WS -----------------
export function connectChatSocket(jwt, onMessage) {
  if (chatSocket && chatSocket.readyState === WebSocket.OPEN) return chatSocket;

  const url = `${BACKEND_WS_URL}/ws/chat?token=${jwt}`;
  chatSocket = new WebSocket(url);

  // Promise resolves when socket is open
  chatSocketReadyPromise = new Promise((resolve) => {
    chatSocket.onopen = () => {
      console.log("✅ Chat WS connected");
      // Send queued messages
      chatMessageQueue.forEach((msg) => chatSocket.send(JSON.stringify(msg)));
      chatMessageQueue = [];
      resolve(true);
    };
  });

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
}

// ----------------- Send chat message -----------------
export async function sendChatMessage(payload) {
  if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
    chatSocket.send(JSON.stringify(payload));
  } else {
    console.warn("⚠️ Chat socket not open, queueing message");
    chatMessageQueue.push(payload);

    // Wait for socket to be ready if promise exists
    if (chatSocketReadyPromise) await chatSocketReadyPromise;
  }
}

// ----------------- Disconnect -----------------
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
    chatSocketReadyPromise = null;
  }
}
