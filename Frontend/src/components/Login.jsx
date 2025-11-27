import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    age: '',
    gender: '',
    uhid: '',
    aadhaar: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister
        ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile,
          age: formData.age,
          gender: formData.gender,
          uhid: formData.uhid,
          aadhaar: formData.aadhaar
        }
        : {
          email: formData.email,
          password: formData.password
        };

      const response = await api.post(endpoint, payload);

      if (response.data.success) {
        login(response.data.user, response.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', mobile: '', age: '', gender: '', uhid: '', aadhaar: '' });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[60px] opacity-30 bg-gradient-to-br from-primary to-secondary -top-24 -left-24 animate-float"></div>
        <div className="absolute w-[350px] h-[350px] rounded-full blur-[60px] opacity-30 bg-gradient-to-br from-purple-500 to-purple-700 -bottom-24 -right-24 animate-float" style={{ animationDelay: '7s' }}></div>
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[60px] opacity-30 bg-gradient-to-br from-pink-400 to-red-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: '14s' }}></div>
      </div>

      {/* Login Card */}
      <div className="glass relative z-10 w-full max-w-md p-10 rounded-3xl fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl shadow-md animate-pulse-slow">
              🏥
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
              MediBot
            </h1>
          </div>
          <p className="text-slate-500 text-base">AI Hospital Reception Assistant</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error fade-in">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          {isRegister && (
            <div className="input-group">
              <label className="input-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="input"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Email Address *</label>
            <input
              type="email"
              name="email"
              className="input"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password *</label>
            <input
              type="password"
              name="password"
              className="input"
              placeholder={isRegister ? "Create a password (min 6 characters)" : "Enter your password"}
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          {isRegister && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label">Age</label>
                  <input
                    type="number"
                    name="age"
                    className="input"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    max="120"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Gender</label>
                  <select
                    name="gender"
                    className="input"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Mobile Number (Optional)</label>
                <input
                  type="tel"
                  name="mobile"
                  className="input"
                  placeholder="10-digit mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  maxLength="10"
                />
              </div>

              <div className="input-group">
                <label className="input-label">UHID (Optional)</label>
                <input
                  type="text"
                  name="uhid"
                  className="input"
                  placeholder="Hospital ID if you have one"
                  value={formData.uhid}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Aadhaar Number (Optional)</label>
                <input
                  type="text"
                  name="aadhaar"
                  className="input"
                  placeholder="12-digit Aadhaar number"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  pattern="[0-9]{12}"
                  maxLength="12"
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner w-5 h-5"></div>
                {isRegister ? 'Creating Account...' : 'Logging in...'}
              </>
            ) : (
              <>{isRegister ? 'Create Account' : 'Login'}</>
            )}
          </button>

          <div className="text-center mt-6">
            <button
              type="button"
              className="bg-transparent border-0 text-primary font-semibold cursor-pointer transition-all duration-300 hover:text-primary-dark hover:underline"
              onClick={() => {
                setIsRegister(!isRegister);
                resetForm();
              }}
            >
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-gray-300 text-slate-500">
          <p className="mb-1">🔒 Secure & Private</p>
          <p className="text-sm text-slate-400">
            Powered by Gemma-3 AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
