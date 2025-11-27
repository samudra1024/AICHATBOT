import { useState, useEffect } from 'react';
import api from '../services/api';

const DoctorSearchModal = ({ onClose, onSelectDoctor }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
    fetchDoctors();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDoctors();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/doctor/departments');
      if (response.data.success) {
        setDepartments(response.data.departments);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.name = searchTerm;
      if (selectedDepartment) params.department = selectedDepartment;

      const response = await api.get('/doctor/search', { params });
      if (response.data.success) {
        setDoctors(response.data.doctors);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Find a Doctor</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Search & Filter */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search by doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedDepartment('')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${!selectedDepartment
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'
                }`}
            >
              All Departments
            </button>
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedDepartment === dept
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'
                  }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="text-4xl mb-3">👨‍⚕️</div>
              <p>No doctors found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map(doctor => (
                <div
                  key={doctor._id}
                  className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer group"
                  onClick={() => onSelectDoctor(doctor)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      👨‍⚕️
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{doctor.name}</h3>
                      <p className="text-sm text-primary font-medium mb-1">{doctor.department}</p>
                      <p className="text-xs text-slate-500 mb-2">{doctor.qualification}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md">
                          {doctor.experience}+ Years Exp.
                        </span>
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                          ₹{doctor.fees.consultation}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSearchModal;
