import { useEffect, useRef, useCallback } from 'react';
import { WS_URL } from '../utils/constants';

export function useWebSocket(sessionId, onMessage, onStatusChange) {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!sessionId || !mountedRef.current) return;

    const url = `${WS_URL}?sessionId=${sessionId}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (onStatusChange) onStatusChange('connected');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (onMessage) onMessage(message);
      } catch {}
    };

    ws.onclose = () => {
      if (onStatusChange) onStatusChange('disconnected');
      if (mountedRef.current) {
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [sessionId, onMessage, onStatusChange]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return wsRef;
}
