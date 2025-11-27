const HospitalInfoModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
              ℹ️
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Hospital Info</h2>
              <p className="text-sm text-slate-500">Contact & Timings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Emergency Banner */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
            <div className="text-2xl">🚑</div>
            <div>
              <h3 className="font-bold text-red-700">24x7 Emergency Services</h3>
              <p className="text-sm text-red-600">Trauma Care, Cardiac Emergency, Stroke Unit</p>
              <p className="text-lg font-bold text-red-800 mt-1">Call: 1066 / +91-98765-43210</p>
            </div>
          </div>

          {/* Timings */}
          <div>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span>🕒</span> OPD Timings
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Monday - Saturday</span>
                <span className="font-semibold text-slate-800">08:00 AM - 08:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Sunday</span>
                <span className="font-semibold text-slate-800">10:00 AM - 02:00 PM</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-slate-600">Visiting Hours</span>
                <span className="font-semibold text-slate-800">04:00 PM - 07:00 PM</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span>📍</span> Contact & Location
            </h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p className="flex gap-3">
                <span className="font-semibold min-w-[60px]">Address:</span>
                <span>123 Health Avenue, Medical District, Cityville - 560001</span>
              </p>
              <p className="flex gap-3">
                <span className="font-semibold min-w-[60px]">Phone:</span>
                <span>+91-80-1234-5678</span>
              </p>
              <p className="flex gap-3">
                <span className="font-semibold min-w-[60px]">Email:</span>
                <span>info@medibot-hospital.com</span>
              </p>
              <p className="flex gap-3">
                <span className="font-semibold min-w-[60px]">Website:</span>
                <span>www.medibot-hospital.com</span>
              </p>
            </div>
          </div>

          {/* Facilities */}
          <div>
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span>🏥</span> Key Facilities
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded-lg text-center border border-gray-100">ICU / NICU</div>
              <div className="bg-gray-50 p-2 rounded-lg text-center border border-gray-100">Modular OT</div>
              <div className="bg-gray-50 p-2 rounded-lg text-center border border-gray-100">Pharmacy 24x7</div>
              <div className="bg-gray-50 p-2 rounded-lg text-center border border-gray-100">Diagnostics</div>
              <div className="bg-gray-50 p-2 rounded-lg text-center border border-gray-100">Blood Bank</div>
              <div className="bg-gray-50 p-2 rounded-lg text-center border border-gray-100">Ambulance</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HospitalInfoModal;
