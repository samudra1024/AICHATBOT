import express from 'express';
import { bookVideoConsultation, getUserConsultations, joinConsultation } from '../controllers/videoConsultationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/book', authMiddleware, bookVideoConsultation);
router.get('/my-consultations', authMiddleware, getUserConsultations);
router.get('/:consultationId/join', authMiddleware, joinConsultation);

export default router;