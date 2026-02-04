import { settings } from "../../../constant";

let ws = null;
let reconnectTimer = null;
let messageQueue = [];

const WS_URL = `${settings.ws}/ws/chat`;

export function connectChatSocket({ token, onMessage, onOpen, onClose }) {
  if (!token) return;

  // Prevent duplicate connections
  if (ws && ws.readyState === WebSocket.OPEN) return;

  ws = new WebSocket(`${WS_URL}?token=${token}`);

  ws.onopen = () => {
    console.log("✅ Chat WS connected");

    // Flush queued messages
    messageQueue.forEach(msg => ws.send(msg));
    messageQueue = [];

    onOpen?.();
  };

  ws.onmessage = event => {
    try {
      const data = JSON.parse(event.data);
      onMessage?.(data);
    } catch (err) {
      console.error("WS message parse error:", err);
    }
  };

  ws.onclose = () => {
    console.log("❌ Chat WS disconnected");
    onClose?.();

    // Auto-reconnect after 3s
    reconnectTimer = setTimeout(() => {
      connectChatSocket({ token, onMessage, onOpen, onClose });
    }, 3000);
  };

  ws.onerror = err => {
    console.error("Chat WS error:", err);
    ws?.close();
  };
}

/* ---------------- SEND MESSAGE ---------------- */

export function sendChatMessage(payload) {
  const message = JSON.stringify(payload);

  if (!ws || ws.readyState !== WebSocket.OPEN) {
    // Queue message until socket reconnects
    messageQueue.push(message);
    return Promise.resolve();
  }

  ws.send(message);
  return Promise.resolve();
}

/* ---------------- DISCONNECT ---------------- */

export function disconnectChatSocket() {
  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = null;

  if (ws) {
    ws.onclose = null;
    ws.close();
    ws = null;
  }

  messageQueue = [];
}
