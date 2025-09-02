// context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    let mounted = true;
    
    const checkAuthStatus = async () => {
      try {
        // console.log('🔍 Checking auth status...');
        
        // Check localStorage first for faster initial load
        const cachedUser = localStorage.getItem('cachedUser');
        if (cachedUser && mounted) {
          // console.log('📦 Found cached user:', JSON.parse(cachedUser));
          setUser(JSON.parse(cachedUser));
          setLoading(false);
        }

        // Then verify with server
        const response = await authAPI.getCurrentUser();
        if (mounted) {
          const userData = response.data.user;
          // console.log('✅ Server confirmed user:', userData);
          setUser(userData);
          localStorage.setItem('cachedUser', JSON.stringify(userData));
        }
      } catch (error) {
        // console.log('❌ Auth check failed:', error);
        if (mounted) {
          setUser(null);
          localStorage.removeItem('cachedUser');
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    checkAuthStatus();
    
    return () => { mounted = false; };
  }, []);

  // NEW: Login with Google JWT token (popup method)
  const loginWithToken = useCallback(async (googleToken) => {
    try {
      // console.log('🔄 Authenticating with Google token...');
      
      // Send token to your backend for verification
      const response = await authAPI.verifyGoogleToken(googleToken);
      const userData = response.data.user;
      
      setUser(userData);
      localStorage.setItem('cachedUser', JSON.stringify(userData));
      
      // console.log('✅ Popup login successful:', userData.email);
      return userData;
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
      setUser(null);
      localStorage.removeItem('cachedUser');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loginWithToken, // NEW
    logout,
    loading,
    initialized
  }), [user, loginWithToken, logout, loading, initialized]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
