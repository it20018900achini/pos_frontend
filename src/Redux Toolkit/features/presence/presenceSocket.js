// src/Redux Toolkit/features/presence/presenceSocket.js
let socket = null;

/**
 * Connects to the presence WebSocket.
 * @param {string} jwt - The JWT token
 * @param {function} onMessage - Callback for incoming messages
 * @returns {WebSocket} The socket instance
 */
export function connectPresenceSocket(jwt, onMessage) {
  if (socket && socket.readyState === WebSocket.OPEN) return socket;

  socket = new WebSocket(`ws://localhost:5000/ws/presence?token=${jwt}`);

  socket.onopen = () => console.log("✅ Presence WS connected");
socket.onmessage = (event) => {
  if (!event?.data) return;

  try {
    const data = JSON.parse(event.data);
    onMessage(data);
  } catch {
    console.warn("⚠️ WS ignored non-JSON:", event.data);
  }
};


  socket.onerror = (err) => console.error("Presence WS error:", err);
  socket.onclose = () => console.log("❌ Presence WS disconnected");

  return socket;
}

/**
 * Disconnects the presence WebSocket
 */
export function disconnectPresenceSocket() {
  if (socket) {
    try {
      if (socket.readyState === WebSocket.OPEN) socket.close();
    } finally {
      socket = null;
    }
  }
}

/**
 * Sends a message through the presence WebSocket
 * @param {object} payload - The message to send
 */
export function sendPresenceMessage(payload) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  } else {
    console.warn("⚠️ Cannot send message, socket not open");
  }
}
