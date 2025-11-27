import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  services: {
    type: [String],
    default: []
  },
  opdTimings: {
    weekdays: {
      start: String,
      end: String
    },
    saturday: {
      start: String,
      end: String
    },
    sunday: {
      start: String,
      end: String
    }
  },
  headOfDepartment: {
    type: String,
    default: ''
  },
  contactExtension: {
    type: String,
    default: ''
  },
  floor: {
    type: String,
    default: ''
  }
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;
