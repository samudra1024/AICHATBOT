import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Import all models
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import Department from './models/Department.js';
import HealthPackage from './models/HealthPackage.js';
import Insurance from './models/Insurance.js';
import Medicine from './models/Medicine.js';
import { Vaccination } from './models/Vaccination.js';
import { BloodBank } from './models/BloodBank.js';
import Navigation from './models/Navigation.js';
import { Ambulance } from './models/Ambulance.js';
import LabReport from './models/LabReport.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Department.deleteMany({});
    await HealthPackage.deleteMany({});
    await Insurance.deleteMany({});
    await Medicine.deleteMany({});
    await Vaccination.deleteMany({});
    await BloodBank.deleteMany({});
    await Navigation.deleteMany({});
    await Ambulance.deleteMany({});
    await LabReport.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@hospital.com',
      mobile: '9999999999',
      password: hashedPassword,
      isAdmin: true,
      language: 'English'
    });
    await adminUser.save();

    // Create departments
    const departments = [
      {
        name: 'Cardiology',
        description: 'Heart and cardiovascular system care',
        services: ['ECG', 'Echocardiogram', 'Cardiac Catheterization', 'Angioplasty'],
        headOfDepartment: 'Dr. Rajesh Kumar',
        location: 'Floor 2, Wing A',
        contactNumber: '+91-80-12345678',
        emergencyAvailable: true
      },
      {
        name: 'Neurology',
        description: 'Brain and nervous system disorders',
        services: ['EEG', 'MRI Brain', 'Stroke Care', 'Epilepsy Treatment'],
        headOfDepartment: 'Dr. Priya Sharma',
        location: 'Floor 3, Wing B',
        contactNumber: '+91-80-12345679',
        emergencyAvailable: true
      },
      {
        name: 'Orthopedics',
        description: 'Bone, joint, and muscle care',
        services: ['X-Ray', 'Joint Replacement', 'Fracture Treatment', 'Physiotherapy'],
        headOfDepartment: 'Dr. Amit Patel',
        location: 'Floor 1, Wing C',
        contactNumber: '+91-80-12345680',
        emergencyAvailable: false
      },
      {
        name: 'Pediatrics',
        description: 'Child healthcare and development',
        services: ['Vaccination', 'Growth Monitoring', 'Child Psychology', 'Neonatal Care'],
        headOfDepartment: 'Dr. Sunita Reddy',
        location: 'Floor 2, Wing C',
        contactNumber: '+91-80-12345681',
        emergencyAvailable: true
      },
      {
        name: 'General Medicine',
        description: 'Primary healthcare and general medical conditions',
        services: ['Health Checkup', 'Diabetes Care', 'Hypertension Management', 'Fever Treatment'],
        headOfDepartment: 'Dr. Ravi Gupta',
        location: 'Floor 1, Wing A',
        contactNumber: '+91-80-12345682',
        emergencyAvailable: true
      }
    ];

    await Department.insertMany(departments);

    // Create doctors
    const doctors = [
      {
        name: 'Dr. Rajesh Kumar',
        department: 'Cardiology',
        specialization: 'Interventional Cardiology',
        qualification: 'MBBS, MD, DM Cardiology',
        experience: 15,
        daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timings: {
          morning: { start: '09:00', end: '12:00', available: true },
          afternoon: { start: '14:00', end: '17:00', available: true },
          evening: { start: '18:00', end: '20:00', available: false }
        },
        fees: { consultation: 800, followUp: 500 },
        maxPatientsPerSlot: 8
      },
      {
        name: 'Dr. Priya Sharma',
        department: 'Neurology',
        specialization: 'Stroke and Epilepsy',
        qualification: 'MBBS, MD, DM Neurology',
        experience: 12,
        daysAvailable: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        timings: {
          morning: { start: '10:00', end: '13:00', available: true },
          afternoon: { start: '15:00', end: '18:00', available: true },
          evening: { start: '19:00', end: '21:00', available: false }
        },
        fees: { consultation: 900, followUp: 600 },
        maxPatientsPerSlot: 6
      },
      {
        name: 'Dr. Amit Patel',
        department: 'Orthopedics',
        specialization: 'Joint Replacement Surgery',
        qualification: 'MBBS, MS Orthopedics',
        experience: 18,
        daysAvailable: ['Tuesday', 'Thursday', 'Saturday'],
        timings: {
          morning: { start: '08:00', end: '11:00', available: true },
          afternoon: { start: '16:00', end: '19:00', available: true },
          evening: { start: '20:00', end: '22:00', available: false }
        },
        fees: { consultation: 700, followUp: 400 },
        maxPatientsPerSlot: 10
      },
      {
        name: 'Dr. Sunita Reddy',
        department: 'Pediatrics',
        specialization: 'Child Development',
        qualification: 'MBBS, MD Pediatrics',
        experience: 10,
        daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        timings: {
          morning: { start: '09:00', end: '12:00', available: true },
          afternoon: { start: '14:00', end: '17:00', available: true },
          evening: { start: '18:00', end: '20:00', available: true }
        },
        fees: { consultation: 600, followUp: 350 },
        maxPatientsPerSlot: 12
      },
      {
        name: 'Dr. Ravi Gupta',
        department: 'General Medicine',
        specialization: 'Internal Medicine',
        qualification: 'MBBS, MD Internal Medicine',
        experience: 8,
        daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timings: {
          morning: { start: '08:30', end: '11:30', available: true },
          afternoon: { start: '13:00', end: '16:00', available: true },
          evening: { start: '17:00', end: '19:00', available: true }
        },
        fees: { consultation: 500, followUp: 300 },
        maxPatientsPerSlot: 15
      }
    ];

    await Doctor.insertMany(doctors);

    // Create health packages
    const healthPackages = [
      {
        name: 'Master Health Checkup',
        description: 'Comprehensive health screening for adults',
        tests: ['Complete Blood Count', 'Lipid Profile', 'Liver Function Test', 'Kidney Function Test', 'Thyroid Profile', 'ECG', 'Chest X-Ray', 'Ultrasound Abdomen'],
        price: 3500,
        duration: '4-6 hours',
        fasting: true,
        ageGroup: '18-65 years',
        category: 'preventive'
      },
      {
        name: 'Cardiac Health Package',
        description: 'Heart health assessment',
        tests: ['ECG', 'Echocardiogram', 'Stress Test', 'Lipid Profile', 'Cardiac Enzymes'],
        price: 2800,
        duration: '3-4 hours',
        fasting: true,
        ageGroup: '35+ years',
        category: 'cardiac'
      },
      {
        name: 'Diabetes Care Package',
        description: 'Comprehensive diabetes monitoring',
        tests: ['HbA1c', 'Fasting Glucose', 'Post Meal Glucose', 'Kidney Function', 'Eye Examination', 'Foot Examination'],
        price: 2200,
        duration: '2-3 hours',
        fasting: true,
        ageGroup: 'All ages',
        category: 'diabetes'
      }
    ];

    await HealthPackage.insertMany(healthPackages);

    // Create insurance providers
    const insuranceProviders = [
      {
        name: 'ICICI Lombard',
        type: 'Private',
        cashlessAvailable: true,
        tpaName: 'Medi Assist',
        contactNumber: '+91-80-66778899',
        emergencyCoverage: true,
        preAuthRequired: true,
        active: true
      },
      {
        name: 'Star Health Insurance',
        type: 'Private',
        cashlessAvailable: true,
        tpaName: 'Star Health TPA',
        contactNumber: '+91-80-44556677',
        emergencyCoverage: true,
        preAuthRequired: true,
        active: true
      },
      {
        name: 'CGHS',
        type: 'Government',
        cashlessAvailable: true,
        tpaName: 'CGHS',
        contactNumber: '+91-80-22334455',
        emergencyCoverage: true,
        preAuthRequired: false,
        active: true
      }
    ];

    await Insurance.insertMany(insuranceProviders);

    // Create medicines
    const medicines = [
      {
        name: 'Paracetamol 500mg',
        genericName: 'Paracetamol',
        manufacturer: 'Cipla',
        category: 'Analgesic',
        strength: '500mg',
        form: 'tablet',
        price: 25,
        stock: 500,
        prescription: false,
        homeDelivery: true,
        deliveryTime: '2-4 hours'
      },
      {
        name: 'Amoxicillin 250mg',
        genericName: 'Amoxicillin',
        manufacturer: 'Sun Pharma',
        category: 'Antibiotic',
        strength: '250mg',
        form: 'capsule',
        price: 85,
        stock: 200,
        prescription: true,
        homeDelivery: true,
        deliveryTime: '2-4 hours'
      },
      {
        name: 'Insulin Glargine',
        genericName: 'Insulin Glargine',
        manufacturer: 'Sanofi',
        category: 'Antidiabetic',
        strength: '100 IU/ml',
        form: 'injection',
        price: 450,
        stock: 50,
        prescription: true,
        homeDelivery: false,
        deliveryTime: 'Pickup only'
      }
    ];

    await Medicine.insertMany(medicines);

    // Create vaccinations
    const vaccinations = [
      {
        name: 'COVID-19 Vaccine (Covishield)',
        type: 'covid',
        ageGroup: '18+ years',
        doses: 2,
        interval: '84 days',
        price: 250,
        availability: true,
        description: 'Protection against COVID-19',
        sideEffects: 'Mild fever, pain at injection site',
        precautions: 'Avoid if allergic to vaccine components'
      },
      {
        name: 'Influenza Vaccine',
        type: 'flu',
        ageGroup: '6 months+',
        doses: 1,
        interval: 'Annual',
        price: 800,
        availability: true,
        description: 'Annual flu protection',
        sideEffects: 'Mild soreness at injection site',
        precautions: 'Not for egg allergy patients'
      },
      {
        name: 'Hepatitis B Vaccine',
        type: 'adult',
        ageGroup: 'All ages',
        doses: 3,
        interval: '0, 1, 6 months',
        price: 350,
        availability: true,
        description: 'Protection against Hepatitis B',
        sideEffects: 'Mild fever, injection site pain',
        precautions: 'Inform about pregnancy'
      }
    ];

    await Vaccination.insertMany(vaccinations);

    // Create blood bank inventory
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const bloodBankData = bloodGroups.map(group => ({
      bloodGroup: group,
      unitsAvailable: Math.floor(Math.random() * 20) + 5,
      expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
      donorInfo: {
        donorId: `D${Math.floor(Math.random() * 10000)}`,
        donationDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        screeningStatus: 'cleared'
      },
      status: 'available'
    }));

    await BloodBank.insertMany(bloodBankData);

    // Create navigation data
    const navigationData = [
      {
        floor: 'Ground Floor',
        department: 'Reception & Registration',
        roomNumber: 'G-001',
        directions: 'Enter main entrance, reception desk is directly ahead',
        landmarks: ['Main entrance', 'Information desk', 'Pharmacy'],
        facilities: ['Wheelchair access', 'Restrooms', 'ATM'],
        wheelchairAccessible: true,
        estimatedWalkTime: '1 minute'
      },
      {
        floor: 'Ground Floor',
        department: 'Emergency Department',
        roomNumber: 'G-100',
        directions: 'From main entrance, turn right and follow red emergency signs',
        landmarks: ['Ambulance bay', 'Trauma center sign'],
        facilities: ['24x7 access', 'Ambulance parking'],
        wheelchairAccessible: true,
        estimatedWalkTime: '2 minutes'
      },
      {
        floor: 'First Floor',
        department: 'General Medicine',
        roomNumber: '1-A-201',
        directions: 'Take elevator to 1st floor, turn left from elevator, Wing A',
        landmarks: ['Elevator bank', 'Wing A sign', 'Nursing station'],
        facilities: ['Waiting area', 'Water dispenser'],
        wheelchairAccessible: true,
        estimatedWalkTime: '3 minutes'
      },
      {
        floor: 'Second Floor',
        department: 'Cardiology',
        roomNumber: '2-A-301',
        directions: 'Take elevator to 2nd floor, Wing A, follow cardiology signs',
        landmarks: ['ECG room', 'Cardiac care unit'],
        facilities: ['Specialized waiting area', 'Heart health education center'],
        wheelchairAccessible: true,
        estimatedWalkTime: '4 minutes'
      }
    ];

    await Navigation.insertMany(navigationData);

    // Create ambulance fleet
    const ambulances = [
      {
        vehicleNumber: 'KA-01-AB-1234',
        type: 'advanced',
        equipment: ['Defibrillator', 'Ventilator', 'Cardiac Monitor', 'Oxygen Cylinder'],
        driverName: 'Ravi Kumar',
        driverPhone: '9876543210',
        paramedicName: 'Nurse Priya',
        paramedicPhone: '9876543211',
        status: 'available',
        currentLocation: {
          latitude: 12.9716,
          longitude: 77.5946,
          address: 'Sunrise Hospital, Bangalore'
        }
      },
      {
        vehicleNumber: 'KA-01-CD-5678',
        type: 'basic',
        equipment: ['First Aid Kit', 'Oxygen Cylinder', 'Stretcher'],
        driverName: 'Suresh Reddy',
        driverPhone: '9876543212',
        status: 'available',
        currentLocation: {
          latitude: 12.9716,
          longitude: 77.5946,
          address: 'Sunrise Hospital, Bangalore'
        }
      }
    ];

    await Ambulance.insertMany(ambulances);

    console.log('✅ Enhanced database seeded successfully!');
    console.log('📊 Data created:');
    console.log(`- ${departments.length} Departments`);
    console.log(`- ${doctors.length} Doctors`);
    console.log(`- ${healthPackages.length} Health Packages`);
    console.log(`- ${insuranceProviders.length} Insurance Providers`);
    console.log(`- ${medicines.length} Medicines`);
    console.log(`- ${vaccinations.length} Vaccinations`);
    console.log(`- ${bloodBankData.length} Blood Bank Entries`);
    console.log(`- ${navigationData.length} Navigation Points`);
    console.log(`- ${ambulances.length} Ambulances`);
    console.log('- 1 Admin User (mobile: 9999999999, password: admin123)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase();