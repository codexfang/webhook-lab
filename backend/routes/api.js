import { Router } from 'express';
import { listRequests, clearSessionRequests, healthCheck } from '../controllers/requestController.js';

const router = Router();

router.get('/health', healthCheck);
router.get('/sessions/:sessionId/requests', listRequests);
router.delete('/sessions/:sessionId/requests', clearSessionRequests);

export default router;
