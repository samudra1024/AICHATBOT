import Doctor from '../models/Doctor.js';
import Department from '../models/Department.js';
import HealthPackage from '../models/HealthPackage.js';
import Insurance from '../models/Insurance.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

// ===== DOCTOR MANAGEMENT =====

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 });
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching doctors' });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating doctor' });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating doctor' });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting doctor' });
  }
};

// ===== DEPARTMENT MANAGEMENT =====

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.status(200).json({ success: true, departments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching departments' });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json({ success: true, department });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating department' });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.status(200).json({ success: true, department });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating department' });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.status(200).json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting department' });
  }
};

// ===== HEALTH PACKAGE MANAGEMENT =====

export const getAllPackages = async (req, res) => {
  try {
    const packages = await HealthPackage.find().sort({ name: 1 });
    res.status(200).json({ success: true, packages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching packages' });
  }
};

export const createPackage = async (req, res) => {
  try {
    const healthPackage = new HealthPackage(req.body);
    await healthPackage.save();
    res.status(201).json({ success: true, package: healthPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating package' });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const healthPackage = await HealthPackage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!healthPackage) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.status(200).json({ success: true, package: healthPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating package' });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const healthPackage = await HealthPackage.findByIdAndDelete(req.params.id);
    if (!healthPackage) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.status(200).json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting package' });
  }
};

// ===== INSURANCE MANAGEMENT =====

export const getAllInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.find().sort({ name: 1 });
    res.status(200).json({ success: true, insurance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching insurance' });
  }
};

export const createInsurance = async (req, res) => {
  try {
    const insurance = new Insurance(req.body);
    await insurance.save();
    res.status(201).json({ success: true, insurance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating insurance' });
  }
};

export const updateInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!insurance) {
      return res.status(404).json({ success: false, message: 'Insurance not found' });
    }
    res.status(200).json({ success: true, insurance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating insurance' });
  }
};

export const deleteInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findByIdAndDelete(req.params.id);
    if (!insurance) {
      return res.status(404).json({ success: false, message: 'Insurance not found' });
    }
    res.status(200).json({ success: true, message: 'Insurance deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting insurance' });
  }
};

// ===== APPOINTMENTS & USERS =====

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId doctorId')
      .sort({ date: -1 });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching appointments' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};
