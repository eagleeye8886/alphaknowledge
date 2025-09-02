import React, { useState, useEffect } from 'react';
import SubsectionView from './SubsectionView';
import { useProgress } from '../../hooks/useProgress';
import { FaChevronDown,FaChevronRight, FaTrophy, FaFire, FaClock } from 'react-icons/fa';

const SectionView = ({ section, sheetId }) => {
  const { stats, refreshStats } = useProgress();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (refreshStats) {
      refreshStats();
    }
  }, [refreshStats]);

  const getSectionProgress = () => {
    const totalProblems = section.subsections.reduce((total, subsection) => {
      return total + subsection.problems.length;
    }, 0);

    const completedProblems = stats.sectionStats?.[section.id] || 0;
    return { completed: completedProblems, total: totalProblems };
  };

  const progress = getSectionProgress();
  const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  // Status configuration based on progress
  const getStatusConfig = () => {
    if (percentage === 100) {
      return {
        color: 'green',
        gradient: 'from-green-500 to-green-600',
        bg: 'from-green-50/50 via-white to-green-50/30 dark:from-green-500/10 dark:via-white/5 dark:to-green-500/5',
        border: 'border-green-200/50 dark:border-green-500/30',
        icon: FaTrophy,
        status: 'COMPLETED',
        accent: 'text-green-700 dark:text-green-400'
      };
    } else if (percentage >= 50) {
      return {
        color: 'blue',
        gradient: 'from-[#6366f1] to-[#a855f7]',
        bg: 'from-blue-50/50 via-white to-blue-50/30 dark:from-[#6366f1]/10 dark:via-white/5 dark:to-[#a855f7]/10',
        border: 'border-blue-200/50 dark:border-[#6366f1]/30',
        icon: FaFire,
        status: 'IN PROGRESS',
        accent: 'text-[#6366f1] dark:text-[#a855f7]'
      };
    } else {
      return {
        color: 'gray',
        gradient: 'from-gray-500 to-gray-600',
        bg: 'from-gray-50/50 via-white to-gray-50/30 dark:from-white/5 dark:via-white/10 dark:to-white/5',
        border: 'border-gray-200/50 dark:border-white/10',
        icon: FaClock,
        status: 'NOT STARTED',
        accent: 'text-gray-700 dark:text-gray-400'
      };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="mb-2">
      {/* Section Header */}
      <div 
        className={`
          cursor-pointer p-4 sm:p-6 border backdrop-blur-md
          flex justify-between items-center shadow-lg
          transition-all duration-300 ease-out hover:shadow-xl
          relative overflow-hidden group
          ${isExpanded 
            ? 'rounded-t-2xl border-b-0' 
            : 'rounded-2xl hover:scale-[1.01]'
          }
          bg-gradient-to-r ${statusConfig.bg}
          ${statusConfig.border}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        
        {/* Left Section */}
        <div className="flex items-center gap-4 z-10 relative">
          {/* Modern Expand/Collapse Icon - Simplified */}
          <div className="flex items-center justify-center w-8 h-8 transition-all duration-300 ease-out group-hover:scale-110">
            {isExpanded ? (
      <FaChevronDown
        className="w-5 h-5 text-[#6366f1] dark:text-[#a855f7] transition-all duration-300 ease-out group-hover:text-[#6366f1] dark:group-hover:text-[#a855f7]"
      />
    ) : (
      <FaChevronRight
        className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-all duration-300 ease-out group-hover:text-[#6366f1] dark:group-hover:text-[#a855f7]"
      />
    )}
          </div>
          
          {/* Section Info */}
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
              {section.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2 flex-wrap">
              <span>{section.subsections.length} subsections</span>
              <span className="hidden sm:inline">•</span>
              <span>{progress.total} problems</span>
            </p>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center gap-4 sm:gap-6 z-10 relative">
          
          {/* Circular Progress */}
          <div className="relative">
            <svg className="w-14 h-14 sm:w-16 sm:h-16 transform -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-200 dark:text-gray-600"
              />
              {/* Progress circle */}
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${percentage}, 100`}
                className={`transition-all duration-1000 ease-out ${statusConfig.accent}`}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Percentage Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs sm:text-sm font-bold ${statusConfig.accent}`}>
                {percentage}%
              </span>
            </div>
          </div>
          
          {/* Stats */}
          <div className="text-right">
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
              {progress.completed} / {progress.total}
            </div>
            <div className={`
              text-xs font-bold uppercase tracking-wider flex items-center gap-1 justify-end
              ${statusConfig.accent}
            `}>
              <StatusIcon className="w-3 h-3" />
              <span className="hidden sm:inline">{statusConfig.status}</span>
            </div>
          </div>
        </div>

        {/* Completion Badge */}
        {percentage === 100 && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 animate-bounce">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-lg flex items-center gap-1">
              <FaTrophy className="w-3 h-3" />
              <span className="hidden sm:inline">Done</span>
            </div>
          </div>
        )}

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className={`
          border border-t-0 rounded-b-2xl shadow-lg backdrop-blur-md
          bg-white/98 dark:bg-white/5 overflow-hidden
          animate-in slide-in-from-top duration-300 ease-out
          ${statusConfig.border}
        `}>
          <div className="divide-y divide-gray-100 dark:divide-white/10">
            {section.subsections.map((subsection, index) => (
              <div 
                key={subsection.id}
                className="transition-colors duration-200 "
              >
                <SubsectionView
                  subsection={subsection}
                  sheetId={sheetId}
                  sectionId={section.id}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionView;
