import express from 'express';
import { checkBloodAvailability, requestBlood, getUserBloodRequests } from '../controllers/bloodBankController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/availability', authMiddleware, checkBloodAvailability);
router.post('/request', authMiddleware, requestBlood);
router.get('/my-requests', authMiddleware, getUserBloodRequests);

export default router;