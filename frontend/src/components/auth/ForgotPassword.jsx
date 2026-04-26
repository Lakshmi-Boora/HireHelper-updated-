import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../api/axios";

const ForgotPassword = ({ onBackToLogin }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState("email");
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const [otpError, setOtpError] = useState("");
    const [resetPassword, setResetPassword] = useState("");
    const [resetError, setResetError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (step === "otp") {
            inputRefs.current[0]?.focus();
        }
    }, [step]);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
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

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email) {
            setError("Please enter your email address.");
            return;
        }
        setLoading(true);
        try {
            await api.post("/auth/forgot-password", { email_id: email });
            setStep("otp");
        } catch (err) {
            const errorMsg = err?.response?.data?.msg || "Failed to send OTP";
            setError(errorMsg);
            alert(errorMsg);
        }
        setLoading(false);
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setOtpError("");
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            setOtpError("Please enter the 6-digit OTP.");
            return;
        }
        setLoading(true);
        try {
            await api.post("/auth/verify-otp", {
                email_id: email,
                otp: otpString,
            });
            setStep("reset");
        } catch (err) {
            const errorMsg = err?.response?.data?.msg || "Invalid or expired OTP.";
            setOtpError(errorMsg);
            alert(errorMsg);
        }
        setLoading(false);
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setResetError("");
        if (!resetPassword || resetPassword.length < 6) {
            setResetError("Password must be at least 6 characters.");
            return;
        }
        setLoading(true);
        try {
            await api.post("/auth/reset-password", {
                email_id: email,
                newPassword: resetPassword,
            });
            setSuccess("Password reset successful!");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            const errorMsg = err?.response?.data?.msg || "Failed to reset password.";
            setResetError(errorMsg);
            alert(errorMsg);
        }
        setLoading(false);
    };

    const getSubHeading = () => {
        if (step === "email") return "Enter your email to reset your password";
        if (step === "otp") return "Verify the OTP sent to your email";
        if (step === "reset") return "Set your new password";
        return "";
    };

    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mt-16">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password</h2>
            <p className="text-gray-600 text-sm">{getSubHeading()}</p>
          </div>

          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <input type="email" className="w-full px-3 py-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
              {error && <p className="text-red-500 text-center">{error}</p>}
              <button className="w-full bg-blue-600 text-white py-2 rounded">
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="flex justify-center space-x-3 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                  />
                ))}
              </div>
              {otpError && <p className="text-red-500 text-center">{otpError}</p>}
              <button className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition duration-200">
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border rounded"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="New Password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2">
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {resetError && <p className="text-red-500 text-center">{resetError}</p>}
              {success && <p className="text-green-500 text-center">{success}</p>}
              <button className="w-full bg-blue-600 text-white py-2 rounded">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="mt-4 text-center">
            <button onClick={onBackToLogin} className="text-blue-600 hover:underline">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
};
export default ForgotPassword;
