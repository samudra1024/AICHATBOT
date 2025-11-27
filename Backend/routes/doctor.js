import express from 'express';
import {
  searchDoctors,
  getDoctorById,
  getDoctorsByDepartment,
  getDoctorAvailability,
  getAllDepartments
} from '../controllers/doctorController.js';

const router = express.Router();

// Search doctors (public)
router.get('/search', searchDoctors);

// Get all departments
router.get('/departments', getAllDepartments);

// Get doctor by ID
router.get('/:id', getDoctorById);

// Get doctors by department
router.get('/department/:department', getDoctorsByDepartment);

// Get doctor availability
router.get('/:id/availability', getDoctorAvailability);

export default router;
