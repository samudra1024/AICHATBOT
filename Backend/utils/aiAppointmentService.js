import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

// Extract appointment details from AI conversation
export const extractAppointmentDetails = (message, conversationHistory = []) => {
  const appointmentKeywords = [
    'book appointment', 'schedule appointment', 'appointment with','confirm',
    'see doctor', 'meet doctor', 'consultation with', 'visit',
    'tomorrow', 'today', 'next week', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
    'dr.', 'doctor', 'checkup', 'need to see', 'want to see'
  ];

  const lowerMessage = message.toLowerCase();
  const hasAppointmentIntent = appointmentKeywords.some(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  );

  if (!hasAppointmentIntent) return null;

  // Extract doctor name - simplified approach
  const doctorPattern = /(?:dr\.?\s+|doctor\s+)([a-zA-Z]+(?:\s+[a-zA-Z]+)*?)(?=\s+(?:tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday|morning|afternoon|evening|at|for|on|\d)|$)/i;
  const doctorMatch = message.match(doctorPattern);
  
  let doctorName = null;
  if (doctorMatch) {
    doctorName = doctorMatch[1].trim();
  }
  
  // Extract time preferences
  const timePatterns = [
    /(\d{1,2})\s*(?::|\.)\s*(\d{2})\s*(am|pm)/i,
    /(\d{1,2})\s*(am|pm)/i,
    /(morning|afternoon|evening)/i
  ];

  let timePreference = null;
  for (const pattern of timePatterns) {
    const match = message.match(pattern);
    if (match) {
      timePreference = match[0];
      break;
    }
  }

  // Extract date preferences
  const datePatterns = [
    /(tomorrow|today)/i,
    /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
    /(next week|this week)/i
  ];

  let datePreference = null;
  for (const pattern of datePatterns) {
    const match = message.match(pattern);
    if (match) {
      datePreference = match[0];
      break;
    }
  }

  return {
    doctorName: doctorName ? doctorName.trim() : null,
    timePreference,
    datePreference,
    hasAppointmentIntent: true
  };
};

// Find matching doctor
export const findMatchingDoctor = async (doctorName, department = null) => {
  if (!doctorName) return null;

  // Try exact name match first
  let doctor = await Doctor.findOne({
    name: { $regex: new RegExp(doctorName, 'i') }
  });

  if (!doctor && department) {
    // Try department match
    doctor = await Doctor.findOne({
      department: { $regex: new RegExp(department, 'i') }
    });
  }

  return doctor;
};

// Convert date preference to actual date
export const parseAppointmentDate = (datePreference) => {
  if (!datePreference) return null;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const preference = datePreference.toLowerCase();

  if (preference.includes('today')) {
    return today;
  }
  
  if (preference.includes('tomorrow')) {
    return tomorrow;
  }

  // Handle day names
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = dayNames.findIndex(day => preference.includes(day));
  
  if (dayIndex !== -1) {
    const targetDate = new Date(today);
    const currentDay = today.getDay();
    const daysUntilTarget = (dayIndex - currentDay + 7) % 7;
    targetDate.setDate(today.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget));
    return targetDate;
  }

  return null;
};

// Convert time preference to slot
export const parseTimeSlot = (timePreference) => {
  if (!timePreference) return 'morning'; // default

  const preference = timePreference.toLowerCase();
  
  if (preference.includes('morning') || preference.includes('am')) {
    return 'morning';
  }
  
  if (preference.includes('afternoon') || (preference.includes('pm') && !preference.includes('evening'))) {
    return 'afternoon';
  }
  
  if (preference.includes('evening')) {
    return 'evening';
  }

  return 'morning';
};

// Book appointment automatically
export const autoBookAppointment = async (userId, appointmentDetails) => {
  try {
    const { doctorName, timePreference, datePreference } = appointmentDetails;

    // Find doctor
    const doctor = await findMatchingDoctor(doctorName);
    if (!doctor) {
      return {
        success: false,
        message: `Sorry, I couldn't find a doctor named "${doctorName}". Please check the name and try again.`
      };
    }

    // Parse date and time
    const appointmentDate = parseAppointmentDate(datePreference);
    if (!appointmentDate) {
      return {
        success: false,
        message: 'Please specify a valid date for your appointment.'
      };
    }

    const slot = parseTimeSlot(timePreference);
    
    // Check if doctor is available on that day
    const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
    if (!doctor.daysAvailable.includes(dayName)) {
      return {
        success: false,
        message: `Dr. ${doctor.name} is not available on ${dayName}. Available days: ${doctor.daysAvailable.join(', ')}`
      };
    }

    // Check slot availability
    if (!doctor.timings[slot] || !doctor.timings[slot].available) {
      return {
        success: false,
        message: `${slot} slot is not available for Dr. ${doctor.name}`
      };
    }

    // Check if slot is full
    const existingAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      date: appointmentDate,
      slot,
      status: 'scheduled'
    });

    if (existingAppointments >= doctor.maxPatientsPerSlot) {
      return {
        success: false,
        message: 'This slot is fully booked. Please choose another time.'
      };
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      // For testing purposes, use a default name
      const defaultUser = { name: 'Test User' };
      
      // Create appointment with default user name
      const tokenNumber = existingAppointments + 1;
      const estimatedWaitTime = (tokenNumber - 1) * 15;

      const appointment = new Appointment({
        userId,
        doctorId: doctor._id,
        patientName: defaultUser.name,
        date: appointmentDate,
        slot,
        time: doctor.timings[slot].start,
        status: 'scheduled',
        tokenNumber,
        queuePosition: tokenNumber,
        estimatedWaitTime,
        notes: 'Booked via AI Assistant (Test)'
      });

      await appointment.save();
      await appointment.populate('doctorId');

      return {
        success: true,
        message: `Appointment successfully booked with Dr. ${doctor.name} on ${appointmentDate.toLocaleDateString()} at ${doctor.timings[slot].start} (${slot}). Token: ${tokenNumber}`,
        appointment
      };
    }

    // Generate token number
    const tokenNumber = existingAppointments + 1;
    const estimatedWaitTime = (tokenNumber - 1) * 15;

    // Create appointment
    const appointment = new Appointment({
      userId,
      doctorId: doctor._id,
      patientName: user.name,
      date: appointmentDate,
      slot,
      time: doctor.timings[slot].start,
      status: 'scheduled',
      tokenNumber,
      queuePosition: tokenNumber,
      estimatedWaitTime,
      notes: 'Booked via AI Assistant'
    });

    await appointment.save();
    await appointment.populate('doctorId');

    return {
      success: true,
      message: `Appointment successfully booked with Dr. ${doctor.name} on ${appointmentDate.toLocaleDateString()} at ${doctor.timings[slot].start} (${slot}). Token: ${tokenNumber}`,
      appointment
    };

  } catch (error) {
    console.error('Auto book appointment error:', error);
    return {
      success: false,
      message: 'Error booking appointment. Please try again.'
    };
  }
};

// Check if message contains appointment booking intent
export const hasBookingIntent = (message) => {
  const bookingKeywords = [
    'book appointment', 'schedule appointment', 'make appointment',
    'appointment with', 'see doctor', 'meet doctor', 'consultation',
    'book', 'schedule', 'appointment', 'visit', 'checkup',
    'dr.', 'doctor', 'tomorrow', 'today', 'next week',
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
    'morning', 'afternoon', 'evening', 'need to see', 'want to see'
  ];

  const lowerMessage = message.toLowerCase();
  return bookingKeywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
};