import { useState, useEffect } from 'react';
import api from '../services/api';

const BookingModal = ({ doctor, onClose, onSuccess }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availability, setAvailability] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null); // 'morning', 'afternoon', 'evening'
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (doctor && selectedDate) {
      fetchAvailability();
    }
  }, [doctor, selectedDate]);

  const fetchAvailability = async () => {
    setLoading(true);
    setAvailability(null);
    setError('');
    try {
      const response = await api.get(`/doctor/${doctor._id}/availability?date=${selectedDate}`);
      if (response.data.success) {
        setAvailability(response.data.slots);
      }
    } catch (err) {
      setError('Failed to fetch availability');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedSlot || !patientName) {
      setError('Please select a slot and enter patient name');
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      const response = await api.post('/appointment/book', {
        doctorId: doctor._id,
        date: selectedDate,
        slot: selectedSlot,
        time: availability[selectedSlot].start, // Default to start time for now
        patientName,
        notes
      });

      if (response.data.success) {
        onSuccess(response.data.appointment);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-primary/5 to-transparent">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Book Appointment</h2>
            <p className="text-sm text-slate-500">Dr. {doctor.name} - {doctor.department}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          {/* Slots Grid */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Available Slots</label>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : error && !availability ? (
              <div className="text-red-500 text-sm text-center py-4 bg-red-50 rounded-xl">{error}</div>
            ) : availability ? (
              <div className="grid grid-cols-1 gap-3">
                {['morning', 'afternoon', 'evening'].map((slot) => {
                  const slotData = availability[slot];
                  const isAvailable = slotData?.available;
                  const isSelected = selectedSlot === slot;

                  return (
                    <button
                      key={slot}
                      onClick={() => isAvailable && setSelectedSlot(slot)}
                      disabled={!isAvailable}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${!isAvailable
                          ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'
                          : isSelected
                            ? 'bg-primary/5 border-primary shadow-sm'
                            : 'bg-white border-gray-100 hover:border-primary/50 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-semibold capitalize ${isSelected ? 'text-primary' : 'text-slate-700'}`}>
                          {slot}
                        </span>
                        {isAvailable && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                            {slotData.slotsLeft} slots left
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-500">
                        {slotData?.start} - {slotData?.end}
                      </div>
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl backdrop-blur-[1px]">
                          <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                            Unavailable
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Patient Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Patient Name</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any symptoms or specific concerns?"
                rows="2"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Fees Info */}
          <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center">
            <span className="text-blue-700 font-medium">Consultation Fee</span>
            <span className="text-blue-800 font-bold text-lg">₹{doctor.fees.consultation}</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              onClick={handleBook}
              disabled={bookingLoading || !selectedSlot || !patientName}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {bookingLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Booking...
                </span>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
