import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import LoginButton from '../Auth/LoginButton';
import {
  Sun,
  Moon,
  Menu,
  X,
  Home,
  List,
  Mail,
  User,
  Loader2,
  LogOut
} from 'lucide-react';

const Header = () => {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/sheets', label: 'Sheets', icon: List },
    { path: '/contact', label: 'Contact', icon: Mail }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // **NEW**: Handle login success callback
  const handleLoginSuccess = (userData) => {
    // console.log('Login successful, staying on:', location.pathname);
    setIsMobileMenuOpen(false);
    // Don't navigate - user will be redirected by OAuth callback
  };

  return (
    <>
      <header 
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${
          scrolled || isMobileMenuOpen
            ? 'bg-white/95 dark:bg-[#030014]/95 backdrop-blur-xl shadow-lg' 
            : 'bg-transparent'
        } border-b border-gray-200/50 dark:border-gray-800/50`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo Section */}
            <div 
              className="flex items-center cursor-pointer space-x-3 group"
              onClick={() => handleNavigation('/')}
            >
              <img
                src="/alphalogo.png"
                alt="Alpha Knowledge Logo"
                className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
              />

              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent group-hover:from-[#5855eb] group-hover:to-[#9333ea] transition-all">
                  Alpha Knowledge
                </h1>
                <span className="text-xs lg:text-xs text-gray-400 dark:text-gray-400 font-medium">
                  Code | Compete | Conquer
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex">
              <ul className="flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <button
                        onClick={() => handleNavigation(item.path)}
                        className={`group relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                          isActive 
                            ? 'text-[#6366f1] dark:text-[#a855f7]' 
                            : 'text-gray-600 dark:text-gray-300 hover:text-[#6366f1] dark:hover:text-[#a855f7]'
                        }`}
                      >
                        <span className="relative flex items-center gap-1">
                          <Icon className="w-4 h-4 m-0 p-0" />
                          <span>{item.label}</span>

                          <span
                            className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] transition-all duration-300 ${
                              isActive ? 'w-full' : 'w-0 group-hover:w-full'
                            }`}
                          />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              
              {/* Simple Theme Toggle */}
              <button 
                className="p-2.5 text-[#6366f1] dark:text-[#a855f7] transition-all duration-200 transform hover:scale-110"
                onClick={toggleTheme}
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* User Section - Desktop */}
              <div className="hidden md:flex items-center">
                {loading ? (
                  <div className="flex items-center space-x-2 px-4 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#6366f1]" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Loading...</span>
                  </div>
                ) : user ? (
                  <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                    <img 
                      src={user.profilePicture} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[#6366f1]/20"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Hello, {user.name.split(' ')[0]}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-32">
                        {user.email}
                      </span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="ml-2 p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200 disabled:opacity-50 group"
                      title="Logout"
                    >
                      {isLoggingOut ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      )}
                    </button>
                  </div>
                ) : (
                  <LoginButton 
                    variant="google" 
                    onLoginSuccess={handleLoginSuccess}
                  />
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <div className={`transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}>
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#030014] shadow-2xl border-t border-gray-200 dark:border-gray-800 z-50 md:hidden">
              <div className="max-w-7xl mx-auto px-4 py-6">
                
                {/* Mobile Navigation Links */}
                <nav className="mb-6">
                  <ul className="space-y-2">
                    {navigationItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <li key={item.path}>
                          <button
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-left transition-all duration-300 ${
                              isActive 
                                ? 'bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 text-[#6366f1] dark:text-[#a855f7] border-l-4 border-[#6366f1]' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                            }`}
                            onClick={() => handleNavigation(item.path)}
                            style={{
                              transitionDelay: `${index * 50}ms`,
                            }}
                          >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-[#6366f1] dark:text-[#a855f7]' : ''}`} />
                            <span>{item.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Mobile Auth Section */}
                <div className="border-t border-gray-200 dark:border-white/10 pt-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-[#6366f1] mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">Loading...</span>
                    </div>
                  ) : user ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <img 
                          src={user.profilePicture} 
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#6366f1]/20"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-white truncate">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 disabled:opacity-50"
                      >
                        {isLoggingOut ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Signing out...</span>
                          </>
                        ) : (
                          <>
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <LoginButton 
                        variant="google" 
                        onLoginSuccess={handleLoginSuccess}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
};

export default Header;
