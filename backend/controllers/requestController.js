import { getRequests, clearRequests } from '../services/requestStore.js';

export function listRequests(req, res) {
  const { sessionId } = req.params;
  const { method, status } = req.query;
  const requests = getRequests(sessionId, method, status);
  res.json({ requests, total: requests.length });
}

export function clearSessionRequests(req, res) {
  const { sessionId } = req.params;
  clearRequests(sessionId);
  res.json({ status: 'cleared', sessionId });
}

export function healthCheck(req, res) {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}
