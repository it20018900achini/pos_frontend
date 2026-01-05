let socket = null;
let reconnectTimeout = null;

export function connectPresenceSocket(token, onMessage) {
  if (!token) return;

  const wsUrl = `ws://localhost:5000/ws/presence?token=${token}`;
  socket = new WebSocket(wsUrl);

  socket.onopen = () => console.log("✅ Presence WS connected");
  socket.onmessage = onMessage;

  socket.onclose = (event) => {
    console.log("❌ Presence WS disconnected", event.reason);
    reconnectTimeout = setTimeout(() => connectPresenceSocket(token, onMessage), 2000);
  };

  socket.onerror = (err) => {
    console.error("WebSocket error", err);
    socket?.close();
  };
}

export function disconnectPresenceSocket() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  if (socket) {
    socket.close();
    socket = null;
    console.log("🛑 WS manually disconnected");
  }
}
