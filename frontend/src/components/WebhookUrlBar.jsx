import { useState, useCallback } from 'react';
import { useWebhook } from '../context/WebhookContext';

export default function WebhookUrlBar() {
  const { webhookUrl, wsStatus } = useWebhook();
  const [copied, setCopied] = useState(false);

  const copyUrl = useCallback(() => {
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [webhookUrl]);

  const statusColor = {
    connected: 'bg-accent-500',
    disconnected: 'bg-surface-600',
    connecting: 'bg-method-put',
  }[wsStatus] || 'bg-surface-600';

  const statusLabel = {
    connected: 'Live',
    disconnected: 'Disconnected',
    connecting: 'Connecting',
  }[wsStatus] || 'Disconnected';

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-surface-900 border-b border-surface-800">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className={`w-2 h-2 rounded-full ${statusColor} flex-shrink-0`} />
        <span className="text-xs font-medium text-surface-400 uppercase w-20 flex-shrink-0">{statusLabel}</span>
        <div className="flex items-center bg-surface-850 border border-surface-700 rounded flex-1 min-w-0">
          <span className="text-surface-500 text-xs font-mono px-3 py-1.5 border-r border-surface-700 flex-shrink-0">WEBHOOK</span>
          <code className="text-accent-400 text-sm font-mono px-3 py-1.5 truncate">{webhookUrl}</code>
        </div>
      </div>
      <button
        onClick={copyUrl}
        className="px-3 py-1.5 text-xs font-medium rounded border border-surface-700 bg-surface-800 hover:bg-surface-700 text-surface-300 hover:text-surface-100 transition-colors flex-shrink-0"
      >
        {copied ? 'Copied' : 'Copy URL'}
      </button>
    </div>
  );
}
