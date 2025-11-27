import express from 'express';
import { getDirections, getFloorMap, searchLocations } from '../controllers/navigationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/directions', authMiddleware, getDirections);
router.get('/floor-map', authMiddleware, getFloorMap);
router.get('/search', authMiddleware, searchLocations);

export default router;