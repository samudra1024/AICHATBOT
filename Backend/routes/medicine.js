import express from 'express';
import { searchMedicines, checkAvailability, getCategories } from '../controllers/medicineController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/search', authMiddleware, searchMedicines);
router.get('/categories', authMiddleware, getCategories);
router.get('/:medicineId/availability', authMiddleware, checkAvailability);

export default router;