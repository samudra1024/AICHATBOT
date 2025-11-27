import { useState, useEffect } from 'react';
import api from '../services/api';

const DepartmentListModal = ({ onClose }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/department');
      if (response.data.success) {
        setDepartments(response.data.departments);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-purple-50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
              🏥
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Departments</h2>
              <p className="text-sm text-slate-500">Our specialized medical centers</p>
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
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* List */}
          <div className="w-full md:w-1/3 border-r border-gray-100 overflow-y-auto bg-gray-50/50">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {departments.map(dept => (
                  <button
                    key={dept._id}
                    onClick={() => setSelectedDept(dept)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${selectedDept?._id === dept._id
                        ? 'bg-white shadow-md border-l-4 border-purple-500 text-purple-700'
                        : 'hover:bg-white hover:shadow-sm text-slate-600'
                      }`}
                  >
                    <h3 className="font-bold">{dept.name}</h3>
                    <p className="text-xs opacity-70 truncate">{dept.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {selectedDept ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedDept.name}</h2>
                  <p className="text-slate-600 leading-relaxed">{selectedDept.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <h4 className="font-bold text-purple-800 mb-2 text-sm uppercase tracking-wider">Head of Department</h4>
                    <p className="font-semibold text-slate-800">{selectedDept.headOfDepartment}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-800 mb-2 text-sm uppercase tracking-wider">Location</h4>
                    <p className="font-semibold text-slate-800">{selectedDept.floor}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-3">Services Offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDept.services.map((service, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-slate-700 rounded-full text-sm font-medium">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-3">OPD Timings</h4>
                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-100/50">
                          <td className="px-4 py-3 font-medium text-slate-600">Weekdays</td>
                          <td className="px-4 py-3 text-slate-800">{selectedDept.opdTimings.weekdays.start} - {selectedDept.opdTimings.weekdays.end}</td>
                        </tr>
                        <tr className="hover:bg-gray-100/50">
                          <td className="px-4 py-3 font-medium text-slate-600">Saturday</td>
                          <td className="px-4 py-3 text-slate-800">{selectedDept.opdTimings.saturday.start} - {selectedDept.opdTimings.saturday.end}</td>
                        </tr>
                        <tr className="hover:bg-gray-100/50">
                          <td className="px-4 py-3 font-medium text-slate-600">Sunday</td>
                          <td className="px-4 py-3 text-slate-800">{selectedDept.opdTimings.sunday.start} - {selectedDept.opdTimings.sunday.end}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="text-6xl mb-4 opacity-20">🏥</div>
                <p>Select a department to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentListModal;
