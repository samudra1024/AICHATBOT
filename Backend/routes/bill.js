import express from 'express';
import { generateEstimate, getUserEstimates, getEstimateDetails } from '../controllers/billController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/estimate', authMiddleware, generateEstimate);
router.get('/my-estimates', authMiddleware, getUserEstimates);
router.get('/estimate/:estimateId', authMiddleware, getEstimateDetails);

export default router;