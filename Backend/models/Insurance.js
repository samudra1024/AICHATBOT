import mongoose from 'mongoose';

const insuranceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['TPA', 'Insurance', 'Government Scheme'],
    required: true
  },
  cashlessAvailable: {
    type: Boolean,
    default: true
  },
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  claimProcess: {
    type: String,
    default: ''
  },
  documentsRequired: {
    type: [String],
    default: []
  },
  active: {
    type: Boolean,
    default: true
  }
});

const Insurance = mongoose.model('Insurance', insuranceSchema);

export default Insurance;
