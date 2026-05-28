import { useState, useCallback } from 'react';

function JsonNode({ keyName, value, depth }) {
  const [collapsed, setCollapsed] = useState(depth >= 3);

  const toggle = useCallback(() => setCollapsed((c) => !c), []);

  const indent = depth * 16;

  if (value === null) {
    return (
      <div style={{ paddingLeft: indent }} className="leading-6">
        {keyName !== null && (
          <span className="text-surface-400">{keyName}: </span>
        )}
        <span className="text-surface-500 italic">null</span>
      </div>
    );
  }

  if (typeof value === 'string') {
    return (
      <div style={{ paddingLeft: indent }} className="leading-6">
        {keyName !== null && (
          <span className="text-surface-400">{keyName}: </span>
        )}
        <span className="text-accent-300">"{value}"</span>
      </div>
    );
  }

  if (typeof value === 'number') {
    return (
      <div style={{ paddingLeft: indent }} className="leading-6">
        {keyName !== null && (
          <span className="text-surface-400">{keyName}: </span>
        )}
        <span className="text-accent-500">{value}</span>
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <div style={{ paddingLeft: indent }} className="leading-6">
        {keyName !== null && (
          <span className="text-surface-400">{keyName}: </span>
        )}
        <span className="text-method-put">{value.toString()}</span>
      </div>
    );
  }

  if (Array.isArray(value)) {
    const isEmpty = value.length === 0;
    return (
      <div style={{ paddingLeft: indent }} className="leading-6">
        <button onClick={toggle} className="text-surface-500 hover:text-surface-300 mr-1">
          {collapsed ? '▶' : '▼'}
        </button>
        {keyName !== null && (
          <span className="text-surface-400">{keyName}: </span>
        )}
        <span className="text-surface-500">
          {collapsed ? `[${value.length} items]` : '['}
        </span>
        {!collapsed && (
          <>
            {value.map((item, i) => (
              <JsonNode key={i} keyName={i} value={item} depth={depth + 1} />
            ))}
            <span style={{ paddingLeft: indent }} className="block text-surface-500">{'],'}</span>
          </>
        )}
        {isEmpty && <span className="text-surface-500">[]</span>}
      </div>
    );
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value);
    const isEmpty = keys.length === 0;
    return (
      <div style={{ paddingLeft: indent }} className="leading-6">
        <button onClick={toggle} className="text-surface-500 hover:text-surface-300 mr-1">
          {collapsed ? '▶' : '▼'}
        </button>
        {keyName !== null && (
          <span className="text-surface-400">{keyName}: </span>
        )}
        <span className="text-surface-500">
          {collapsed ? `{${keys.length} keys}` : '{'}
        </span>
        {!collapsed && (
          <>
            {keys.map((k) => (
              <JsonNode key={k} keyName={k} value={value[k]} depth={depth + 1} />
            ))}
              <span style={{ paddingLeft: indent }} className="block text-surface-500">{'},'}</span>
          </>
        )}
        {isEmpty && <span className="text-surface-500">{'{}'}</span>}
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: indent }} className="leading-6">
      {keyName !== null && (
        <span className="text-surface-400">{keyName}: </span>
      )}
      <span>{String(value)}</span>
    </div>
  );
}

export default function JsonViewer({ data, label }) {
  if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
    return (
      <div className="p-4">
        {label && <div className="text-surface-500 text-xs uppercase tracking-wider mb-2">{label}</div>}
        <div className="text-surface-600 italic text-sm">empty</div>
      </div>
    );
  }

  return (
    <div className="p-4 font-mono text-sm">
      {label && <div className="text-surface-500 text-xs uppercase tracking-wider mb-3">{label}</div>}
      <JsonNode keyName={null} value={data} depth={0} />
    </div>
  );
}
