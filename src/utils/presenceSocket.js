let socket = null;

export function connectPresenceSocket(jwt, onMessage) {
  if (socket && socket.readyState === WebSocket.OPEN) return socket; // reuse if already connected

  socket = new WebSocket(`ws://localhost:5000/ws/presence?token=${jwt}`);

  socket.onopen = () => console.log("✅ WS connected");
  socket.onmessage = onMessage;
  socket.onerror = (err) => console.error("WebSocket error", err);
  socket.onclose = (e) => console.log("❌ WS disconnected", e);

  return socket;
}

export function disconnectPresenceSocket() {
  if (socket) {
    try {
      if (socket.readyState === WebSocket.OPEN) socket.close();
    } catch (err) {
      console.warn("WS disconnect error", err);
    } finally {
      socket = null;
    }
  }
}

export function sendPresenceMessage(payload) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  } else {
    console.warn("Cannot send, WS not open yet");
  }
}
