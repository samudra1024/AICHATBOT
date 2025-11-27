import express from 'express';
import { submitFeedback, getFeedbackForm, getUserFeedback } from '../controllers/feedbackController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/submit', authMiddleware, submitFeedback);
router.get('/form/:appointmentId', authMiddleware, getFeedbackForm);
router.get('/my-feedback', authMiddleware, getUserFeedback);

export default router;