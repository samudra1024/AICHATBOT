import Feedback from '../models/Feedback.js';
import Appointment from '../models/Appointment.js';

// Submit feedback
export const submitFeedback = async (req, res) => {
  try {
    const {
      appointmentId,
      doctorId,
      type,
      rating,
      npsScore,
      comments,
      suggestions,
      wouldRecommend,
      visitDate,
      department
    } = req.body;
    const userId = req.userId;

    // Validate appointment if provided
    if (appointmentId) {
      const appointment = await Appointment.findOne({ _id: appointmentId, userId });
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }
    }

    const feedback = new Feedback({
      userId,
      appointmentId,
      doctorId,
      type,
      rating,
      npsScore,
      comments,
      suggestions,
      wouldRecommend,
      visitDate: new Date(visitDate),
      department
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! We appreciate your input.',
      feedbackId: feedback._id
    });

  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback'
    });
  }
};

// Get feedback form for completed appointment
export const getFeedbackForm = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.userId;

    const appointment = await Appointment.findOne({ 
      _id: appointmentId, 
      userId,
      status: 'completed'
    }).populate('doctorId', 'name department');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Completed appointment not found'
      });
    }

    // Check if feedback already submitted
    const existingFeedback = await Feedback.findOne({ appointmentId });
    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'Feedback already submitted for this appointment'
      });
    }

    res.status(200).json({
      success: true,
      appointment: {
        id: appointment._id,
        doctorName: appointment.doctorId.name,
        department: appointment.doctorId.department,
        date: appointment.date,
        patientName: appointment.patientName
      }
    });

  } catch (error) {
    console.error('Get feedback form error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback form'
    });
  }
};

// Get user's feedback history
export const getUserFeedback = async (req, res) => {
  try {
    const userId = req.userId;

    const feedbacks = await Feedback.find({ userId })
      .populate('doctorId', 'name department')
      .populate('appointmentId', 'date patientName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      feedbacks
    });

  } catch (error) {
    console.error('Get user feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback history'
    });
  }
};