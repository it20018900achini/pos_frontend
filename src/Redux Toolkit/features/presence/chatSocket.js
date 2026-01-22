let ws;

export function connectChatSocket(token, onMessage) {
  if (ws) ws.close();

  ws = new WebSocket(`ws://localhost:5000/ws/chat?token=${token}`);

  ws.onopen = () => console.log("Chat WS connected");
  ws.onmessage = (event) => onMessage && onMessage(event);
  ws.onclose = () => console.log("Chat WS disconnected");
  ws.onerror = (err) => console.error("Chat WS error:", err);
}

export function disconnectChatSocket() {
  if (ws) {
    ws.close();
    ws = null;
  }
}

export function sendChatMessage(payload) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return Promise.reject("WebSocket not connected");
  ws.send(JSON.stringify(payload));
  return Promise.resolve();
}
