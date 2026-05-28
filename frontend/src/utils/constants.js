export const API_BASE = import.meta.env.PROD
  ? 'https://webhook-lab.onrender.com'
  : '';

export const WS_URL = import.meta.env.PROD
  ? 'wss://webhook-lab.onrender.com/ws'
  : `ws://${location.host}/ws`;

export const STORAGE_KEY = 'webhook-lab-session';
export const MAX_STORED_REQUESTS = 100;
export const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

export const METHOD_COLORS = {
  GET: 'text-method-get border-method-get',
  POST: 'text-method-post border-method-post',
  PUT: 'text-method-put border-method-put',
  PATCH: 'text-method-patch border-method-patch',
  DELETE: 'text-method-delete border-method-delete',
  HEAD: 'text-method-head border-method-head',
  OPTIONS: 'text-method-options border-method-options',
};
