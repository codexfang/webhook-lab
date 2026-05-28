import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import webhookRoutes from './routes/webhook.js';
import apiRoutes from './routes/api.js';
import { captureRequest } from './middleware/captureRequest.js';
import { createWebSocketServer } from './websocket/wsServer.js';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(captureRequest);

app.use('/api', apiRoutes);
app.use('/', webhookRoutes);

app.get('/', (req, res) => {
  res.json({
    name: 'Webhook Lab',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      webhook: '/webhook/:sessionId',
      requests: '/api/sessions/:sessionId/requests',
      health: '/api/health',
    },
  });
});

createWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`Webhook Lab backend running on port ${PORT}`);
});
