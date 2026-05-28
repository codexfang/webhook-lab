const MAX_REQUESTS_PER_SESSION = 100;

const sessions = new Map();

export function addRequest(sessionId, requestData) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  const requests = sessions.get(sessionId);
  requests.unshift(requestData);
  if (requests.length > MAX_REQUESTS_PER_SESSION) {
    requests.length = MAX_REQUESTS_PER_SESSION;
  }
  return requestData;
}

export function getRequests(sessionId, method, status) {
  const requests = sessions.get(sessionId) || [];
  if (!method && !status) return requests;
  return requests.filter((r) => {
    if (method && r.method !== method.toUpperCase()) return false;
    if (status && r.statusCode !== Number(status)) return false;
    return true;
  });
}

export function clearRequests(sessionId) {
  sessions.delete(sessionId);
}

export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}
