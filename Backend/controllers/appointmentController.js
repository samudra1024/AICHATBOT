import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

// Book appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, slot, time, patientName, notes } = req.body;
    const userId = req.userId;

    // Validation
    if (!doctorId || !date || !slot || !time || !patientName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if slot is available
    const appointmentDate = new Date(date);
    const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });

    if (!doctor.daysAvailable.includes(dayName)) {
      return res.status(400).json({
        success: false,
        message: `Dr. ${doctor.name} is not available on ${dayName}`
      });
    }

    // Check slot availability
    if (!doctor.timings[slot] || !doctor.timings[slot].available) {
      return res.status(400).json({
        success: false,
        message: `${slot} slot is not available for this doctor`
      });
    }

    // Check if slot is full
    const existingAppointments = await Appointment.countDocuments({
      doctorId,
      date: appointmentDate,
      slot,
      status: 'scheduled'
    });

    if (existingAppointments >= doctor.maxPatientsPerSlot) {
      return res.status(400).json({
        success: false,
        message: 'This slot is fully booked. Please choose another time.'
      });
    }

    // Generate token number
    const tokenNumber = existingAppointments + 1;
    
    // Calculate estimated wait time (15 minutes per patient)
    const estimatedWaitTime = (tokenNumber - 1) * 15;

    // Create appointment
    const appointment = new Appointment({
      userId,
      doctorId,
      patientName,
      date: appointmentDate,
      slot,
      time,
      notes: notes || '',
      status: 'scheduled',
      tokenNumber,
      queuePosition: tokenNumber,
      estimatedWaitTime
    });

    await appointment.save();

    // Populate doctor details
    await appointment.populate('doctorId');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });

  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking appointment'
    });
  }
};

// Get user appointments
export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.userId;

    const appointments = await Appointment.find({ userId })
      .populate('doctorId')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      appointments
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments'
    });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.userId;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled'
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment
    });

  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment'
    });
  }
};

// Get wait time for appointment
export const getWaitTime = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.userId;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId,
      status: 'scheduled'
    }).populate('doctorId', 'name');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Count patients ahead in queue
    const patientsAhead = await Appointment.countDocuments({
      doctorId: appointment.doctorId._id,
      date: appointment.date,
      slot: appointment.slot,
      status: 'scheduled',
      tokenNumber: { $lt: appointment.tokenNumber }
    });

    const currentWaitTime = patientsAhead * 15; // 15 minutes per patient

    res.status(200).json({
      success: true,
      waitInfo: {
        tokenNumber: appointment.tokenNumber,
        patientsAhead,
        estimatedWaitTime: currentWaitTime,
        doctorName: appointment.doctorId.name,
        appointmentDate: appointment.date,
        appointmentTime: appointment.time
      }
    });

  } catch (error) {
    console.error('Get wait time error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wait time'
    });
  }
};

// Reschedule appointment
export const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { date, slot, time } = req.body;
    const userId = req.userId;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId
    }).populate('doctorId');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot reschedule a cancelled appointment'
      });
    }

    // Validate new slot
    const newDate = new Date(date);
    const dayName = newDate.toLocaleDateString('en-US', { weekday: 'long' });

    if (!appointment.doctorId.daysAvailable.includes(dayName)) {
      return res.status(400).json({
        success: false,
        message: `Doctor is not available on ${dayName}`
      });
    }

    // Check slot availability
    const existingAppointments = await Appointment.countDocuments({
      doctorId: appointment.doctorId._id,
      date: newDate,
      slot,
      status: 'scheduled',
      _id: { $ne: appointmentId }
    });

    if (existingAppointments >= appointment.doctorId.maxPatientsPerSlot) {
      return res.status(400).json({
        success: false,
        message: 'This slot is fully booked'
      });
    }

    appointment.date = newDate;
    appointment.slot = slot;
    appointment.time = time;
    appointment.status = 'rescheduled';
    appointment.reminderSent24h = false;
    appointment.reminderSent2h = false;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      appointment
    });

  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rescheduling appointment'
    });
  }
};
