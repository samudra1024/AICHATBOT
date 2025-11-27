import BillEstimate from '../models/Bill.js';
import Doctor from '../models/Doctor.js';
import HealthPackage from '../models/HealthPackage.js';

// Generate bill estimate
export const generateEstimate = async (req, res) => {
  try {
    const { patientName, doctorId, services } = req.body;
    const userId = req.userId;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    let subtotal = 0;
    const processedServices = [];

    // Add consultation fee
    processedServices.push({
      name: `Consultation - Dr. ${doctor.name}`,
      type: 'consultation',
      quantity: 1,
      unitPrice: doctor.fees.consultation,
      totalPrice: doctor.fees.consultation
    });
    subtotal += doctor.fees.consultation;

    // Process additional services
    if (services && services.length > 0) {
      for (const service of services) {
        const serviceTotal = service.quantity * service.unitPrice;
        processedServices.push({
          name: service.name,
          type: service.type,
          quantity: service.quantity,
          unitPrice: service.unitPrice,
          totalPrice: serviceTotal
        });
        subtotal += serviceTotal;
      }
    }

    // Calculate taxes (18% GST)
    const gstRate = 0.18;
    const cgst = (subtotal * gstRate) / 2;
    const sgst = (subtotal * gstRate) / 2;
    const totalTax = cgst + sgst;

    const totalAmount = subtotal + totalTax;
    const validTill = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const estimate = new BillEstimate({
      userId,
      patientName,
      doctorId,
      services: processedServices,
      subtotal,
      taxes: {
        cgst,
        sgst,
        total: totalTax
      },
      totalAmount,
      payableAmount: totalAmount,
      validTill
    });

    await estimate.save();

    res.status(201).json({
      success: true,
      message: 'Bill estimate generated successfully',
      estimate: {
        id: estimate._id,
        patientName,
        doctorName: doctor.name,
        services: processedServices,
        subtotal,
        taxes: estimate.taxes,
        totalAmount,
        validTill
      }
    });

  } catch (error) {
    console.error('Generate estimate error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating bill estimate'
    });
  }
};

// Get user's bill estimates
export const getUserEstimates = async (req, res) => {
  try {
    const userId = req.userId;

    const estimates = await BillEstimate.find({ userId })
      .populate('doctorId', 'name department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      estimates
    });

  } catch (error) {
    console.error('Get estimates error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching estimates'
    });
  }
};

// Get estimate details
export const getEstimateDetails = async (req, res) => {
  try {
    const { estimateId } = req.params;
    const userId = req.userId;

    const estimate = await BillEstimate.findOne({ _id: estimateId, userId })
      .populate('doctorId', 'name department specialization');

    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: 'Estimate not found'
      });
    }

    res.status(200).json({
      success: true,
      estimate
    });

  } catch (error) {
    console.error('Get estimate details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching estimate details'
    });
  }
};