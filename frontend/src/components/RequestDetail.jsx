import { useState } from 'react';
import JsonViewer from './JsonViewer';
import { useWebhook } from '../context/WebhookContext';

export default function RequestDetail() {
  const { selectedRequest } = useWebhook();
  const [activeTab, setActiveTab] = useState('body');
  const [copied, setCopied] = useState(false);

  if (!selectedRequest) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-surface-600 text-4xl mb-3">→</div>
          <p className="text-surface-500 text-sm">Select a request to inspect</p>
          <p className="text-surface-600 text-xs mt-1">Details will appear here</p>
        </div>
      </div>
    );
  }

  const { method, statusCode, timestamp, latency, ip, userAgent, contentType, contentLength, path, body, headers, query } = selectedRequest;

  const tabs = [
    { id: 'body', label: 'Body' },
    { id: 'headers', label: 'Headers' },
    { id: 'query', label: 'Query Params' },
  ];

  const copyPayload = () => {
    const payload = JSON.stringify(body, null, 2);
    navigator.clipboard.writeText(payload).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(selectedRequest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webhook-${selectedRequest.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-surface-800 bg-surface-900">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-sm font-bold px-2 py-0.5 rounded border ${
            method === 'GET' ? 'text-method-get border-method-get' :
            method === 'POST' ? 'text-method-post border-method-post' :
            method === 'PUT' ? 'text-method-put border-method-put' :
            method === 'PATCH' ? 'text-method-patch border-method-patch' :
            method === 'DELETE' ? 'text-method-delete border-method-delete' :
            'text-surface-400 border-surface-600'
          }`}>
            {method}
          </span>
          <span className={`text-sm font-mono ${
            statusCode >= 200 && statusCode < 300 ? 'text-green-400' :
            statusCode >= 400 ? 'text-red-400' :
            'text-surface-400'
          }`}>{statusCode}</span>
          <span className="text-xs text-surface-500 font-mono">{path || '/'}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-surface-500">
          <span title="IP">{ip}</span>
          <span title="Latency">{latency}ms</span>
          <span title="Content Type">{contentType}</span>
          {contentLength !== '0' && <span title="Size">{formatSize(contentLength)}</span>}
          <span title="Timestamp">{formatDate(timestamp)}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={copyPayload}
            className="px-2 py-1 text-xs font-medium rounded border border-surface-700 bg-surface-800 hover:bg-surface-700 text-surface-300 transition-colors"
          >
            {copied ? 'Copied' : 'Copy Payload'}
          </button>
          <button
            onClick={exportJson}
            className="px-2 py-1 text-xs font-medium rounded border border-surface-700 bg-surface-800 hover:bg-surface-700 text-surface-300 transition-colors"
          >
            Export JSON
          </button>
          {userAgent && userAgent !== 'unknown' && (
            <span className="text-xs text-surface-600 truncate ml-auto max-w-[200px]" title={userAgent}>
              {userAgent}
            </span>
          )}
        </div>
      </div>

      <div className="flex border-b border-surface-800 bg-surface-900">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-accent-500 text-accent-400'
                : 'border-transparent text-surface-500 hover:text-surface-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-surface-900">
        {activeTab === 'body' && <JsonViewer data={body} label="Request Body" />}
        {activeTab === 'headers' && <JsonViewer data={headers} label="Headers" />}
        {activeTab === 'query' && <JsonViewer data={query} label="Query Parameters" />}
      </div>
    </div>
  );
}

function formatSize(bytes) {
  if (!bytes || bytes === '0') return '';
  const num = Number(bytes);
  if (num < 1024) return `${num}B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)}KB`;
  return `${(num / (1024 * 1024)).toFixed(1)}MB`;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}
