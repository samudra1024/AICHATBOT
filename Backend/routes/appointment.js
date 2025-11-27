import express from 'express';
import {
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
  rescheduleAppointment,
  getWaitTime
} from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Book new appointment
router.post('/book', bookAppointment);

// Get user's appointments
router.get('/my-appointments', getUserAppointments);

// Cancel appointment
router.delete('/:appointmentId/cancel', cancelAppointment);

// Reschedule appointment
router.put('/:appointmentId/reschedule', rescheduleAppointment);

// Get wait time for appointment
router.get('/:appointmentId/wait-time', getWaitTime);

export default router;
