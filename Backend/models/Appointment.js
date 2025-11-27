import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  slot: {
    type: String,
    required: true,
    enum: ['morning', 'afternoon', 'evening']
  },
  tokenNumber: {
    type: Number,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  reminderSent24h: {
    type: Boolean,
    default: false
  },
  reminderSent2h: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  },
  queuePosition: {
    type: Number,
    default: 0
  },
  estimatedWaitTime: {
    type: Number,
    default: 0
  },
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkedInAt: {
    type: Date,
    default: null
  },
  consultationStarted: {
    type: Date,
    default: null
  },
  consultationEnded: {
    type: Date,
    default: null
  },
  actualWaitTime: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
