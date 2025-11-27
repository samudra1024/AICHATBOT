import express from 'express';
import { sendMessage, getChatHistory, clearChat, updateLanguage } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Send message and get AI response
router.post('/message', sendMessage);

// Get chat history
router.get('/history', getChatHistory);

// Clear chat history
router.delete('/clear', clearChat);

// Update language preference
router.put('/language', updateLanguage);

export default router;
