let socket = null;

export function connectPresenceSocket(jwt, onMessage) {
  if (socket && socket.readyState === WebSocket.OPEN) return socket;

  socket = new WebSocket(`ws://localhost:5000/ws/presence?token=${jwt}`);

  socket.onopen = () => console.log("✅ Presence WS connected");
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  socket.onerror = (err) => console.error("Presence WS error", err);
  socket.onclose = () => console.log("❌ Presence WS disconnected");

  return socket;
}

export function disconnectPresenceSocket() {
  if (socket) {
    try {
      if (socket.readyState === WebSocket.OPEN) socket.close();
    } finally {
      socket = null;
    }
  }
}

export function sendPresenceMessage(payload) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
}
