import { useState, useEffect } from 'react';
import api from '../services/api';

const FeeStructureModal = ({ onClose }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      // We'll fetch doctors to get their fees and aggregate by department
      const response = await api.get('/doctor/search');
      if (response.data.success) {
        const doctors = response.data.doctors;
        const deptMap = {};

        doctors.forEach(doc => {
          if (!deptMap[doc.department]) {
            deptMap[doc.department] = {
              name: doc.department,
              minFee: doc.fees.consultation,
              maxFee: doc.fees.consultation,
              doctors: []
            };
          }

          deptMap[doc.department].minFee = Math.min(deptMap[doc.department].minFee, doc.fees.consultation);
          deptMap[doc.department].maxFee = Math.max(deptMap[doc.department].maxFee, doc.fees.consultation);
          deptMap[doc.department].doctors.push(doc);
        });

        setDepartments(Object.values(deptMap));
      }
    } catch (error) {
      console.error('Error fetching fees:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-green-50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
              💰
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Fee Structure</h2>
              <p className="text-sm text-slate-500">Consultation charges by department</p>
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
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map(dept => (
                  <div key={dept.name} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all">
                    <h3 className="font-bold text-lg text-slate-800 mb-2">{dept.name}</h3>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Consultation Fee</p>
                        <p className="text-2xl font-bold text-green-600">
                          {dept.minFee === dept.maxFee
                            ? `₹${dept.minFee}`
                            : `₹${dept.minFee} - ₹${dept.maxFee}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                          {dept.doctors.length} Doctors
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2">Note:</h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Registration charges of ₹50 applicable for new patients.</li>
                  <li>Follow-up consultation fees are generally 50-70% of initial consultation.</li>
                  <li>Emergency charges may vary.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeeStructureModal;
