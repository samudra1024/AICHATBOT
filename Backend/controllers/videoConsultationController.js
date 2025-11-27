import VideoConsultation from '../models/VideoConsultation.js';
import Doctor from '../models/Doctor.js';
import crypto from 'crypto';

// Book video consultation
export const bookVideoConsultation = async (req, res) => {
  try {
    const { doctorId, patientName, scheduledDate, scheduledTime, symptoms } = req.body;
    const userId = req.userId;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Generate meeting details
    const meetingId = crypto.randomBytes(8).toString('hex');
    const password = crypto.randomInt(100000, 999999).toString();
    const meetingLink = `https://meet.hospital.com/room/${meetingId}`;

    const consultation = new VideoConsultation({
      userId,
      doctorId,
      patientName,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      meetingLink,
      meetingId,
      password,
      consultationFee: doctor.fees.consultation,
      symptoms
    });

    await consultation.save();

    res.status(201).json({
      success: true,
      message: 'Video consultation booked successfully',
      consultation: {
        id: consultation._id,
        doctorName: doctor.name,
        patientName,
        scheduledDate,
        scheduledTime,
        meetingLink,
        meetingId,
        password,
        consultationFee: doctor.fees.consultation
      }
    });

  } catch (error) {
    console.error('Book video consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking video consultation'
    });
  }
};

// Get user's video consultations
export const getUserConsultations = async (req, res) => {
  try {
    const userId = req.userId;

    const consultations = await VideoConsultation.find({ userId })
      .populate('doctorId', 'name department specialization')
      .sort({ scheduledDate: -1 });

    res.status(200).json({
      success: true,
      consultations
    });

  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching consultations'
    });
  }
};

// Join video consultation
export const joinConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const userId = req.userId;

    const consultation = await VideoConsultation.findOne({ 
      _id: consultationId, 
      userId,
      status: 'scheduled'
    }).populate('doctorId', 'name department');

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found or not available'
      });
    }

    // Check if consultation time is within 15 minutes
    const now = new Date();
    const consultationDateTime = new Date(consultation.scheduledDate);
    const [hours, minutes] = consultation.scheduledTime.split(':');
    consultationDateTime.setHours(parseInt(hours), parseInt(minutes));

    const timeDiff = Math.abs(now - consultationDateTime) / (1000 * 60); // minutes

    if (timeDiff > 15) {
      return res.status(400).json({
        success: false,
        message: 'Consultation can only be joined within 15 minutes of scheduled time'
      });
    }

    // Update status to ongoing
    consultation.status = 'ongoing';
    await consultation.save();

    res.status(200).json({
      success: true,
      meetingDetails: {
        meetingLink: consultation.meetingLink,
        meetingId: consultation.meetingId,
        password: consultation.password,
        doctorName: consultation.doctorId.name,
        patientName: consultation.patientName
      }
    });

  } catch (error) {
    console.error('Join consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining consultation'
    });
  }
};