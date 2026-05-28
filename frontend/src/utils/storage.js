const DB_NAME = 'webhook-lab';
const DB_VERSION = 1;
const STORE_NAME = 'requests';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('sessionId', 'sessionId', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function persistRequest(request) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(request);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const key = `wl_req_${request.sessionId}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift(request);
    if (existing.length > 100) existing.length = 100;
    localStorage.setItem(key, JSON.stringify(existing));
  }
}

export async function getStoredRequests(sessionId) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('sessionId');
    const range = IDBKeyRange.only(sessionId);
    const requests = [];
    return new Promise((resolve, reject) => {
      const cursor = index.openCursor(range, 'prev');
      cursor.onsuccess = (event) => {
        const cursorResult = event.target.result;
        if (cursorResult) {
          requests.push(cursorResult.value);
          cursorResult.continue();
        } else {
          resolve(requests);
        }
      };
      cursor.onerror = () => reject(cursor.error);
    });
  } catch {
    const key = `wl_req_${sessionId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
}
