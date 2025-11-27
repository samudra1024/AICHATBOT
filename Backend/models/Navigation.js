import mongoose from 'mongoose';

const navigationSchema = new mongoose.Schema({
  floor: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  directions: {
    type: String,
    required: true
  },
  landmarks: [{
    type: String
  }],
  facilities: [{
    type: String
  }],
  wheelchairAccessible: {
    type: Boolean,
    default: true
  },
  estimatedWalkTime: {
    type: String,
    required: true
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

const Navigation = mongoose.model('Navigation', navigationSchema);
export default Navigation;