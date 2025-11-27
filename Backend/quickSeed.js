import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';

dotenv.config();

const quickSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@hospital.com',
      mobile: '9999999999',
      password: hashedPassword,
      isAdmin: true,
      language: 'English',
      uhid: 'ADMIN001'
    });
    await adminUser.save();

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      mobile: '9876543210',
      password: await bcrypt.hash('test123', 10),
      language: 'English',
      uhid: 'TEST001'
    });
    await testUser.save();

    // Create doctors
    const doctors = [
      {
        name: 'Dr. Amit Patel',
        department: 'Orthopedics',
        specialization: 'Joint Replacement Surgery',
        qualification: 'MBBS, MS Orthopedics',
        experience: 18,
        daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timings: {
          morning: { start: '08:00', end: '11:00', available: true },
          afternoon: { start: '13:00', end: '16:00', available: true },
          evening: { start: '17:00', end: '19:00', available: false }
        },
        fees: { consultation: 700, followUp: 400 },
        maxPatientsPerSlot: 10
      },
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
      }
    ];

    await Doctor.insertMany(doctors);

    console.log('✅ Quick seed completed!');
    console.log('- Admin user created (mobile: 9999999999, password: admin123)');
    console.log('- Test user created (mobile: 9876543210, password: test123)');
    console.log('- 2 doctors created');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

quickSeed();