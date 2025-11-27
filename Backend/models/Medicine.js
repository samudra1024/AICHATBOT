import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  genericName: {
    type: String,
    required: true,
    trim: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  strength: {
    type: String,
    required: true
  },
  form: {
    type: String,
    enum: ['tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops', 'inhaler'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  prescription: {
    type: Boolean,
    default: true
  },
  homeDelivery: {
    type: Boolean,
    default: true
  },
  deliveryTime: {
    type: String,
    default: '2-4 hours'
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

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;