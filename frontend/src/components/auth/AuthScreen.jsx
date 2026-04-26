import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import OTPVerification from './OTPVerification';
import ForgotPassword from './ForgotPassword';
import { useAuth } from '../../contexts/AuthContext';
const AuthScreen = () => {
    const [authMode, setAuthMode] = useState('login');
    const { needsVerification } = useAuth();
    if (needsVerification) {
        return (<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <OTPVerification onBack={() => setAuthMode('login')}/>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {authMode === 'login' && (<LoginForm onSwitchToRegister={() => setAuthMode('register')} onSwitchToForgotPassword={() => setAuthMode('forgot-password')}/>)}
      {authMode === 'register' && (<RegisterForm onSwitchToLogin={() => setAuthMode('login')}/>)}
      {authMode === 'forgot-password' && (<ForgotPassword onBackToLogin={() => setAuthMode('login')}/>)}
    </div>);
};
export default AuthScreen;
