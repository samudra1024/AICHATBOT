import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  mobile: {
    type: String,
    trim: true,
    default: null,
    match: /^[0-9]{10}$/
  },
  age: {
    type: Number,
    default: null
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say', null],
    default: null
  },
  uhid: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    default: null
  },
  aadhaar: {
    type: String,
    trim: true,
    match: /^[0-9]{12}$/,
    unique: true,
    sparse: true,
    default: null
  },
  language: {
    type: String,
    enum: ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi'],
    default: 'English'
  },
  whatsappNumber: {
    type: String,
    trim: true,
    match: /^[0-9]{10}$/,
    default: null
  },
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  },
  medicalHistory: {
    allergies: [String],
    chronicConditions: [String],
    currentMedications: [String],
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null],
      default: null
    }
  },
  preferences: {
    smsReminders: {
      type: Boolean,
      default: true
    },
    whatsappReminders: {
      type: Boolean,
      default: true
    },
    emailReminders: {
      type: Boolean,
      default: true
    }
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

export default User;
