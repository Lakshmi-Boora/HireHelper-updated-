import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../api/axios";

interface ForgotPasswordProps {
  onBackToLogin?: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", {
        email_id: email,
      });

      setStep("otp");
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Failed to send OTP");
    }
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");

    if (!otp || otp.length !== 6) {
      setOtpError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/verify-otp", {
        email_id: email,
        otp,
      });

      setStep("reset");
    } catch (err: any) {
      setOtpError(err?.response?.data?.msg || "Invalid or expired OTP.");
    }
    setLoading(false);
  };

  // Step 3: Reset Password
  const handleResetSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setResetError(err?.response?.data?.msg || "Failed to reset password.");
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
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Forgot Password
          </h2>
          <p className="text-gray-600 text-sm">{getSubHeading()}</p>
        </div>

        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <input
              type="email"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />

            {error && <p className="text-red-500">{error}</p>}

            <button className="w-full bg-blue-600 text-white py-2 rounded">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />

            {otpError && <p className="text-red-500">{otpError}</p>}

            <button className="w-full bg-blue-600 text-white py-2 rounded">
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {resetError && <p className="text-red-500">{resetError}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <button className="w-full bg-blue-600 text-white py-2 rounded">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={onBackToLogin}
            className="text-blue-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
