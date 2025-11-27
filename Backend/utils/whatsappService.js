// WhatsApp Business API integration utility
// This is a placeholder for WhatsApp Business API integration

export const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    // In production, integrate with WhatsApp Business API
    // For now, just log the message
    console.log(`📱 WhatsApp Message to ${phoneNumber}:`);
    console.log(message);
    
    // Simulate API call
    return {
      success: true,
      messageId: `wa_${Date.now()}`,
      status: 'sent'
    };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const sendAppointmentReminder = async (phoneNumber, appointmentDetails, language = 'English') => {
  const messages = {
    English: `🏥 *Appointment Reminder*

Hello ${appointmentDetails.patientName},

Your appointment is scheduled:
📅 Date: ${appointmentDetails.date}
⏰ Time: ${appointmentDetails.time}
👨‍⚕️ Doctor: ${appointmentDetails.doctorName}
🏢 Department: ${appointmentDetails.department}

Please arrive 15 minutes early.
For any changes, call: +91-98765-43210

*Sunrise Multi-Specialty Hospital*`,

    Hindi: `🏥 *अपॉइंटमेंट रिमाइंडर*

नमस्ते ${appointmentDetails.patientName},

आपका अपॉइंटमेंट निर्धारित है:
📅 तारीख: ${appointmentDetails.date}
⏰ समय: ${appointmentDetails.time}
👨‍⚕️ डॉक्टर: ${appointmentDetails.doctorName}
🏢 विभाग: ${appointmentDetails.department}

कृपया 15 मिनट पहले पहुंचें।
किसी भी बदलाव के लिए कॉल करें: +91-98765-43210

*सनराइज मल्टी-स्पेशलिटी हॉस्पिटल*`
  };

  const message = messages[language] || messages.English;
  return await sendWhatsAppMessage(phoneNumber, message);
};

export const sendOTP = async (phoneNumber, otp, purpose = 'verification') => {
  const message = `🔐 Your OTP for ${purpose}: *${otp}*

This OTP is valid for 10 minutes only.
Do not share this OTP with anyone.

*Sunrise Multi-Specialty Hospital*`;

  return await sendWhatsAppMessage(phoneNumber, message);
};

export const sendEmergencyAlert = async (phoneNumber, patientName, location) => {
  const message = `🚨 *EMERGENCY ALERT* 🚨

Patient: ${patientName}
Location: ${location}
Time: ${new Date().toLocaleString()}

Emergency services have been notified.
Ambulance dispatched.

*Sunrise Multi-Specialty Hospital*
Emergency: +91-98765-43210`;

  return await sendWhatsAppMessage(phoneNumber, message);
};