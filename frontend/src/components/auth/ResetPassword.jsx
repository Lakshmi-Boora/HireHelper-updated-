import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // toggle new password
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // toggle confirm password
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (!password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        // Simulate API call for resetting password
        setTimeout(() => {
            setSuccess(true);
        }, 1000);
    };
    return (<div className="w-full max-w-md mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mt-16">
        {/* Logo & Title */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img src="/WhatsApp Image 2025-08-29 at 13.54.47_e67163a7.jpg" alt="HireHelper Logo" className="w-14 h-14 rounded-xl"/>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Reset Password
          </h2>
          <p className="text-gray-600 text-sm">
            Enter a new password for your account
          </p>
        </div>

        {success ? (<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-center text-sm mb-4">
            Your password has been reset successfully.
          </div>) : (<form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input id="password" type={showPassword ? "text" : "password"} className="w-full pr-10 px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter new password" autoComplete="new-password"/>
              <div className="absolute right-3 top-9 cursor-pointer text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff /> : <Eye />}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} className="w-full pr-10 px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 text-sm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm new password" autoComplete="new-password"/>
              <div className="absolute right-3 top-9 cursor-pointer text-gray-400" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </div>
            </div>

            {/* Error Message */}
            {error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm">
                {error}
              </div>)}

            {/* Submit Button */}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 flex items-center justify-center text-sm">
              Reset Password
            </button>
          </form>)}

        {/* Back to Login */}
        <div className="mt-5 text-center">
          <button type="button" onClick={() => navigate("/login")} className="text-blue-600 hover:text-blue-700 font-semibold transition-colors text-sm">
            Back to Login
          </button>
        </div>
      </div>
    </div>);
};
export default ResetPassword;
