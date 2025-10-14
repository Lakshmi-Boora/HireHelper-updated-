import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

interface ForgotPasswordProps {
  onBackToLogin?: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:2000/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_id: email }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep('otp'); // Move to OTP step directly, no success message
      } else {
        setError(data.msg || 'Failed to send reset email.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
    setLoading(false);
  };

  // Step 2: Verify OTP with backend before allowing password reset
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter the 6-digit OTP sent to your email.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:2000/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_id: email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep('reset');
      } else {
        setOtpError(data.msg || 'Invalid or expired OTP.');
      }
    } catch (err) {
      setOtpError('Server error. Please try again later.');
    }
    setLoading(false);
  };

  // Step 3: Reset Password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    if (!resetPassword || resetPassword.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:2000/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_id: email, newPassword: resetPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Password reset successful!');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setResetError(data.msg || 'Failed to reset password.');
      }
    } catch (err) {
      setResetError('Server error. Please try again later.');
    }
    setLoading(false);
  };

  const getSubHeading = () => {
    if (step === 'email') return 'Enter your email to reset your password';
    if (step === 'otp') return 'Verify the OTP sent to your email';
    if (step === 'reset') return 'Set your new password';
    return '';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mt-16">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img
              src="/WhatsApp Image 2025-08-29 at 13.54.47_e67163a7.jpg"
              alt="HireHelper Logo"
              className="w-14 h-14 rounded-xl"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password</h2>
          <p className="text-gray-600 text-sm">{getSubHeading()}</p>
        </div>

        {/* Step 1: Email input */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 flex items-center justify-center text-sm"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step 2: OTP input */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 text-sm"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                required
              />
            </div>
            {otpError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm">
                {otpError}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 text-sm"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {/* Step 3: Password reset */}
        {step === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-5">
            <div>
              <label htmlFor="resetPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  id="resetPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 text-sm pr-10"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {resetError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm">
                {resetError}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm">
                {success}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 flex items-center justify-center text-sm"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
