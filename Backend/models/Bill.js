import mongoose from 'mongoose';

const billEstimateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  services: [{
    name: String,
    type: {
      type: String,
      enum: ['consultation', 'test', 'procedure', 'medicine', 'room']
    },
    quantity: {
      type: Number,
      default: 1
    },
    unitPrice: Number,
    totalPrice: Number
  }],
  subtotal: {
    type: Number,
    required: true
  },
  taxes: {
    cgst: Number,
    sgst: Number,
    total: Number
  },
  discount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  insuranceCovered: {
    type: Number,
    default: 0
  },
  payableAmount: {
    type: Number,
    required: true
  },
  estimateDate: {
    type: Date,
    default: Date.now
  },
  validTill: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'approved', 'expired'],
    default: 'draft'
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

const BillEstimate = mongoose.model('BillEstimate', billEstimateSchema);
export default BillEstimate;