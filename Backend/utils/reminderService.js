import cron from 'node-cron';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Chat from '../models/Chat.js';
import { VaccinationAppointment } from '../models/Vaccination.js';
import VideoConsultation from '../models/VideoConsultation.js';
import { sendWhatsAppMessage, sendAppointmentReminder } from './whatsappService.js';

// Check for appointments that need reminders
const checkReminders = async () => {
  try {
    const now = new Date();
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    // Check regular appointments
    await checkAppointmentReminders(now, twentyFourHoursLater, twoHoursLater);
    
    // Check vaccination appointments
    await checkVaccinationReminders(now, twentyFourHoursLater, twoHoursLater);
    
    // Check video consultations
    await checkVideoConsultationReminders(now, twentyFourHoursLater, twoHoursLater);

  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};

// Check regular appointment reminders
const checkAppointmentReminders = async (now, twentyFourHoursLater, twoHoursLater) => {
  try {
    // Find appointments in the next 24 hours that haven't been reminded
    const appointments24h = await Appointment.find({
      date: {
        $gte: now,
        $lte: twentyFourHoursLater
      },
      status: 'scheduled',
      reminderSent24h: false
    }).populate('userId doctorId');

    // Find appointments in the next 2 hours that haven't been reminded
    const appointments2h = await Appointment.find({
      date: {
        $gte: now,
        $lte: twoHoursLater
      },
      status: 'scheduled',
      reminderSent2h: false
    }).populate('userId doctorId');

    // Send 24-hour reminders
    for (const appointment of appointments24h) {
      await sendAppointmentReminderMessage(appointment, '24 hours', 'appointment');
      appointment.reminderSent24h = true;
      await appointment.save();
    }

    // Send 2-hour reminders
    for (const appointment of appointments2h) {
      await sendAppointmentReminderMessage(appointment, '2 hours', 'appointment');
      appointment.reminderSent2h = true;
      await appointment.save();
    }
  } catch (error) {
    console.error('Error checking appointment reminders:', error);
  }
};

// Check vaccination appointment reminders
const checkVaccinationReminders = async (now, twentyFourHoursLater, twoHoursLater) => {
  try {
    const vaccinations24h = await VaccinationAppointment.find({
      date: {
        $gte: now,
        $lte: twentyFourHoursLater
      },
      status: 'scheduled'
    }).populate('userId vaccinationId');

    const vaccinations2h = await VaccinationAppointment.find({
      date: {
        $gte: now,
        $lte: twoHoursLater
      },
      status: 'scheduled'
    }).populate('userId vaccinationId');

    for (const vaccination of vaccinations24h) {
      await sendVaccinationReminder(vaccination, '24 hours');
    }

    for (const vaccination of vaccinations2h) {
      await sendVaccinationReminder(vaccination, '2 hours');
    }
  } catch (error) {
    console.error('Error checking vaccination reminders:', error);
  }
};

// Check video consultation reminders
const checkVideoConsultationReminders = async (now, twentyFourHoursLater, twoHoursLater) => {
  try {
    const consultations24h = await VideoConsultation.find({
      scheduledDate: {
        $gte: now,
        $lte: twentyFourHoursLater
      },
      status: 'scheduled'
    }).populate('userId doctorId');

    const consultations2h = await VideoConsultation.find({
      scheduledDate: {
        $gte: now,
        $lte: twoHoursLater
      },
      status: 'scheduled'
    }).populate('userId doctorId');

    for (const consultation of consultations24h) {
      await sendVideoConsultationReminder(consultation, '24 hours');
    }

    for (const consultation of consultations2h) {
      await sendVideoConsultationReminder(consultation, '2 hours');
    }
  } catch (error) {
    console.error('Error checking video consultation reminders:', error);
  }
};

// Send appointment reminder message
const sendAppointmentReminderMessage = async (appointment, timeframe, type = 'appointment') => {
  try {
    const appointmentDate = new Date(appointment.date);
    const formattedDate = appointmentDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const reminderMessage = `🔔 **Appointment Reminder**\n\nYou have an appointment with Dr. ${appointment.doctorId.name} (${appointment.doctorId.department}) on ${formattedDate} at ${appointment.time}.\n\nToken Number: ${appointment.tokenNumber}\nEstimated Wait Time: ${appointment.estimatedWaitTime} minutes\n\nPlease arrive 15 minutes early. Bring your ID and previous medical records if any.\n\nTo cancel or reschedule, please contact us at +91-98765-43210.`;

    // Send WhatsApp reminder if user has WhatsApp number
    if (appointment.userId.whatsappNumber) {
      await sendAppointmentReminder(appointment.userId.whatsappNumber, {
        patientName: appointment.patientName,
        date: formattedDate,
        time: appointment.time,
        doctorName: appointment.doctorId.name,
        department: appointment.doctorId.department
      }, appointment.userId.language);
    }

    // Add reminder to user's chat history
    let chat = await Chat.findOne({ userId: appointment.userId._id });

    if (!chat) {
      chat = new Chat({
        userId: appointment.userId._id,
        messages: []
      });
    }

    chat.messages.push({
      role: 'assistant',
      content: reminderMessage,
      timestamp: new Date()
    });

    chat.lastUpdated = new Date();
    await chat.save();

    console.log(`${type} reminder sent to ${appointment.userId.name} for appointment in ${timeframe}`);
  } catch (error) {
    console.error('Error sending appointment reminder:', error);
  }
};

// Send vaccination reminder
const sendVaccinationReminder = async (vaccination, timeframe) => {
  try {
    const vaccinationDate = new Date(vaccination.date);
    const formattedDate = vaccinationDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const reminderMessage = `💉 **Vaccination Reminder**\n\nYou have a vaccination appointment for ${vaccination.vaccinationId.name} on ${formattedDate} at ${vaccination.time}.\n\nDose Number: ${vaccination.doseNumber}\nPatient: ${vaccination.patientName}\n\nPlease arrive 15 minutes early and bring your vaccination card.\n\nFor any queries, contact us at +91-98765-43210.`;

    let chat = await Chat.findOne({ userId: vaccination.userId._id });
    if (!chat) {
      chat = new Chat({ userId: vaccination.userId._id, messages: [] });
    }

    chat.messages.push({
      role: 'assistant',
      content: reminderMessage,
      timestamp: new Date()
    });

    chat.lastUpdated = new Date();
    await chat.save();

    console.log(`Vaccination reminder sent to ${vaccination.userId.name} for vaccination in ${timeframe}`);
  } catch (error) {
    console.error('Error sending vaccination reminder:', error);
  }
};

// Send video consultation reminder
const sendVideoConsultationReminder = async (consultation, timeframe) => {
  try {
    const consultationDate = new Date(consultation.scheduledDate);
    const formattedDate = consultationDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const reminderMessage = `💻 **Video Consultation Reminder**\n\nYou have a video consultation with Dr. ${consultation.doctorId.name} (${consultation.doctorId.department}) on ${formattedDate} at ${consultation.scheduledTime}.\n\nMeeting Link: ${consultation.meetingLink}\nMeeting ID: ${consultation.meetingId}\nPassword: ${consultation.password}\n\nPlease test your camera and microphone beforehand. Join 5 minutes early.\n\nFor technical support, contact us at +91-98765-43210.`;

    let chat = await Chat.findOne({ userId: consultation.userId._id });
    if (!chat) {
      chat = new Chat({ userId: consultation.userId._id, messages: [] });
    }

    chat.messages.push({
      role: 'assistant',
      content: reminderMessage,
      timestamp: new Date()
    });

    chat.lastUpdated = new Date();
    await chat.save();

    console.log(`Video consultation reminder sent to ${consultation.userId.name} for consultation in ${timeframe}`);
  } catch (error) {
    console.error('Error sending video consultation reminder:', error);
  }
};

// Schedule reminder job to run every hour
export const startReminderService = () => {
  // Run every hour
  cron.schedule('0 * * * *', () => {
    console.log('Running comprehensive reminder check...');
    checkReminders();
  });

  // Run medicine refill reminders daily at 9 AM
  cron.schedule('0 9 * * *', () => {
    console.log('Running medicine refill reminder check...');
    checkMedicineRefillReminders();
  });

  console.log('✅ Enhanced reminder service started - checking every hour');
  console.log('✅ Medicine refill reminders - checking daily at 9 AM');

  // Also run immediately on startup
  checkReminders();
};

// Check medicine refill reminders (placeholder for future implementation)
const checkMedicineRefillReminders = async () => {
  try {
    // This would check user's prescription history and send refill reminders
    console.log('Medicine refill reminder check completed');
  } catch (error) {
    console.error('Error checking medicine refill reminders:', error);
  }
};

// Manual trigger for testing
export const triggerReminderCheck = async () => {
  await checkReminders();
};

// Export individual reminder functions for testing
export { sendAppointmentReminderMessage, sendVaccinationReminder, sendVideoConsultationReminder };
