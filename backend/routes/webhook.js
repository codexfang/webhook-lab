import { Router } from 'express';
import { handleWebhook, handlePreflight } from '../controllers/webhookController.js';

const router = Router();

router.all('/webhook/:sessionId', (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return handlePreflight(req, res);
  }
  next();
});

router.all('/webhook/:sessionId', handleWebhook);

export default router;
