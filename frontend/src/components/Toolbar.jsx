import { useWebhook } from '../context/WebhookContext';

export default function Toolbar() {
  const { requests, clearRequests, wsStatus } = useWebhook();

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-surface-900 border-b border-surface-800">
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm font-semibold text-surface-200">Webhook Lab</span>
        <span className="text-xs text-surface-600 bg-surface-800 px-1.5 py-0.5 rounded">v1.0</span>
      </div>
      <div className="flex items-center gap-2">
        {wsStatus === 'disconnected' && (
          <span className="text-xs text-method-delete bg-red-900/20 px-2 py-0.5 rounded">Offline</span>
        )}
        <span className="text-xs text-surface-500">{requests.length} requests</span>
        {requests.length > 0 && (
          <button
            onClick={clearRequests}
            className="px-2 py-1 text-xs font-medium rounded border border-surface-700 bg-surface-800 hover:bg-surface-700 text-surface-400 hover:text-surface-200 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
