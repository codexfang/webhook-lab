import { useCallback } from 'react';
import Toolbar from '../components/Toolbar';
import WebhookUrlBar from '../components/WebhookUrlBar';
import RequestList from '../components/RequestList';
import RequestDetail from '../components/RequestDetail';
import { useWebhook } from '../context/WebhookContext';
import { useWebSocket } from '../hooks/useWebSocket';

export default function Dashboard() {
  const { sessionId, setWsStatus, addRequest } = useWebhook();

  const handleMessage = useCallback((message) => {
    if (message.type === 'new_request' && message.data) {
      addRequest(message.data);
    }
  }, [addRequest]);

  useWebSocket(sessionId, handleMessage, setWsStatus);

  return (
    <div className="h-screen flex flex-col">
      <Toolbar />
      <WebhookUrlBar />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[380px] flex flex-col border-r border-surface-800 bg-surface-900 flex-shrink-0 hidden md:flex">
          <RequestList />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <RequestDetail />
        </div>
      </div>

      <div className="md:hidden flex-1 flex overflow-hidden">
        <RequestList />
      </div>
    </div>
  );
}
