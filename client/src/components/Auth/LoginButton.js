// components/Auth/LoginButton.jsx
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { FaGoogle } from 'react-icons/fa';
import { Loader2, LogOut, User } from 'lucide-react';

const LoginButton = ({ variant = 'primary', onLoginSuccess }) => {
  const { user, logout, loginWithToken, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      
      // Send the JWT token to your backend for verification
      await loginWithToken(credentialResponse.credential);
      
      // Call the success callback if provided (for modal handling)
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error('❌ Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = () => {
    console.error('❌ Google login failed');
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate initials from user name with fallback
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2); // Limit to 2 characters
  };

  if (user) {
    const initials = getInitials(user.name);

    return (
      <div className="flex items-center gap-3">
        {/* Enhanced Profile Avatar with Fallback */}
        <div className="relative group">
          {user.profilePicture ? (
            <div className="relative">
              <img
                src={user.profilePicture}
                alt={user.name || 'User'}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/30 dark:border-white/20 shadow-lg transition-all duration-200 group-hover:scale-105"
                onError={(e) => {
                  // If image fails to load, hide the img element
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback initials circle (hidden by default) */}
              <div className="hidden w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#a855f7] items-center justify-center text-white font-bold text-sm select-none border-2 border-white/30 dark:border-white/20 shadow-lg transition-all duration-200 group-hover:scale-105">
                {initials || <User className="w-5 h-5" />}
              </div>
            </div>
          ) : (
            /* Default initials circle */
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white font-bold text-sm select-none border-2 border-white/30 dark:border-white/20 shadow-lg transition-all duration-200 group-hover:scale-105">
              {initials || <User className="w-5 h-5" />}
            </div>
          )}
          
          {/* Enhanced hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
        </div>

        {/* Enhanced Logout Button with Theme Colors */}
        <button
          onClick={handleLogout}
          disabled={isLoading || loading}
          className="group relative inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 bg-red-500/80 dark:bg-red-500/70 backdrop-blur-sm hover:bg-red-600 text-white shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed border border-red-400/30 dark:border-red-400/20 hover:border-red-300/50"
        >
          {/* Button loading overlay */}
          {(isLoading || loading) && (
            <div className="absolute inset-0 bg-red-600/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            </div>
          )}
          
          <div className="flex items-center gap-2 relative z-10">
            {!(isLoading || loading) && <LogOut className="w-4 h-4" />}
            <span>{(isLoading || loading) ? 'Signing out...' : 'Sign Out'}</span>
          </div>
        </button>
      </div>
    );
  }

  // **FIXED**: No container wrapper around GoogleLogin - this removes the light lines
  return (
    <div className="relative">
      {/* Loading Overlay positioned over the button directly */}
      {(isLoading || loading) && (
        <div className="absolute inset-0 bg-white/90 dark:bg-black/90 rounded-xl flex items-center justify-center z-10 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-[#6366f1]/30 border-t-[#6366f1] rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Signing in...
            </span>
          </div>
        </div>
      )}

      {/* Direct GoogleLogin component - no wrapper container */}
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        useOneTap={false}
        size="large"
        text="signin_with"
        shape="rectangular"
        logo_alignment="left"
      />

      {/* Custom styled button alternative */}
      {variant === 'custom' && (
        <button
          onClick={() => {/* Trigger Google login */}}
          disabled={isLoading || loading}
          className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl text-gray-700 dark:text-gray-300 hover:text-[#6366f1] dark:hover:text-[#a855f7] transition-all duration-200 font-medium group-hover:scale-105"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-200"></div>
            <FaGoogle className="w-5 h-5 text-red-500 relative z-10" />
          </div>
          <span>Sign in with Google</span>
        </button>
      )}
    </div>
  );
};

export default LoginButton;
