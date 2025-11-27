import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'doctors') {
        const response = await api.get('/admin/doctors');
        setDoctors(response.data.doctors || []);
      } else if (activeTab === 'appointments') {
        const response = await api.get('/admin/appointments');
        setAppointments(response.data.appointments || []);
      } else if (activeTab === 'users') {
        const response = await api.get('/admin/users');
        setUsers(response.data.users || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="glass p-8 rounded-2xl mb-8 flex justify-between items-center">
        <div>
          <h2 className="m-0 mb-2">⚙️ Admin Panel</h2>
          <p className="m-0 text-slate-500">Manage hospital data and view analytics</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/chat')}>
          ← Back to Chat
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b-2 border-gray-300 bg-gray-100">
          <button
            className={`flex-1 px-5 py-5 border-0 bg-transparent text-base font-semibold cursor-pointer transition-all duration-300 border-b-[3px] border-transparent hover:bg-white ${activeTab === 'doctors' ? 'bg-white border-b-primary text-primary' : ''
              }`}
            onClick={() => setActiveTab('doctors')}
          >
            👨‍⚕️ Doctors
          </button>
          <button
            className={`flex-1 px-5 py-5 border-0 bg-transparent text-base font-semibold cursor-pointer transition-all duration-300 border-b-[3px] border-transparent hover:bg-white ${activeTab === 'appointments' ? 'bg-white border-b-primary text-primary' : ''
              }`}
            onClick={() => setActiveTab('appointments')}
          >
            📅 Appointments
          </button>
          <button
            className={`flex-1 px-5 py-5 border-0 bg-transparent text-base font-semibold cursor-pointer transition-all duration-300 border-b-[3px] border-transparent hover:bg-white ${activeTab === 'users' ? 'bg-white border-b-primary text-primary' : ''
              }`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
        </div>

        {/* Panel Content */}
        <div className="p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="spinner mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'doctors' && (
                <div>
                  <h3 className="mb-6 text-slate-900">Doctors ({doctors.length})</h3>
                  <div className="overflow-x-auto rounded-xl border border-gray-300">
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 border-b-2 border-gray-300">Name</th>
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 border-b-2 border-gray-300">Department</th>
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 border-b-2 border-gray-300">Specialization</th>
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 border-b-2 border-gray-300">Experience</th>
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 border-b-2 border-gray-300">Fees</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctors.map(doctor => (
                          <tr key={doctor._id} className="hover:bg-gray-100">
                            <td className="px-4 py-4 border-b border-gray-300">{doctor.name}</td>
                            <td className="px-4 py-4 border-b border-gray-300">{doctor.department}</td>
                            <td className="px-4 py-4 border-b border-gray-300">{doctor.specialization}</td>
                            <td className="px-4 py-4 border-b border-gray-300">{doctor.experience} years</td>
                            <td className="px-4 py-4 border-b border-gray-300">₹{doctor.fees?.consultation || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'appointments' && (
                <div>
                  <h3 className="mb-6 text-slate-900">Appointments ({appointments.length})</h3>
                  <div className="overflow-x-auto rounded-xl border border-gray-300">
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 border-b-2 border-gray-300">Patient</th>
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 border-b-2 border-gray-300">Doctor</th>
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 border-b-2 border-gray-300">Date</th>
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 border-b-2 border-gray-300">Slot</th>
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 border-b-2 border-gray-300">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map(apt => (
                          <tr key={apt._id} className="hover:bg-gray-100">
                            <td className="px-4 py-4 border-b border-gray-300">{apt.patientName}</td>
                            <td className="px-4 py-4 border-b border-gray-300">{apt.doctorId?.name || 'N/A'}</td>
                            <td className="px-4 py-4 border-b border-gray-300">{new Date(apt.date).toLocaleDateString()}</td>
                            <td className="px-4 py-4 border-b border-gray-300">{apt.slot}</td>
                            <td className="px-4 py-4 border-b border-gray-300">
                              <span className={`badge ${apt.status === 'scheduled' ? 'badge-success' : 'badge-warning'}`}>
                                {apt.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <h3 className="mb-6 text-slate-900">Users ({users.length})</h3>
                  <div className="overflow-x-auto rounded-xl border border-gray-300">
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 border-b-2 border-gray-300">Name</th>
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 border-b-2 border-gray-300">Email</th>
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 border-b-2 border-gray-300">Mobile</th>
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 border-b-2 border-gray-300">UHID</th>
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 border-b-2 border-gray-300">Admin</th>
                          <th className="px-4 py-4 text-left font-semibold text-slate-900 border-b-2 border-gray-300">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user._id} className="hover:bg-gray-100">
                            <td className="px-4 py-4 border-b border-gray-300">{user.name}</td>
                            <td className="px-4 py-4 border-b border-gray-300">{user.email}</td>
                            <td className="px-4 py-4 border-b border-gray-300">{user.mobile || 'N/A'}</td>
                            <td className="px-4 py-4 border-b border-gray-300">{user.uhid || 'N/A'}</td>
                            <td className="px-4 py-4 border-b border-gray-300">{user.isAdmin ? '✅' : '❌'}</td>
                            <td className="px-4 py-4 border-b border-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
