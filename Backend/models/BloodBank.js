import mongoose from 'mongoose';

const bloodBankSchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  unitsAvailable: {
    type: Number,
    required: true,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  donorInfo: {
    donorId: String,
    donationDate: Date,
    screeningStatus: {
      type: String,
      enum: ['pending', 'cleared', 'rejected'],
      default: 'pending'
    }
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'expired'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const bloodRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  unitsRequired: {
    type: Number,
    required: true
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  requiredBy: {
    type: Date,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  hospitalLocation: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BloodBank = mongoose.model('BloodBank', bloodBankSchema);
const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);

export { BloodBank, BloodRequest };