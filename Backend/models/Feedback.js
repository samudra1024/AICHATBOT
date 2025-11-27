import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    default: null
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    default: null
  },
  type: {
    type: String,
    enum: ['appointment', 'service', 'facility', 'general'],
    required: true
  },
  rating: {
    overall: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    doctorRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    facilityRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    serviceRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    }
  },
  npsScore: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  comments: {
    type: String,
    required: true
  },
  suggestions: {
    type: String,
    default: ''
  },
  wouldRecommend: {
    type: Boolean,
    required: true
  },
  visitDate: {
    type: Date,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  },
  adminResponse: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;