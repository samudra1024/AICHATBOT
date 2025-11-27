import { Ambulance, AmbulanceRequest } from '../models/Ambulance.js';

// Request ambulance
export const requestAmbulance = async (req, res) => {
  try {
    const {
      patientName,
      contactNumber,
      pickupLocation,
      destination,
      emergencyType,
      urgency,
      patientCondition
    } = req.body;
    const userId = req.userId;

    const ambulanceRequest = new AmbulanceRequest({
      userId,
      patientName,
      contactNumber,
      pickupLocation,
      destination,
      emergencyType,
      urgency,
      patientCondition
    });

    await ambulanceRequest.save();

    // Find nearest available ambulance
    const availableAmbulances = await Ambulance.find({ 
      status: 'available',
      active: true
    });

    let assignedAmbulance = null;
    let estimatedArrival = null;

    if (availableAmbulances.length > 0) {
      // For simplicity, assign the first available ambulance
      // In production, this would use location-based matching
      assignedAmbulance = availableAmbulances[0];
      
      // Update ambulance status
      assignedAmbulance.status = 'busy';
      await assignedAmbulance.save();

      // Update request
      ambulanceRequest.ambulanceId = assignedAmbulance._id;
      ambulanceRequest.status = 'assigned';
      
      // Estimate arrival time (simplified calculation)
      const baseTime = urgency === 'critical' ? 8 : urgency === 'high' ? 12 : 15;
      estimatedArrival = new Date(Date.now() + baseTime * 60 * 1000);
      ambulanceRequest.estimatedArrival = estimatedArrival;
      
      await ambulanceRequest.save();
    }

    res.status(201).json({
      success: true,
      message: 'Ambulance request submitted successfully',
      requestId: ambulanceRequest._id,
      status: ambulanceRequest.status,
      ...(assignedAmbulance && {
        ambulanceDetails: {
          vehicleNumber: assignedAmbulance.vehicleNumber,
          type: assignedAmbulance.type,
          driverName: assignedAmbulance.driverName,
          driverPhone: assignedAmbulance.driverPhone,
          estimatedArrival
        }
      })
    });

  } catch (error) {
    console.error('Request ambulance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error requesting ambulance'
    });
  }
};

// Get ambulance request status
export const getRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.userId;

    const request = await AmbulanceRequest.findOne({ _id: requestId, userId })
      .populate('ambulanceId', 'vehicleNumber type driverName driverPhone');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance request not found'
      });
    }

    res.status(200).json({
      success: true,
      request
    });

  } catch (error) {
    console.error('Get request status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching request status'
    });
  }
};

// Get user's ambulance requests
export const getUserRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await AmbulanceRequest.find({ userId })
      .populate('ambulanceId', 'vehicleNumber type driverName driverPhone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests
    });

  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ambulance requests'
    });
  }
};

// Cancel ambulance request
export const cancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.userId;

    const request = await AmbulanceRequest.findOne({ 
      _id: requestId, 
      userId,
      status: { $in: ['requested', 'assigned', 'enroute'] }
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found or cannot be cancelled'
      });
    }

    // Free up ambulance if assigned
    if (request.ambulanceId) {
      await Ambulance.findByIdAndUpdate(request.ambulanceId, { status: 'available' });
    }

    request.status = 'cancelled';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Ambulance request cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling request'
    });
  }
};