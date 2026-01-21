let socket;

export const connectChatSocket = (token, handlers) => {
  socket = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/chat?token=${token}`);

  socket.onopen = () => handlers?.onOpen?.();
  socket.onmessage = (event) => handlers?.onMessage?.(JSON.parse(event.data));
  socket.onclose = () => handlers?.onClose?.();
  socket.onerror = () => handlers?.onError?.();

  return socket;
};

export const sendChatMessage = (receiverId, content) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ receiverId, content }));
};

export const disconnectChatSocket = () => {
  socket?.close();
  socket = null;
};
