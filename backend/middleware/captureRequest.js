export function captureRequest(req, res, next) {
  const start = Date.now();
  const originalEnd = res.end.bind(res);

  res.end = function (...args) {
    const latency = Date.now() - start;

    req.capturedData = {
      headers: req.headers,
      query: req.query,
      method: req.method,
      body: req.body,
      timestamp: new Date().toISOString(),
      latency,
      statusCode: res.statusCode,
      contentType: req.headers['content-type'] || 'application/octet-stream',
      contentLength: req.headers['content-length'] || '0',
      path: req.path,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'] || 'unknown',
    };

    originalEnd(...args);
  };

  next();
}
