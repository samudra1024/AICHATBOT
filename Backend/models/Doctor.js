import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  qualification: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  daysAvailable: {
    type: [String],
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  timings: {
    morning: {
      start: String,
      end: String,
      available: Boolean
    },
    afternoon: {
      start: String,
      end: String,
      available: Boolean
    },
    evening: {
      start: String,
      end: String,
      available: Boolean
    }
  },
  fees: {
    consultation: {
      type: Number,
      required: true
    },
    followUp: {
      type: Number,
      default: 0
    }
  },
  maxPatientsPerSlot: {
    type: Number,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
