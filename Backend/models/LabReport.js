import mongoose from 'mongoose';

const labReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportId: {
    type: String,
    required: true,
    unique: true
  },
  patientName: {
    type: String,
    required: true
  },
  testName: {
    type: String,
    required: true
  },
  testDate: {
    type: Date,
    required: true
  },
  reportDate: {
    type: Date,
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'ready', 'downloaded'],
    default: 'pending'
  },
  reportUrl: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    default: null
  },
  otpExpiry: {
    type: Date,
    default: null
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const LabReport = mongoose.model('LabReport', labReportSchema);
export default LabReport;