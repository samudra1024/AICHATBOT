import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

// Search doctors
export const searchDoctors = async (req, res) => {
  try {
    const { name, department, day } = req.query;

    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }

    if (day) {
      query.daysAvailable = day;
    }

    const doctors = await Doctor.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });

  } catch (error) {
    console.error('Search doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching doctors'
    });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      doctor
    });

  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor details'
    });
  }
};

// Get doctors by department
export const getDoctorsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    const doctors = await Doctor.find({
      department: { $regex: department, $options: 'i' }
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });

  } catch (error) {
    console.error('Get doctors by department error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors'
    });
  }
};

// Get doctor availability
export const getDoctorAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const checkDate = date ? new Date(date) : new Date();
    const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Check if doctor is available on this day
    const isAvailable = doctor.daysAvailable.includes(dayName);

    if (!isAvailable) {
      return res.status(200).json({
        success: true,
        available: false,
        message: `Dr. ${doctor.name} is not available on ${dayName}`,
        doctor
      });
    }

    // Get booked slots for this date
    const appointments = await Appointment.find({
      doctorId: id,
      date: {
        $gte: new Date(checkDate.setHours(0, 0, 0, 0)),
        $lt: new Date(checkDate.setHours(23, 59, 59, 999))
      },
      status: 'scheduled'
    });

    // Count appointments per slot
    const slotCounts = {
      morning: 0,
      afternoon: 0,
      evening: 0
    };

    appointments.forEach(apt => {
      slotCounts[apt.slot]++;
    });

    // Calculate available slots
    const availableSlots = {
      morning: {
        ...doctor.timings.morning,
        available: doctor.timings.morning.available && slotCounts.morning < doctor.maxPatientsPerSlot,
        slotsLeft: doctor.maxPatientsPerSlot - slotCounts.morning
      },
      afternoon: {
        ...doctor.timings.afternoon,
        available: doctor.timings.afternoon.available && slotCounts.afternoon < doctor.maxPatientsPerSlot,
        slotsLeft: doctor.maxPatientsPerSlot - slotCounts.afternoon
      },
      evening: {
        ...doctor.timings.evening,
        available: doctor.timings.evening.available && slotCounts.evening < doctor.maxPatientsPerSlot,
        slotsLeft: doctor.maxPatientsPerSlot - slotCounts.evening
      }
    };

    res.status(200).json({
      success: true,
      available: true,
      doctor,
      date: checkDate,
      day: dayName,
      slots: availableSlots
    });

  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking availability'
    });
  }
};

// Get all departments (unique)
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Doctor.distinct('department');

    res.status(200).json({
      success: true,
      departments: departments.sort()
    });

  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching departments'
    });
  }
};
