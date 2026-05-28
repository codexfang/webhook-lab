import { useWebhook } from '../context/WebhookContext';
import { METHOD_COLORS } from '../utils/constants';

export default function RequestList() {
  const { filteredRequests, selectedRequest, setSelectedRequest, filterMethod, setFilterMethod } = useWebhook();

  if (filteredRequests.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-surface-600 text-4xl mb-3">~</div>
          <p className="text-surface-500 text-sm">
            {filterMethod ? `No ${filterMethod} requests yet` : 'Waiting for incoming requests...'}
          </p>
          <p className="text-surface-600 text-xs mt-1">
            Send a request to your webhook URL to see it here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-3 py-2 border-b border-surface-800 flex items-center gap-2">
        <span className="text-xs text-surface-500 uppercase tracking-wider">Requests</span>
        <span className="text-xs text-surface-600 bg-surface-800 px-1.5 py-0.5 rounded">{filteredRequests.length}</span>
        <div className="ml-auto" />
        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
          className="text-xs bg-surface-800 border border-surface-700 rounded px-2 py-1 text-surface-400 focus:outline-none focus:border-accent-500"
        >
          <option value="">All Methods</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
          <option value="HEAD">HEAD</option>
          <option value="OPTIONS">OPTIONS</option>
        </select>
      </div>
      {filteredRequests.map((req) => (
        <button
          key={req.id}
          onClick={() => setSelectedRequest(req)}
          className={`w-full text-left px-4 py-3 border-b border-surface-800 hover:bg-surface-850 transition-colors ${
            selectedRequest?.id === req.id ? 'bg-surface-800 border-l-2 border-l-accent-500' : ''
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${METHOD_COLORS[req.method] || 'text-surface-400 border-surface-600'}`}>
              {req.method}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              req.statusCode >= 200 && req.statusCode < 300
                ? 'bg-green-900/40 text-green-400'
                : req.statusCode >= 400
                ? 'bg-red-900/40 text-red-400'
                : 'bg-surface-700 text-surface-400'
            }`}>
              {req.statusCode}
            </span>
            <span className="text-xs text-surface-600 ml-auto">
              {formatTimestamp(req.timestamp)}
            </span>
          </div>
          <div className="text-xs text-surface-500 truncate">
            {req.path || '/'}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-surface-600">{req.ip || 'unknown'}</span>
            <span className="text-xs text-surface-600">{req.latency}ms</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function formatTimestamp(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
