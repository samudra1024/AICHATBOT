import { BloodBank, BloodRequest } from '../models/BloodBank.js';

// Check blood availability
export const checkBloodAvailability = async (req, res) => {
  try {
    const { bloodGroup } = req.query;

    let searchCriteria = { 
      status: 'available',
      expiryDate: { $gt: new Date() }
    };

    if (bloodGroup) {
      searchCriteria.bloodGroup = bloodGroup;
    }

    const bloodUnits = await BloodBank.aggregate([
      { $match: searchCriteria },
      {
        $group: {
          _id: '$bloodGroup',
          totalUnits: { $sum: '$unitsAvailable' },
          nearestExpiry: { $min: '$expiryDate' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      bloodAvailability: bloodUnits
    });

  } catch (error) {
    console.error('Check blood availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking blood availability'
    });
  }
};

// Request blood
export const requestBlood = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      unitsRequired,
      urgency,
      requiredBy,
      contactNumber,
      hospitalLocation,
      patientCondition
    } = req.body;
    const userId = req.userId;

    const bloodRequest = new BloodRequest({
      userId,
      patientName,
      bloodGroup,
      unitsRequired,
      urgency,
      requiredBy: new Date(requiredBy),
      contactNumber,
      hospitalLocation,
      patientCondition
    });

    await bloodRequest.save();

    // Check immediate availability
    const availableUnits = await BloodBank.aggregate([
      {
        $match: {
          bloodGroup,
          status: 'available',
          expiryDate: { $gt: new Date() }
        }
      },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: '$unitsAvailable' }
        }
      }
    ]);

    const available = availableUnits.length > 0 ? availableUnits[0].totalUnits : 0;

    res.status(201).json({
      success: true,
      message: 'Blood request submitted successfully',
      requestId: bloodRequest._id,
      immediateAvailability: {
        available: available >= unitsRequired,
        unitsAvailable: available,
        unitsRequested: unitsRequired
      }
    });

  } catch (error) {
    console.error('Request blood error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting blood request'
    });
  }
};

// Get user's blood requests
export const getUserBloodRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await BloodRequest.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests
    });

  } catch (error) {
    console.error('Get blood requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blood requests'
    });
  }
};