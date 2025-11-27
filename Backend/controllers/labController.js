import LabReport from '../models/LabReport.js';
import crypto from 'crypto';

// Generate OTP for report download
export const generateReportOTP = async (req, res) => {
  try {
    const { reportId } = req.body;
    const userId = req.userId;

    const report = await LabReport.findOne({ reportId, userId });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (report.status !== 'ready') {
      return res.status(400).json({
        success: false,
        message: 'Report is not ready for download'
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    report.otp = otp;
    report.otpExpiry = otpExpiry;
    await report.save();

    // In production, send OTP via SMS/WhatsApp
    console.log(`OTP for report ${reportId}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent to your registered mobile number',
      reportId
    });

  } catch (error) {
    console.error('Generate OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating OTP'
    });
  }
};

// Download report with OTP verification
export const downloadReport = async (req, res) => {
  try {
    const { reportId, otp } = req.body;
    const userId = req.userId;

    const report = await LabReport.findOne({ reportId, userId });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (!report.otp || report.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (new Date() > report.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired. Please generate a new one'
      });
    }

    report.downloadCount += 1;
    report.status = 'downloaded';
    report.otp = null;
    report.otpExpiry = null;
    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report download authorized',
      downloadUrl: report.reportUrl,
      reportDetails: {
        patientName: report.patientName,
        testName: report.testName,
        testDate: report.testDate,
        doctorName: report.doctorName
      }
    });

  } catch (error) {
    console.error('Download report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading report'
    });
  }
};

// Get user's lab reports
export const getUserReports = async (req, res) => {
  try {
    const userId = req.userId;

    const reports = await LabReport.find({ userId })
      .sort({ createdAt: -1 })
      .select('-otp -otpExpiry');

    res.status(200).json({
      success: true,
      reports
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports'
    });
  }
};