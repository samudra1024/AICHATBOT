import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import {
  getAllDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
  getAllInsurance,
  createInsurance,
  updateInsurance,
  deleteInsurance,
  getAllAppointments,
  getAllUsers
} from '../controllers/adminController.js';

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// Doctor routes
router.get('/doctors', getAllDoctors);
router.post('/doctors', createDoctor);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

// Department routes
router.get('/departments', getAllDepartments);
router.post('/departments', createDepartment);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

// Health package routes
router.get('/packages', getAllPackages);
router.post('/packages', createPackage);
router.put('/packages/:id', updatePackage);
router.delete('/packages/:id', deletePackage);

// Insurance routes
router.get('/insurance', getAllInsurance);
router.post('/insurance', createInsurance);
router.put('/insurance/:id', updateInsurance);
router.delete('/insurance/:id', deleteInsurance);

// View appointments and users
router.get('/appointments', getAllAppointments);
router.get('/users', getAllUsers);

export default router;
