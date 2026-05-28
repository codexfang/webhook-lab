import { WebSocketServer } from 'ws';

const sessions = new Map();

export function createWebSocketServer(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId) {
      ws.close(4000, 'sessionId required');
      return;
    }

    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, new Set());
    }
    sessions.get(sessionId).add(ws);

    ws.on('close', () => {
      const set = sessions.get(sessionId);
      if (set) {
        set.delete(ws);
        if (set.size === 0) {
          sessions.delete(sessionId);
        }
      }
    });

    ws.send(JSON.stringify({ type: 'connected', sessionId }));
  });

  return wss;
}

export function broadcastToSession(sessionId, message) {
  const clients = sessions.get(sessionId);
  if (!clients) return;

  const payload = JSON.stringify(message);
  for (const ws of clients) {
    if (ws.readyState === 1) {
      ws.send(payload);
    }
  }
}
