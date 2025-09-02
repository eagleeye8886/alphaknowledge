import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  FaExternalLinkAlt, 
  FaYoutube, 
  FaCheckCircle, 
  FaTimes, 
  FaLock, 
  FaFileAlt,
  FaSpinner,
  FaGoogle,
  FaTrophy,
  FaCheck
} from 'react-icons/fa';
import { 
  ChevronRight,
  PlayCircle,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../hooks/useProgress';
import LoginButton from '../Auth/LoginButton';
import YouTubeModal from '../Common/YouTubeModal';

const ProblemItem = ({ problem, sheetId, sectionId, subsectionId, index }) => {
  const { user } = useAuth();
  const { toggleProblem, isProblemCompleted, refreshStats } = useProgress();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [backendCompleted, setBackendCompleted] = useState(false);
  
  // Use backend state as the source of truth
  const isCompleted = isProblemCompleted(problem.id);
  
  // Sync backend state with local state
  useEffect(() => {
    setBackendCompleted(isProblemCompleted(problem.id));
  }, [isProblemCompleted, problem.id]);

  // Helper function to check if a field is empty or missing
  const isEmpty = (value) => {
    return !value || value === '' || value === null || value === undefined;
  };

  // Modern difficulty styling functions
  const getDifficultyStyle = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': 
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20';
      case 'medium': 
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20';
      case 'hard': 
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20';
      default: 
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-500/10 border border-gray-200 dark:border-gray-500/20';
    }
  };

  const getDifficultyDotColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': 
        return 'bg-green-500';
      case 'medium': 
        return 'bg-amber-500';
      case 'hard': 
        return 'bg-red-500';
      default: 
        return 'bg-gray-500';
    }
  };

  // Wait for backend confirmation before updating UI
  const handleCheckboxChange = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsToggling(true);

    try {
      const success = await toggleProblem({
        problemId: problem.id,
        sheetId,
        sectionId,
        subsectionId,
        difficulty: problem.difficulty
      });

      if (success) {
        setBackendCompleted(!isCompleted);
      } else {
        console.error('Failed to toggle problem completion - API returned false');
      }
    } catch (error) {
      console.error('Failed to toggle problem completion:', error);
    } finally {
      setIsToggling(false);
    }
  };

  // Simply close modal after login - NO PROBLEM MARKING
  const handleLoginSuccess = (userData) => {
    setShowAuthModal(false); // Just close the modal
  };

  // Authentication Modal Component
  const AuthModal = () => {
    if (!showAuthModal) return null;

    const closeModal = () => {
      setShowAuthModal(false);
    };

    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        {/* Enhanced Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={closeModal}
        />
        
        {/* Modal Container */}
        <div className="relative w-full max-w-lg bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 animate-in zoom-in-95 fade-in slide-in-from-bottom-8 duration-300">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 via-[#a855f7]/3 to-[#6366f1]/5 dark:from-[#6366f1]/10 dark:via-[#a855f7]/5 dark:to-[#6366f1]/10 rounded-3xl" />
          
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 w-10 h-10 bg-white/80 dark:bg-white/10 hover:bg-red-50 dark:hover:bg-red-500/20 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl backdrop-blur-sm transition-all duration-200 flex items-center justify-center z-10 border border-white/30 dark:border-white/20"
          >
            <FaTimes className="w-4 h-4" />
          </button>

          {/* Modal Content */}
          <div className="relative p-8 sm:p-12 text-center">
            
            {/* Icon */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] to-[#a855f7] rounded-2xl shadow-xl animate-pulse opacity-20"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-[#6366f1] to-[#a855f7] rounded-2xl shadow-lg flex items-center justify-center">
                <FaLock className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Sign In Required
            </h2>
            
            {/* Subtitle */}
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Sign in to mark problems as completed and track your progress
            </p>

            {/* Problem Info */}
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/30 dark:border-white/10 shadow-lg">
              <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
                <div className="bg-white dark:bg-white/10 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-white/20 backdrop-blur-sm">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {isEmpty(problem.title) ? 'Untitled Problem' : problem.title}
                  </span>
                </div>
                
                {!isEmpty(problem.difficulty) && (
                  <span className={`
                    inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                    ${getDifficultyStyle(problem.difficulty)}
                  `}>
                    <span className={`w-2 h-2 rounded-full ${getDifficultyDotColor(problem.difficulty)}`}></span>
                    {problem.difficulty}
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                After signing in, you can click the checkbox to mark this problem as completed!
              </p>
            </div>

            {/* Centered Login Button */}
            <div className="flex justify-center items-center mb-6 w-full">
              <div className="flex justify-center w-full">
                <LoginButton 
                  onLoginSuccess={handleLoginSuccess}
                  variant="google"
                />
              </div>
            </div>

            {/* Skip Button */}
            <button 
              onClick={closeModal}
              className="text-gray-500 dark:text-gray-400 hover:text-[#6366f1] dark:hover:text-[#a855f7] font-medium transition-colors duration-200"
            >
              Maybe Later
            </button>

            {/* Sign In Encouragement */}
            <div className="mt-6 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 dark:from-[#6366f1]/20 dark:to-[#a855f7]/20 rounded-2xl p-4 border border-[#6366f1]/20 dark:border-[#a855f7]/30 backdrop-blur-sm">
              <p className="text-[#6366f1] dark:text-[#a855f7] font-semibold flex items-center justify-center gap-2 text-sm">
                <span>✨</span>
                Sign in with Google in seconds and start tracking your progress!
                <span>🚀</span>
              </p>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <tr className={`
        border border-gray-200/30 dark:border-white/10
        transition-all duration-200 hover:border-gray-300 dark:hover:border-white/20
        ${isCompleted 
          ? 'bg-gradient-to-r from-green-50/50 via-white to-green-50/30 dark:from-green-500/10 dark:via-transparent dark:to-green-500/5' 
          : index % 2 === 0 
            ? 'bg-white dark:bg-transparent' 
            : 'bg-gray-50/50 dark:bg-transparent'
        }
        hover:shadow-sm hover:bg-gray-50/80 dark:hover:bg-white/5
      `}>
        
        {/* Modern Status Checkbox */}
        <td className="p-3 sm:p-4 text-center border-r border-gray-200/20 dark:border-white/10">
          <div className="flex items-center justify-center relative">
            <button
              onClick={handleCheckboxChange}
              disabled={isToggling}
              className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                transition-all duration-300 transform hover:scale-110 active:scale-95
                disabled:opacity-70 disabled:cursor-not-allowed
                ${isCompleted 
                  ? 'bg-green-500 border-green-500 shadow-md shadow-green-500/30' 
                  : 'bg-white dark:bg-transparent border-gray-300 dark:border-white/30 hover:border-green-400 dark:hover:border-green-400 hover:shadow-sm'
                }
              `}
            >
              {isToggling ? (
                <FaSpinner className="w-3 h-3 animate-spin text-green-500" />
              ) : isCompleted ? (
                <FaCheck className="w-2.5 h-2.5 text-white" />
              ) : null}
            </button>
          </div>
        </td>

        {/* **UPDATED**: Problem Name with fallback */}
        <td className={`
          p-3 sm:p-4 font-semibold border-r border-gray-200/20 dark:border-white/10
          transition-colors duration-200
          ${isCompleted 
            ? 'text-green-700 dark:text-green-400' 
            : 'text-gray-900 dark:text-white'
          }
        `}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm sm:text-base">
              {isEmpty(problem.title) ? (
                <span className="text-gray-400 dark:text-gray-500 italic">—</span>
              ) : (
                problem.title
              )}
            </span>
            {isCompleted && !isToggling && (
              <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                Solved
              </span>
            )}
          </div>
        </td>

        {/* **UPDATED**: Editorial Button with proper empty state */}
        <td className="p-3 sm:p-4 text-center border-r border-gray-200/20 dark:border-white/10">
          {!isEmpty(problem.youtubeLink) ? (
            <button
              onClick={() => setShowVideo(true)}
              title="Watch editorial video"
              className="group text-red-600 hover:text-red-700 transition-all duration-200 transform hover:scale-110 active:scale-95 mx-auto flex items-center justify-center"
            >
              <FaYoutube className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            </button>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">—</span>
          )}
        </td>

        {/* **UPDATED**: Notes Button with proper empty state */}
        <td className="p-3 sm:p-4 text-center border-r border-gray-200/20 dark:border-white/10">
          {!isEmpty(problem.notesLink) ? (
            <a
              href={problem.notesLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-[#6366f1] hover:text-[#5855eb] transition-all duration-200 transform hover:scale-110 active:scale-95 mx-auto flex items-center justify-center"
              title="View notes"
            >
              <FileText className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            </a>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">—</span>
          )}
        </td>

        {/* **UPDATED**: Practice Button with proper empty state */}
        <td className="p-3 sm:p-4 text-center border-r border-gray-200/20 dark:border-white/10">
          {!isEmpty(problem.practiceLink) ? (
            <a
              href={problem.practiceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-emerald-600 hover:text-emerald-700 transition-all duration-200 transform hover:scale-110 active:scale-95 mx-auto flex items-center justify-center gap-1"
              title="Solve on platform"
            >
              <FaExternalLinkAlt className="w-4 h-4 group-hover:scale-110 transition-all duration-200" />
              <span className="hidden sm:inline text-sm font-semibold text-gray-700 dark:text-gray-300">Solve</span>
            </a>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">—</span>
          )}
        </td>

        {/* **UPDATED**: Modern Difficulty Badge with proper empty state */}
        <td className="p-3 sm:p-4 text-center">
          {!isEmpty(problem.difficulty) ? (
            <span className={`
              inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
              transition-all duration-200 hover:scale-105
              ${getDifficultyStyle(problem.difficulty)}
            `}>
              <span className={`w-2 h-2 rounded-full ${getDifficultyDotColor(problem.difficulty)}`}></span>
              <span className="hidden sm:inline">{problem.difficulty}</span>
            </span>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">—</span>
          )}
        </td>
      </tr>

      {/* Authentication Modal */}
      <AuthModal />

      {/* **UPDATED**: YouTube Modal with proper validation */}
      {!isEmpty(problem.youtubeLink) && (
        <YouTubeModal
          videoUrl={problem.youtubeLink}
          isOpen={showVideo}
          onClose={() => setShowVideo(false)}
          problemName={problem.title || 'Untitled Problem'}
        />
      )}
    </>
  );
};

export default ProblemItem;
