import mongoose from 'mongoose';

const healthPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['package', 'test'],
    required: true
  },
  testsIncluded: {
    type: [String],
    default: []
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    default: '2-3 hours'
  },
  fasting: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['Diagnostic', 'Preventive', 'Specialized', 'Wellness'],
    default: 'Diagnostic'
  }
});

const HealthPackage = mongoose.model('HealthPackage', healthPackageSchema);

export default HealthPackage;
