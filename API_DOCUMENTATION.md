# MediBot API Documentation

## Overview
Complete API documentation for MediBot - AI Hospital Reception Chatbot with all advanced features.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Authentication APIs

### POST /auth/register
Register new user with comprehensive profile
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "password123",
  "age": 30,
  "gender": "Male",
  "uhid": "UH123456",
  "aadhaar": "123456789012",
  "language": "English",
  "whatsappNumber": "9876543210",
  "emergencyContact": {
    "name": "Jane Doe",
    "relation": "Wife",
    "phone": "9876543211"
  },
  "medicalHistory": {
    "allergies": ["Penicillin"],
    "chronicConditions": ["Diabetes"],
    "currentMedications": ["Metformin"],
    "bloodGroup": "O+"
  }
}
```

### POST /auth/login
Login with email/mobile and password

---

## 💬 Chat APIs

### POST /chat/send
Send message to AI chatbot
```json
{
  "message": "I need to book an appointment",
  "language": "English"
}
```

### GET /chat/history
Get user's chat history

### DELETE /chat/clear
Clear chat history

### PUT /chat/language
Update language preference

---

## 📅 Appointment APIs

### POST /appointment/book
Book new appointment with enhanced features
```json
{
  "doctorId": "doctor_id",
  "date": "2024-01-15",
  "slot": "morning",
  "time": "10:00",
  "patientName": "John Doe",
  "notes": "Follow-up consultation"
}
```

### GET /appointment/my-appointments
Get user's appointments with wait time info

### GET /appointment/:appointmentId/wait-time
Get real-time wait time prediction
```json
{
  "waitInfo": {
    "tokenNumber": 5,
    "patientsAhead": 3,
    "estimatedWaitTime": 45,
    "doctorName": "Dr. Smith",
    "appointmentDate": "2024-01-15",
    "appointmentTime": "10:00"
  }
}
```

### PUT /appointment/:appointmentId/reschedule
Reschedule appointment

### DELETE /appointment/:appointmentId/cancel
Cancel appointment

---

## 👨⚕️ Doctor APIs

### GET /doctor/search
Search doctors with advanced filters
```
?name=smith&department=cardiology&day=monday&available=true
```

### GET /doctor/:id
Get doctor details with real-time availability

### GET /doctor/:id/availability
Check doctor's availability for specific date

### GET /doctor/departments
Get all departments with services

---

## 🧪 Lab Report APIs

### POST /lab/generate-otp
Generate OTP for secure report download
```json
{
  "reportId": "LAB123456"
}
```

### POST /lab/download
Download report with OTP verification
```json
{
  "reportId": "LAB123456",
  "otp": "123456"
}
```

### GET /lab/my-reports
Get user's lab reports

---

## 💊 Medicine APIs

### GET /medicine/search
Search medicines in pharmacy
```
?query=paracetamol&category=analgesic&prescription=false
```

### GET /medicine/categories
Get all medicine categories

### GET /medicine/:medicineId/availability
Check medicine availability and delivery options

---

## 💉 Vaccination APIs

### GET /vaccination
Get available vaccines
```
?type=covid&ageGroup=adult
```

### POST /vaccination/book
Book vaccination appointment
```json
{
  "vaccinationId": "vaccine_id",
  "patientName": "John Doe",
  "age": 30,
  "date": "2024-01-15",
  "time": "10:00",
  "doseNumber": 1
}
```

### GET /vaccination/my-appointments
Get user's vaccination appointments

---

## 🩸 Blood Bank APIs

### GET /blood-bank/availability
Check blood availability
```
?bloodGroup=O+
```

### POST /blood-bank/request
Request blood units
```json
{
  "patientName": "John Doe",
  "bloodGroup": "O+",
  "unitsRequired": 2,
  "urgency": "high",
  "requiredBy": "2024-01-15T10:00:00Z",
  "contactNumber": "9876543210",
  "hospitalLocation": "ICU Ward 3",
  "patientCondition": "Post-surgery blood loss"
}
```

### GET /blood-bank/my-requests
Get user's blood requests

---

## 📝 Feedback APIs

### POST /feedback/submit
Submit feedback with NPS scoring
```json
{
  "appointmentId": "appointment_id",
  "doctorId": "doctor_id",
  "type": "appointment",
  "rating": {
    "overall": 5,
    "doctorRating": 5,
    "facilityRating": 4,
    "serviceRating": 5
  },
  "npsScore": 9,
  "comments": "Excellent service",
  "suggestions": "More parking space needed",
  "wouldRecommend": true,
  "visitDate": "2024-01-15",
  "department": "Cardiology"
}
```

### GET /feedback/form/:appointmentId
Get feedback form for completed appointment

### GET /feedback/my-feedback
Get user's feedback history

---

## 🗺️ Navigation APIs

### GET /navigation/directions
Get indoor navigation directions
```
?department=cardiology&roomNumber=2-A-301
```

### GET /navigation/floor-map
Get complete hospital floor map

### GET /navigation/search
Search locations in hospital
```
?query=pharmacy
```

---

## 💰 Bill Estimation APIs

### POST /bill/estimate
Generate treatment cost estimate
```json
{
  "patientName": "John Doe",
  "doctorId": "doctor_id",
  "services": [
    {
      "name": "ECG",
      "type": "test",
      "quantity": 1,
      "unitPrice": 500
    },
    {
      "name": "Blood Test",
      "type": "test",
      "quantity": 1,
      "unitPrice": 800
    }
  ]
}
```

### GET /bill/my-estimates
Get user's bill estimates

### GET /bill/estimate/:estimateId
Get detailed estimate

---

## 💻 Video Consultation APIs

### POST /video-consultation/book
Book video consultation
```json
{
  "doctorId": "doctor_id",
  "patientName": "John Doe",
  "scheduledDate": "2024-01-15",
  "scheduledTime": "10:00",
  "symptoms": "Chest pain and shortness of breath"
}
```

### GET /video-consultation/my-consultations
Get user's video consultations

### GET /video-consultation/:consultationId/join
Join video consultation (returns meeting details)

---

## 🚑 Ambulance APIs

### POST /ambulance/request
Request ambulance service
```json
{
  "patientName": "John Doe",
  "contactNumber": "9876543210",
  "pickupLocation": {
    "address": "123 Main Street, Bangalore",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "landmark": "Near City Mall"
  },
  "destination": {
    "address": "Sunrise Hospital, Bangalore",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "emergencyType": "cardiac",
  "urgency": "critical",
  "patientCondition": "Chest pain, difficulty breathing"
}
```

### GET /ambulance/request/:requestId
Get ambulance request status

### GET /ambulance/my-requests
Get user's ambulance requests

### DELETE /ambulance/request/:requestId
Cancel ambulance request

---

## 🔧 Admin APIs

### GET /admin/doctors
Get all doctors (admin only)

### POST /admin/doctors
Create new doctor

### PUT /admin/doctors/:id
Update doctor details

### DELETE /admin/doctors/:id
Delete doctor

### GET /admin/appointments
View all appointments

### GET /admin/users
View all users

### GET /admin/feedback
View all feedback with analytics

### GET /admin/analytics
Get comprehensive analytics dashboard

---

## 🏥 System APIs

### GET /health
System health check
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00Z",
  "database": "connected",
  "ollama": "connected",
  "services": {
    "whatsapp": "ready",
    "reminders": "active",
    "bloodBank": "operational",
    "ambulance": "available"
  }
}
```

---

## 🚨 Emergency Features

### Automatic Emergency Detection
- Detects emergency keywords in multiple languages
- Immediate escalation to human agents
- Automatic ambulance dispatch trigger
- Emergency contact notifications

### Emergency Keywords (Multilingual)
- English: emergency, chest pain, heart attack, accident, bleeding, unconscious
- Hindi: आपातकाल, दिल का दौरा, दुर्घटना, खून
- Tamil: அவசரம், மாரடைப்பு, விபத்து, இரத்தம்
- Telugu: అత్యవసర, గుండెపోటు, ప్రమాదం, రక్తం
- Bengali: জরুরী, হার্ট অ্যাটাক, দুর্ঘটনা, রক্ত
- Marathi: आपत्कालीन, हृदयविकाराचा झटका, अपघात, रक्त

---

## 📱 WhatsApp Integration

### Automated Reminders
- 24-hour appointment reminders
- 2-hour appointment reminders
- Vaccination reminders
- Medicine refill reminders

### OTP Delivery
- Lab report download OTPs
- Account verification OTPs
- Emergency alerts

---

## 🔒 Security Features

### Data Protection
- JWT authentication
- Password hashing with bcrypt
- OTP-protected lab reports
- Encrypted sensitive data

### Privacy Compliance
- UHID/Aadhaar optional fields
- Data anonymization options
- Audit logs for all actions

---

## 📊 Analytics & Reporting

### Patient Analytics
- Appointment patterns
- Department utilization
- Wait time analysis
- Patient satisfaction scores

### Operational Metrics
- Doctor availability optimization
- Resource utilization
- Emergency response times
- Service quality metrics

---

## 🌐 Multilingual Support

### Supported Languages
- English (default)
- Hindi (हिंदी)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Bengali (বাংলা)
- Marathi (मराठी)

### Language Detection
- Automatic language detection from user input
- Manual language selection
- Persistent language preferences

---

## 🚀 Deployment Notes

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/medibot
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=production
OLLAMA_URL=http://localhost:11434
WHATSAPP_API_KEY=your_whatsapp_api_key
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
```

### Production Considerations
- Use MongoDB Atlas for database
- Deploy Ollama on GPU-enabled server
- Configure WhatsApp Business API
- Set up SSL certificates
- Enable rate limiting
- Configure monitoring and logging

---

## 📞 Support

For technical support or API questions:
- Email: support@hospital.com
- Phone: +91-98765-43210
- Emergency: 108

---

*This documentation covers all implemented features of the MediBot system. For the latest updates, please refer to the repository.*