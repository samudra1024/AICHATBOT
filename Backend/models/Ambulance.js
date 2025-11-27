import mongoose from 'mongoose';

const ambulanceSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['basic', 'advanced', 'cardiac', 'neonatal'],
    required: true
  },
  equipment: [{
    type: String
  }],
  driverName: {
    type: String,
    required: true
  },
  driverPhone: {
    type: String,
    required: true
  },
  paramedicName: {
    type: String,
    default: null
  },
  paramedicPhone: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'maintenance'],
    default: 'available'
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    address: String
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

const ambulanceRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  pickupLocation: {
    address: {
      type: String,
      required: true
    },
    latitude: Number,
    longitude: Number,
    landmark: String
  },
  destination: {
    address: {
      type: String,
      required: true
    },
    latitude: Number,
    longitude: Number
  },
  emergencyType: {
    type: String,
    enum: ['accident', 'cardiac', 'stroke', 'breathing', 'pregnancy', 'other'],
    required: true
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  patientCondition: {
    type: String,
    required: true
  },
  ambulanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ambulance',
    default: null
  },
  estimatedArrival: {
    type: Date,
    default: null
  },
  actualArrival: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['requested', 'assigned', 'enroute', 'arrived', 'completed', 'cancelled'],
    default: 'requested'
  },
  cost: {
    type: Number,
    default: 0
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

const Ambulance = mongoose.model('Ambulance', ambulanceSchema);
const AmbulanceRequest = mongoose.model('AmbulanceRequest', ambulanceRequestSchema);

export { Ambulance, AmbulanceRequest };