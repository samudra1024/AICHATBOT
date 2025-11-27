import express from 'express';
import { requestAmbulance, getRequestStatus, getUserRequests, cancelRequest } from '../controllers/ambulanceController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/request', authMiddleware, requestAmbulance);
router.get('/request/:requestId', authMiddleware, getRequestStatus);
router.get('/my-requests', authMiddleware, getUserRequests);
router.delete('/request/:requestId', authMiddleware, cancelRequest);

export default router;