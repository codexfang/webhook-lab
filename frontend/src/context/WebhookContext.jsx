import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { STORAGE_KEY } from '../utils/constants';
import { persistRequest, getStoredRequests } from '../utils/storage';

const WebhookContext = createContext(null);

function generateSessionId() {
  const raw = crypto.randomUUID();
  return raw.replace(/-/g, '').substring(0, 12);
}

function loadSession() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
  } catch {}
  const id = generateSessionId();
  try {
    sessionStorage.setItem(STORAGE_KEY, id);
  } catch {}
  return id;
}

export function WebhookProvider({ children }) {
  const [sessionId] = useState(loadSession);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [latestRequestId, setLatestRequestId] = useState(null);
  const [wsStatus, setWsStatus] = useState('disconnected');
  const [filterMethod, setFilterMethod] = useState('');

  useEffect(() => {
    getStoredRequests(sessionId).then((stored) => {
      if (stored.length > 0) {
        setRequests(stored);
      }
    });
  }, [sessionId]);

  const addRequest = useCallback((request) => {
    setRequests((prev) => {
      const next = [request, ...prev];
      if (next.length > 100) next.length = 100;
      return next;
    });
    setSelectedRequest((prev) => prev ?? request);
    setLatestRequestId(request.id);
    persistRequest(request);
  }, []);

  const clearRequests = useCallback(() => {
    setRequests([]);
    setSelectedRequest(null);
    setLatestRequestId(null);
  }, []);

  const filteredRequests = filterMethod
    ? requests.filter((r) => r.method === filterMethod)
    : requests;

  const webhookUrl = import.meta.env.PROD
    ? `https://webhook-lab.onrender.com/webhook/${sessionId}`
    : `${location.origin}/webhook/${sessionId}`;

  return (
    <WebhookContext.Provider
      value={{
        sessionId,
        requests,
        filteredRequests,
        selectedRequest,
        latestRequestId,
        wsStatus,
        filterMethod,
        webhookUrl,
        setSelectedRequest,
        setFilterMethod,
        setWsStatus,
        addRequest,
        clearRequests,
      }}
    >
      {children}
    </WebhookContext.Provider>
  );
}

export function useWebhook() {
  const ctx = useContext(WebhookContext);
  if (!ctx) throw new Error('useWebhook must be used within WebhookProvider');
  return ctx;
}
