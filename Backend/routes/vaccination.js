import express from 'express';
import { getVaccines, bookVaccination, getUserVaccinations } from '../controllers/vaccinationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getVaccines);
router.post('/book', authMiddleware, bookVaccination);
router.get('/my-appointments', authMiddleware, getUserVaccinations);

export default router;