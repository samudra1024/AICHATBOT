import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DoctorSearchModal from './DoctorSearchModal';
import BookingModal from './BookingModal';
import FeeStructureModal from './FeeStructureModal';
import DepartmentListModal from './DepartmentListModal';
import HospitalInfoModal from './HospitalInfoModal';
import { toast } from "react-toastify";

const ChatWindow = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const messagesEndRef = useRef(null);
  const [showDoctorSearch, setShowDoctorSearch] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showQuickTaskDropdown, setShowQuickTaskDropdown] = useState(false);

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Kannada'];

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const response = await api.get('/chat/history');
      if (response.data.success) {
        setMessages(response.data.messages);
        setLanguage(response.data.language);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast.error('Failed to load chat history');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const response = await api.post('/chat/message', {
        message: userMessage,
        language
      });

      if (response.data.success) {
        const botMessage = {
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date(),
          isEmergency: response.data.isEmergency
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm('Are you sure you want to clear all chat history?')) return;

    try {
      const response = await api.delete('/chat/clear');
      if (response.data.success) {
        setMessages([]);
        toast.success('Chat history cleared successfully', { autoClose: 2000 })
      }
    } catch (error) {
      toast.error('Failed to clear chat');
    }
  };

  const handleLanguageChange = async (newLang) => {
    setLanguage(newLang);
    try {
      await api.put('/chat/language', { language: newLang });
      toast.success(`Language changed to ${newLang}`);
    } catch (error) {
      console.error('Error updating language:', error);
      toast.error('Failed to update language');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorSearch(false);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = (appointment) => {
    const successMessage = {
      role: 'assistant',
      content: `✅ Appointment confirmed with Dr. ${appointment.doctorId.name} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} (${appointment.slot}).`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, successMessage]);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-medical-blue via-primary to-medical-teal">
      {/* Header */}
      <div className="glass flex justify-between items-center px-6 py-4 border-b border-neutral-200/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-medical-blue to-medical-teal flex items-center justify-center text-2xl shadow-lg">
            🏥
          </div>
          <div>
            <h3 className="text-xl font-bold m-0">MediBot</h3>
            <p className="flex items-center gap-2 text-sm text-neutral-600 m-0">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse-slow"></span> Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* QuickTask Dropdown */}
          <div className="relative">
            <button
              className="px-4 py-2 border-2 border-neutral-200 rounded-xl bg-white/95 text-sm font-semibold cursor-pointer transition-all duration-300 hover:border-primary hover:bg-white hover:shadow-lg focus:border-primary focus:outline-none flex items-center gap-2"
              onClick={() => setShowQuickTaskDropdown(!showQuickTaskDropdown)}
            >
              ⚡ QuickTask
              <span className={`transition-transform duration-200 ${showQuickTaskDropdown ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {showQuickTaskDropdown && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-neutral-200/50 z-50">
                <div className="py-2">
                  <button
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 text-sm font-medium"
                    onClick={() => {
                      setShowDoctorSearch(true);
                      setShowQuickTaskDropdown(false);
                    }}
                  >
                    📅 Book Appointments
                  </button>
                  <button
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 text-sm font-medium"
                    onClick={() => {
                      setShowDoctorSearch(true);
                      setShowQuickTaskDropdown(false);
                    }}
                  >
                    👨‍⚕️ Find Doctors
                  </button>
                  <button
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 text-sm font-medium"
                    onClick={() => {
                      setShowFeeModal(true);
                      setShowQuickTaskDropdown(false);
                    }}
                  >
                    💰 Check Fees
                  </button>
                  <button
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 text-sm font-medium"
                    onClick={() => {
                      setShowDeptModal(true);
                      setShowQuickTaskDropdown(false);
                    }}
                  >
                    🏥 Departments
                  </button>
                  <button
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 text-sm font-medium"
                    onClick={() => {
                      setShowInfoModal(true);
                      setShowQuickTaskDropdown(false);
                    }}
                  >
                    ℹ️ Hospital Info
                  </button>
                </div>
              </div>
            )}
          </div>

          <select
            className="px-4 py-2 border-2 border-neutral-200 rounded-xl bg-white/95 text-sm font-semibold cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-lg focus:border-primary focus:outline-none"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <button
            className="w-10 h-10 border-0 bg-neutral-100 rounded-full text-xl cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-neutral-200 hover:scale-110 hover:shadow-lg"
            onClick={handleClearChat}
            title="Clear Chat"
          >
            🗑️
          </button>

          {user?.isAdmin && (
            <button
              className="w-10 h-10 border-0 bg-neutral-100 rounded-full text-xl cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-neutral-200 hover:scale-110 hover:shadow-lg"
              onClick={() => navigate('/admin')}
              title="Admin Panel"
            >
              ⚙️
            </button>
          )}

          <button
            className="w-10 h-10 border-0 bg-neutral-100 rounded-full text-xl cursor-pointer transition-all duration-300 flex items-center justify-center hover:bg-neutral-200 hover:scale-110 hover:shadow-lg"
            onClick={logout}
            title="Logout"
          >
            🚪
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 bg-gradient-to-b from-neutral-50 to-white">
        {messages.length === 0 ? (
          <div className="text-center max-w-2xl mx-auto px-4 py-12">
            <div className="text-8xl mb-4 animate-pulse-slow">🏥</div>
            <h2 className="mb-2">Welcome to MediBot!</h2>
            <p className="text-neutral-600 mb-8">Your 24×7 AI Hospital Assistant</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div
                className="p-4 bg-white rounded-xl shadow-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                onClick={() => setShowDoctorSearch(true)}
              >
                📅 Book Appointments
              </div>
              <div
                className="p-4 bg-white rounded-xl shadow-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                onClick={() => setShowDoctorSearch(true)}
              >
                👨‍⚕️ Find Doctors
              </div>
              <div
                className="p-4 bg-white rounded-xl shadow-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                onClick={() => setShowFeeModal(true)}
              >
                💰 Check Fees
              </div>
              <div
                className="p-4 bg-white rounded-xl shadow-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                onClick={() => setShowDeptModal(true)}
              >
                🏥 Departments
              </div>
              <div
                className="p-4 bg-white rounded-xl shadow-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                onClick={() => setShowInfoModal(true)}
              >
                ℹ️ Hospital Info
              </div>
            </div>
            <p className="text-neutral-500 text-sm">Type a message to get started!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-4 fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] px-4 py-3.5 rounded-2xl relative ${msg.role === 'user'
                ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-md rounded-br-sm'
                : msg.isEmergency
                  ? 'bg-gradient-to-br from-red-500 to-red-600 text-white border-2 border-red-700 animate-pulse-slow'
                  : 'bg-white text-slate-900 shadow-sm rounded-bl-sm'
                }`}>
                {msg.isEmergency && (
                  <div className="bg-white/30 px-3 py-1 rounded-lg text-xs font-bold mb-2 inline-block">
                    🚨 EMERGENCY
                  </div>
                )}
                <div className="whitespace-pre-wrap break-words leading-relaxed">
                  {msg.content}
                </div>
                <div className="text-xs opacity-70 mt-2 text-right">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start mb-4 fade-in">
            <div className="max-w-[70%] px-4 py-3.5 rounded-2xl bg-white shadow-sm">
              <div className="flex gap-1 py-2">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-typing"></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-typing" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-typing" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass px-6 py-4 border-t border-neutral-200/50">
        <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
          <input
            type="text"
            className="flex-1 px-5 py-3.5 border-2 border-neutral-200 rounded-full text-base font-sans bg-white/95 transition-all duration-300 outline-none hover:border-primary/50 focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="w-12 h-12 border-0 bg-gradient-to-r from-primary to-primary-light rounded-full text-white text-2xl cursor-pointer transition-all duration-300 flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!inputMessage.trim() || loading}
          >
            <span>📤</span>
          </button>
        </form>
      </div>

      {/* Modals */}
      {showDoctorSearch && (
        <DoctorSearchModal
          onClose={() => setShowDoctorSearch(false)}
          onSelectDoctor={handleSelectDoctor}
        />
      )}

      {showBookingModal && selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {showFeeModal && (
        <FeeStructureModal
          onClose={() => setShowFeeModal(false)}
        />
      )}

      {showDeptModal && (
        <DepartmentListModal
          onClose={() => setShowDeptModal(false)}
        />
      )}

      {showInfoModal && (
        <HospitalInfoModal
          onClose={() => setShowInfoModal(false)}
        />
      )}
    </div>
  );
};

export default ChatWindow;
