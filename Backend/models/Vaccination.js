import mongoose from 'mongoose';

const vaccinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['child', 'adult', 'covid', 'flu', 'travel'],
    required: true
  },
  ageGroup: {
    type: String,
    required: true
  },
  doses: {
    type: Number,
    required: true,
    default: 1
  },
  interval: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    required: true
  },
  sideEffects: {
    type: String,
    default: ''
  },
  precautions: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const vaccinationAppointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vaccinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vaccination',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  doseNumber: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
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

const Vaccination = mongoose.model('Vaccination', vaccinationSchema);
const VaccinationAppointment = mongoose.model('VaccinationAppointment', vaccinationAppointmentSchema);

export { Vaccination, VaccinationAppointment };