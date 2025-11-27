import express from 'express';
import { generateReportOTP, downloadReport, getUserReports } from '../controllers/labController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate-otp', authMiddleware, generateReportOTP);
router.post('/download', authMiddleware, downloadReport);
router.get('/my-reports', authMiddleware, getUserReports);

export default router;