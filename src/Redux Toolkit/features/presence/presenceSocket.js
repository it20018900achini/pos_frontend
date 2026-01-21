let presenceSocket = null;
let chatSocket = null;
let chatMessageQueue = []; // ✅ declare this at the top

// ----------------- Presence WS -----------------
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

  chatSocket = new WebSocket(`ws://localhost:5000/ws/chat?token=${jwt}`);

  chatSocket.onopen = () => {
    console.log("✅ Chat WS connected");
    // ✅ send queued messages
    chatMessageQueue.forEach(msg => chatSocket.send(JSON.stringify(msg)));
    chatMessageQueue = [];
  };

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
export function sendChatMessage(payload) {
  if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
    chatSocket.send(JSON.stringify(payload));
  } else {
    console.warn("⚠️ Chat socket not open, queueing message");
    chatMessageQueue.push(payload); // ✅ queue messages until WS is ready
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
  }
}
