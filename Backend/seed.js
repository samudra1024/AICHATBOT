import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from './models/Doctor.js';
import Department from './models/Department.js';
import HealthPackage from './models/HealthPackage.js';
import Insurance from './models/Insurance.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

// Sample doctors data
const doctors = [
  {
    name: 'Dr. Rajesh Kumar',
    department: 'Cardiology',
    specialization: 'Interventional Cardiology',
    qualification: 'MD, DM (Cardiology)',
    experience: 15,
    daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    timings: {
      morning: { start: '09:00 AM', end: '12:00 PM', available: true },
      afternoon: { start: '02:00 PM', end: '05:00 PM', available: true },
      evening: { start: '06:00 PM', end: '08:00 PM', available: false }
    },
    fees: { consultation: 800, followUp: 500 },
    maxPatientsPerSlot: 5
  },
  {
    name: 'Dr. Priya Sharma',
    department: 'Pediatrics',
    specialization: 'Child Health & Development',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: 10,
    daysAvailable: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
    timings: {
      morning: { start: '10:00 AM', end: '01:00 PM', available: true },
      afternoon: { start: '03:00 PM', end: '06:00 PM', available: false },
      evening: { start: '06:00 PM', end: '08:00 PM', available: true }
    },
    fees: { consultation: 600, followUp: 400 },
    maxPatientsPerSlot: 6
  },
  {
    name: 'Dr. Amit Patel',
    department: 'Orthopedics',
    specialization: 'Joint Replacement & Sports Medicine',
    qualification: 'MS (Orthopedics), DNB',
    experience: 12,
    daysAvailable: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    timings: {
      morning: { start: '08:00 AM', end: '11:00 AM', available: true },
      afternoon: { start: '02:00 PM', end: '05:00 PM', available: true },
      evening: { start: '05:00 PM', end: '07:00 PM', available: false }
    },
    fees: { consultation: 900, followUp: 600 },
    maxPatientsPerSlot: 4
  },
  {
    name: 'Dr. Sunita Reddy',
    department: 'Gynecology',
    specialization: 'Obstetrics & Gynecology',
    qualification: 'MBBS, MS (OBG)',
    experience: 18,
    daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timings: {
      morning: { start: '09:00 AM', end: '12:00 PM', available: true },
      afternoon: { start: '03:00 PM', end: '06:00 PM', available: true },
      evening: { start: '06:00 PM', end: '08:00 PM', available: false }
    },
    fees: { consultation: 700, followUp: 500 },
    maxPatientsPerSlot: 5
  },
  {
    name: 'Dr. Vikram Singh',
    department: 'Neurology',
    specialization: 'Stroke & Movement Disorders',
    qualification: 'MD, DM (Neurology)',
    experience: 14,
    daysAvailable: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    timings: {
      morning: { start: '10:00 AM', end: '01:00 PM', available: true },
      afternoon: { start: '02:00 PM', end: '05:00 PM', available: false },
      evening: { start: '05:00 PM', end: '07:00 PM', available: true }
    },
    fees: { consultation: 1000, followUp: 800 },
    maxPatientsPerSlot: 4
  },
  {
    name: 'Dr. Meera Krishnan',
    department: 'Dermatology',
    specialization: 'Cosmetic & Clinical Dermatology',
    qualification: 'MD (Dermatology)',
    experience: 8,
    daysAvailable: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timings: {
      morning: { start: '09:00 AM', end: '12:00 PM', available: true },
      afternoon: { start: '02:00 PM', end: '05:00 PM', available: true },
      evening: { start: '06:00 PM', end: '08:00 PM', available: true }
    },
    fees: { consultation: 650, followUp: 400 },
    maxPatientsPerSlot: 6
  },
  {
    name: 'Dr. Arjun Mehta',
    department: 'General Surgery',
    specialization: 'Laparoscopic & Bariatric Surgery',
    qualification: 'MS (General Surgery)',
    experience: 16,
    daysAvailable: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    timings: {
      morning: { start: '08:00 AM', end: '11:00 AM', available: true },
      afternoon: { start: '02:00 PM', end: '04:00 PM', available: true },
      evening: { start: '05:00 PM', end: '07:00 PM', available: false }
    },
    fees: { consultation: 850, followUp: 550 },
    maxPatientsPerSlot: 4
  },
  {
    name: 'Dr. Kavita Desai',
    department: 'Ophthalmology',
    specialization: 'Cataract & Refractive Surgery',
    qualification: 'MS (Ophthalmology)',
    experience: 11,
    daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    timings: {
      morning: { start: '09:00 AM', end: '12:00 PM', available: true },
      afternoon: { start: '03:00 PM', end: '06:00 PM', available: true },
      evening: { start: '06:00 PM', end: '08:00 PM', available: false }
    },
    fees: { consultation: 700, followUp: 450 },
    maxPatientsPerSlot: 5
  },
  {
    name: 'Dr. Ramesh Iyer',
    department: 'ENT',
    specialization: 'Ear, Nose & Throat Surgery',
    qualification: 'MS (ENT)',
    experience: 13,
    daysAvailable: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    timings: {
      morning: { start: '10:00 AM', end: '01:00 PM', available: true },
      afternoon: { start: '02:00 PM', end: '05:00 PM', available: true },
      evening: { start: '05:00 PM', end: '07:00 PM', available: false }
    },
    fees: { consultation: 750, followUp: 500 },
    maxPatientsPerSlot: 5
  },
  {
    name: 'Dr. Anjali Nair',
    department: 'Psychiatry',
    specialization: 'Adult & Child Psychiatry',
    qualification: 'MD (Psychiatry)',
    experience: 9,
    daysAvailable: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    timings: {
      morning: { start: '10:00 AM', end: '01:00 PM', available: true },
      afternoon: { start: '03:00 PM', end: '06:00 PM', available: true },
      evening: { start: '06:00 PM', end: '08:00 PM', available: true }
    },
    fees: { consultation: 800, followUp: 600 },
    maxPatientsPerSlot: 4
  },
  {
    name: 'Dr. Sanjay Gupta',
    department: 'Radiology',
    specialization: 'Diagnostic Imaging',
    qualification: 'MD (Radiology)',
    experience: 12,
    daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timings: {
      morning: { start: '08:00 AM', end: '12:00 PM', available: true },
      afternoon: { start: '01:00 PM', end: '05:00 PM', available: true },
      evening: { start: '05:00 PM', end: '07:00 PM', available: false }
    },
    fees: { consultation: 500, followUp: 300 },
    maxPatientsPerSlot: 8
  }
];

