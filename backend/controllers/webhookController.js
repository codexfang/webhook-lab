import { addRequest } from '../services/requestStore.js';
import { broadcastToSession } from '../websocket/wsServer.js';

export function handleWebhook(req, res) {
  const { sessionId } = req.params;
  const captured = req.capturedData || {};

  const requestData = {
    id: generateId(),
    ...captured,
    body: req.body || {},
    sessionId,
  };

  addRequest(sessionId, requestData);
  broadcastToSession(sessionId, {
    type: 'new_request',
    data: requestData,
  });

  res.status(200).json({
    status: 'received',
    requestId: requestData.id,
    timestamp: requestData.timestamp,
  });
}

export function handlePreflight(req, res) {
  const { sessionId } = req.params;
  const captured = req.capturedData || {};

  const requestData = {
    id: generateId(),
    ...captured,
    body: req.body || {},
    sessionId,
    method: req.method,
  };

  addRequest(sessionId, requestData);
  broadcastToSession(sessionId, {
    type: 'new_request',
    data: requestData,
  });

  res.status(200).end();
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
