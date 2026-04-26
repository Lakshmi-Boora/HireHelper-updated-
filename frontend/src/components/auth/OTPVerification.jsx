import React, { useState, useRef, useEffect } from 'react';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
const OTPVerification = ({ onBack }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);
    const { verifyOTP, isLoading, pendingEmail } = useAuth();
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);
    const handleOtpChange = (index, value) => {
        if (value.length > 1)
            return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }
        setError('');
        const success = await verifyOTP(otpString);
        if (!success) {
            setError('Invalid verification code');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    };
    return (<div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2"/>
          Back
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Mail className="h-8 w-8 text-blue-600"/>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to<br />
            <span className="font-medium">{pendingEmail}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter Verification Code
            </label>
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (<input key={index} ref={(el) => (inputRefs.current[index] = el)} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"/>))}
            </div>
          </div>

          {error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>)}

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center disabled:opacity-50">
            {isLoading ? (<>
                <Loader2 className="animate-spin h-5 w-5 mr-2"/>
                Verifying...
              </>) : ('Verify Code')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Didn't receive the code?{' '}
            <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>);
};
export default OTPVerification;
