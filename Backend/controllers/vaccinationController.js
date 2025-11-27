import { Vaccination, VaccinationAppointment } from '../models/Vaccination.js';

// Get available vaccines
export const getVaccines = async (req, res) => {
  try {
    const { type, ageGroup } = req.query;

    let searchCriteria = { active: true, availability: true };

    if (type) {
      searchCriteria.type = type;
    }

    if (ageGroup) {
      searchCriteria.ageGroup = { $regex: ageGroup, $options: 'i' };
    }

    const vaccines = await Vaccination.find(searchCriteria).sort({ name: 1 });

    res.status(200).json({
      success: true,
      vaccines
    });

  } catch (error) {
    console.error('Get vaccines error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vaccines'
    });
  }
};

// Book vaccination appointment
export const bookVaccination = async (req, res) => {
  try {
    const { vaccinationId, patientName, age, date, time, doseNumber } = req.body;
    const userId = req.userId;

    const vaccination = await Vaccination.findById(vaccinationId);
    if (!vaccination || !vaccination.availability) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination not available'
      });
    }

    const appointment = new VaccinationAppointment({
      userId,
      vaccinationId,
      patientName,
      age,
      date: new Date(date),
      time,
      doseNumber: doseNumber || 1
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Vaccination appointment booked successfully',
      appointment: {
        id: appointment._id,
        vaccineName: vaccination.name,
        patientName,
        date,
        time,
        doseNumber: appointment.doseNumber
      }
    });

  } catch (error) {
    console.error('Book vaccination error:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking vaccination'
    });
  }
};

// Get user's vaccination appointments
export const getUserVaccinations = async (req, res) => {
  try {
    const userId = req.userId;

    const appointments = await VaccinationAppointment.find({ userId })
      .populate('vaccinationId', 'name type price')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      appointments
    });

  } catch (error) {
    console.error('Get user vaccinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vaccination appointments'
    });
  }
};