// Sample departments
const departments = [
  {
    name: 'Cardiology',
    description: 'Comprehensive cardiac care including diagnostics, interventions, and rehabilitation',
    services: ['ECG', 'Echocardiography', 'Angiography', 'Pacemaker Implantation', 'Cardiac Rehabilitation'],
    opdTimings: {
      weekdays: { start: '08:00 AM', end: '08:00 PM' },
      saturday: { start: '09:00 AM', end: '05:00 PM' },
      sunday: { start: '10:00 AM', end: '02:00 PM' }
    },
    headOfDepartment: 'Dr. Rajesh Kumar',
    contactExtension: '2301',
    floor: '3rd Floor, Block A'
  },
  {
    name: 'Pediatrics',
    description: 'Complete child healthcare from newborn to adolescent',
    services: ['Vaccination', 'Growth Monitoring', 'Pediatric ICU', 'Neonatal Care', 'Child Development'],
    opdTimings: {
      weekdays: { start: '09:00 AM', end: '08:00 PM' },
      saturday: { start: '10:00 AM', end: '06:00 PM' },
      sunday: { start: '10:00 AM', end: '01:00 PM' }
    },
    headOfDepartment: 'Dr. Priya Sharma',
    contactExtension: '2302',
    floor: '2nd Floor, Block B'
  },
  {
    name: 'Orthopedics',
    description: 'Treatment of bone, joint, and musculoskeletal disorders',
    services: ['Joint Replacement', 'Arthroscopy', 'Fracture Management', 'Sports Medicine', 'Spine Surgery'],
    opdTimings: {
      weekdays: { start: '08:00 AM', end: '07:00 PM' },
      saturday: { start: '08:00 AM', end: '05:00 PM' },
      sunday: { start: 'Closed', end: 'Closed' }
    },
    headOfDepartment: 'Dr. Amit Patel',
    contactExtension: '2303',
    floor: '4th Floor, Block A'
  },
  {
    name: 'Gynecology',
    description: 'Women\'s health and maternity services',
    services: ['Prenatal Care', 'Normal & C-Section Delivery', 'Gynecological Surgery', 'Infertility Treatment', 'Menopause Management'],
    opdTimings: {
      weekdays: { start: '09:00 AM', end: '08:00 PM' },
      saturday: { start: '09:00 AM', end: '06:00 PM' },
      sunday: { start: '10:00 AM', end: '02:00 PM' }
    },
    headOfDepartment: 'Dr. Sunita Reddy',
    contactExtension: '2304',
    floor: '5th Floor, Block B'
  },
  {
    name: 'Neurology',
    description: 'Diagnosis and treatment of nervous system disorders',
    services: ['Stroke Care', 'Epilepsy Management', 'Movement Disorders', 'Headache Clinic', 'Neuro Rehabilitation'],
    opdTimings: {
      weekdays: { start: '10:00 AM', end: '07:00 PM' },
      saturday: { start: '10:00 AM', end: '05:00 PM' },
      sunday: { start: 'Closed', end: 'Closed' }
    },
    headOfDepartment: 'Dr. Vikram Singh',
    contactExtension: '2305',
    floor: '3rd Floor, Block B'
  },
  {
    name: 'Dermatology',
    description: 'Diagnosis and treatment of skin, hair, and nail conditions',
    services: ['Acne Treatment', 'Laser Therapy', 'Skin Biopsy', 'Hair Loss Treatment', 'Cosmetic Procedures'],
    opdTimings: {
      weekdays: { start: '09:00 AM', end: '06:00 PM' },
      saturday: { start: '09:00 AM', end: '04:00 PM' },
      sunday: { start: 'Closed', end: 'Closed' }
    },
    headOfDepartment: 'Dr. Meera Krishnan',
    contactExtension: '2306',
    floor: '2nd Floor, Block A'
  },
  {
    name: 'General Surgery',
    description: 'Surgical treatment for abdominal contents and other general conditions',
    services: ['Appendectomy', 'Hernia Repair', 'Gallbladder Surgery', 'Trauma Surgery', 'Endoscopy'],
    opdTimings: {
      weekdays: { start: '08:00 AM', end: '08:00 PM' },
      saturday: { start: '09:00 AM', end: '05:00 PM' },
      sunday: { start: 'Closed', end: 'Closed' }
    },
    headOfDepartment: 'Dr. Arjun Mehta',
    contactExtension: '2307',
    floor: '1st Floor, Block A'
  },
  {
    name: 'Ophthalmology',
    description: 'Diagnosis and treatment of eye disorders',
    services: ['Vision Testing', 'Cataract Surgery', 'Glaucoma Treatment', 'Retina Services', 'Lasik'],
    opdTimings: {
      weekdays: { start: '09:00 AM', end: '06:00 PM' },
      saturday: { start: '09:00 AM', end: '04:00 PM' },
      sunday: { start: 'Closed', end: 'Closed' }
    },
    headOfDepartment: 'Dr. Kavita Desai',
    contactExtension: '2308',
    floor: '1st Floor, Block B'
  },
  {
    name: 'ENT',
    description: 'Ear, Nose, and Throat care',
    services: ['Hearing Tests', 'Sinus Surgery', 'Tonsillectomy', 'Voice Disorders', 'Sleep Apnea'],
    opdTimings: {
      weekdays: { start: '09:00 AM', end: '07:00 PM' },
      saturday: { start: '10:00 AM', end: '05:00 PM' },
      sunday: { start: 'Closed', end: 'Closed' }
    },
    headOfDepartment: 'Dr. Ramesh Iyer',
    contactExtension: '2309',
    floor: '2nd Floor, Block A'
  },
  {
    name: 'Psychiatry',
    description: 'Mental health diagnosis and treatment',
    services: ['Counseling', 'Psychotherapy', 'Addiction Treatment', 'Mood Disorders', 'Child Psychiatry'],
    opdTimings: {
      weekdays: { start: '10:00 AM', end: '06:00 PM' },
      saturday: { start: '10:00 AM', end: '04:00 PM' },
      sunday: { start: 'Closed', end: 'Closed' }
    },
    headOfDepartment: 'Dr. Anjali Nair',
    contactExtension: '2310',
    floor: '4th Floor, Block B'
  },
  {
    name: 'Radiology',
    description: 'Medical imaging services',
    services: ['X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'Mammography'],
    opdTimings: {
      weekdays: { start: '24 Hours', end: '24 Hours' },
      saturday: { start: '24 Hours', end: '24 Hours' },
      sunday: { start: '24 Hours', end: '24 Hours' }
    },
    headOfDepartment: 'Dr. Sanjay Gupta',
    contactExtension: '2311',
    floor: 'Ground Floor, Block A'
  }
];

// Sample health packages
const healthPackages = [
  {
    name: 'Basic Health Checkup',
    description: 'Comprehensive basic health screening package',
    type: 'package',
    testsIncluded: ['Complete Blood Count', 'Blood Sugar', 'Lipid Profile', 'Kidney Function Test', 'Liver Function Test'],
    price: 1500,
    duration: '2-3 hours',
    fasting: true,
    category: 'Preventive'
  },
  {
    name: 'Cardiac Health Package',
    description: 'Complete heart health assessment',
    type: 'package',
    testsIncluded: ['ECG', 'Echocardiography', 'Lipid Profile', 'Cardiac Enzymes', 'Stress Test'],
    price: 3500,
    duration: '3-4 hours',
    fasting: true,
    category: 'Specialized'
  },
  {
    name: 'Diabetes Screening',
    description: 'Comprehensive diabetes check',
    type: 'package',
    testsIncluded: ['Fasting Blood Sugar', 'HbA1c', 'Post Prandial Sugar', 'Kidney Function', 'Lipid Profile'],
    price: 1200,
    duration: '2 hours',
    fasting: true,
    category: 'Specialized'
  },
  {
    name: 'Complete Blood Count (CBC)',
    description: 'Basic blood test',
    type: 'test',
    testsIncluded: ['Hemoglobin', 'WBC Count', 'Platelet Count', 'RBC Count'],
    price: 300,
    duration: '1 hour',
    fasting: false,
    category: 'Diagnostic'
  },
  {
    name: 'Thyroid Profile',
    description: 'Complete thyroid function test',
    type: 'test',
    testsIncluded: ['T3', 'T4', 'TSH'],
    price: 600,
    duration: '1-2 hours',
    fasting: false,
    category: 'Diagnostic'
  },
  {
    name: 'Vitamin D Test',
    description: 'Vitamin D level assessment',
    type: 'test',
    testsIncluded: ['25-OH Vitamin D'],
    price: 800,
    duration: '1 hour',
    fasting: false,
    category: 'Diagnostic'
  },
  {
    name: 'Women Wellness Package',
    description: 'Comprehensive health package for women',
    type: 'package',
    testsIncluded: ['CBC', 'Thyroid Profile', 'Vitamin D', 'Calcium', 'Iron Studies', 'Pap Smear', 'Mammography'],
    price: 4500,
    duration: '3-4 hours',
    fasting: true,
    category: 'Wellness'
  }
];

// Sample insurance providers
const insuranceProviders = [
  {
    name: 'ICICI Lombard',
    type: 'TPA',
    cashlessAvailable: true,
    contactInfo: {
      phone: '+91-1800-266-7780',
      email: 'support@icicilombard.com',
      website: 'www.icicilombard.com'
    },
    claimProcess: 'Submit pre-authorization form 48 hours before planned admission',
    documentsRequired: ['Policy Copy', 'ID Proof', 'Medical Reports', 'Prescription'],
    active: true
  },
  {
    name: 'Star Health Insurance',
    type: 'Insurance',
    cashlessAvailable: true,
    contactInfo: {
      phone: '+91-44-2858-5858',
      email: 'claims@starhealth.in',
      website: 'www.starhealth.in'
    },
    claimProcess: 'Online pre-authorization through hospital desk',
    documentsRequired: ['Health Card', 'ID Proof', 'Admission Advice'],
    active: true
  },
  {
    name: 'Medi Assist',
    type: 'TPA',
    cashlessAvailable: true,
    contactInfo: {
      phone: '+91-80-2572-0000',
      email: 'customercare@mediassist.in',
      website: 'www.mediassist.in'
    },
    claimProcess: 'Contact TPA helpline for pre-authorization',
    documentsRequired: ['TPA Card', 'ID Proof', 'Doctor Prescription'],
    active: true
  },
  {
    name: 'Ayushman Bharat',
    type: 'Government Scheme',
    cashlessAvailable: true,
    contactInfo: {
      phone: '14555',
      email: 'support@pmjay.gov.in',
      website: 'pmjay.gov.in'
    },
    claimProcess: 'Show Ayushman card at admission desk',
    documentsRequired: ['Ayushman Card', 'Aadhaar Card', 'Family ID'],
    active: true
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Doctor.deleteMany({});
    await Department.deleteMany({});
    await HealthPackage.deleteMany({});
    await Insurance.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert doctors
    const insertedDoctors = await Doctor.insertMany(doctors);
    console.log(`✅ Inserted ${insertedDoctors.length} doctors`);

    // Insert departments
    const insertedDepartments = await Department.insertMany(departments);
    console.log(`✅ Inserted ${insertedDepartments.length} departments`);

    // Insert health packages
    const insertedPackages = await HealthPackage.insertMany(healthPackages);
    console.log(`✅ Inserted ${insertedPackages.length} health packages`);

    // Insert insurance providers
    const insertedInsurance = await Insurance.insertMany(insuranceProviders);
    console.log(`✅ Inserted ${insertedInsurance.length} insurance providers`);

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@medibot.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'Admin',
        email: 'admin@medibot.com',
        password: hashedPassword,
        mobile: '9999999999',
        isAdmin: true
      });
      await admin.save();
      console.log('✅ Created admin user (Email: admin@medibot.com, Password: admin123)');
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Doctors: ${insertedDoctors.length}`);
    console.log(`   - Departments: ${insertedDepartments.length}`);
    console.log(`   - Health Packages: ${insertedPackages.length}`);
    console.log(`   - Insurance Providers: ${insertedInsurance.length}`);
    console.log('\n👤 Admin Login:');
    console.log('   Email: admin@medibot.com');
    console.log('   Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
