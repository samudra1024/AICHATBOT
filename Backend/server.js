import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import appointmentRoutes from './routes/appointment.js';
import doctorRoutes from './routes/doctor.js';
import departmentRoutes from './routes/department.js';
import adminRoutes from './routes/admin.js';
import labRoutes from './routes/lab.js';
import medicineRoutes from './routes/medicine.js';
import vaccinationRoutes from './routes/vaccination.js';
import bloodBankRoutes from './routes/bloodBank.js';
import feedbackRoutes from './routes/feedback.js';
import navigationRoutes from './routes/navigation.js';
import billRoutes from './routes/bill.js';
import videoConsultationRoutes from './routes/videoConsultation.js';
import ambulanceRoutes from './routes/ambulance.js';
import { startReminderService } from './utils/reminderService.js';
import { checkOllamaHealth } from './utils/gemmaService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/medicine', medicineRoutes);
app.use('/api/vaccination', vaccinationRoutes);
app.use('/api/blood-bank', bloodBankRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/navigation', navigationRoutes);
app.use('/api/bill', billRoutes);
app.use('/api/video-consultation', videoConsultationRoutes);
app.use('/api/ambulance', ambulanceRoutes);

// Health check route
app.get('/api/health', async (req, res) => {
  const ollamaStatus = await checkOllamaHealth();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    ollama: ollamaStatus ? 'connected' : 'disconnected'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'MediBot API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      chat: '/api/chat',
      appointments: '/api/appointment',
      doctors: '/api/doctor',
      departments: '/api/department',
      admin: '/api/admin',
      lab: '/api/lab',
      medicine: '/api/medicine',
      vaccination: '/api/vaccination',
      bloodBank: '/api/blood-bank',
      feedback: '/api/feedback',
      navigation: '/api/navigation',
      bill: '/api/bill',
      videoConsultation: '/api/video-consultation',
      ambulance: '/api/ambulance',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    // Start the server
    app.listen(PORT, async () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API URL: http://localhost:${PORT}`);

      // Check Ollama connection
      const ollamaStatus = await checkOllamaHealth();
      if (ollamaStatus) {
        console.log('✅ Ollama is running and accessible');
      } else {
        console.log('⚠️  WARNING: Ollama is not accessible. Please ensure Ollama is running on http://localhost:11434');
        console.log('   Run: ollama run gemma3:latest');
      }

      // Start reminder service
      startReminderService();
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

export default app;
