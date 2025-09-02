import React, { useState } from 'react';
import { useProgress } from '../../hooks/useProgress';
import ProblemItem from './ProblemItem';
import { 
  FaChevronRight, 
  FaChevronDown,
  FaCheckCircle, 
  FaTrophy, 
  FaClock,
  FaListAlt,
  FaCode
} from 'react-icons/fa';

const SubsectionView = ({ subsection, sheetId, sectionId, index }) => {
  const { stats } = useProgress();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!subsection) {
    console.error('SubsectionView: subsection is undefined');
    return null;
  }

  if (!Array.isArray(subsection.problems)) {
    console.error('SubsectionView: subsection.problems is not an array', subsection);
    return null;
  }

  const getSubsectionProgress = () => {
    const totalProblems = subsection.problems.length;
    const completedProblems = stats?.subsectionStats?.[subsection.id] || 0;
    return { completed: completedProblems, total: totalProblems };
  };

  const progress = getSubsectionProgress();
  const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  // Status configuration
  const getStatusConfig = () => {
    if (percentage === 100) {
      return {
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-500/20',
        borderColor: 'border-green-200 dark:border-green-500/30',
        progressColor: 'text-green-600 dark:text-green-400',
        icon: FaTrophy,
        status: 'COMPLETED'
      };
    } else if (percentage > 0) {
      return {
        color: 'text-[#6366f1] dark:text-[#a855f7]',
        bgColor: 'bg-blue-50 dark:bg-[#6366f1]/20',
        borderColor: 'border-blue-200 dark:border-[#6366f1]/30',
        progressColor: 'text-[#6366f1] dark:text-[#a855f7]',
        icon: FaCode,
        status: 'IN PROGRESS'
      };
    } else {
      return {
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-50 dark:bg-white/5',
        borderColor: 'border-gray-200 dark:border-white/10',
        progressColor: 'text-gray-600 dark:text-gray-400',
        icon: FaClock,
        status: 'NOT STARTED'
      };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="w-full">
      
      {/* Subsection Header */}
      <div 
        className={`
          cursor-pointer py-4 px-6 sm:px-12 lg:px-16 
          flex justify-between items-center transition-all duration-300 
          hover:bg-blue-50/30 dark:hover:bg-[#6366f1]/10 
          group relative
          ${index === 0 ? 'pt-4' : 'pt-4'}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        
        {/* Left Section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Expand/Collapse Button */}
          <div className="flex items-center justify-center w-8 h-8 transition-all duration-300 ease-out group-hover:scale-110">
  {isExpanded ? (
    <FaChevronDown
      className="w-3 h-3 text-[#6366f1] dark:text-[#a855f7] transition-all duration-300 ease-out group-hover:text-[#6366f1] dark:group-hover:text-[#a855f7]"
    />
  ) : (
    <FaChevronRight
      className="w-3 h-3 text-gray-400 dark:text-gray-500 transition-all duration-300 ease-out group-hover:text-[#6366f1] dark:group-hover:text-[#a855f7]"
    />
  )}
</div>
          
          {/* Subsection Info */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white leading-tight">
              {subsection.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <FaListAlt className="w-3 h-3 text-gray-400 dark:text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                {progress.total} problems
              </span>
            </div>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Circular Progress */}
          <div className="relative">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 transform -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-gray-200 dark:text-gray-600"
              />
              {/* Progress circle */}
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
                className={`transition-all duration-1000 ease-out ${statusConfig.progressColor}`}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Progress Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {progress.completed}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 leading-none">
                /{progress.total}
              </span>
            </div>

            {/* Completion Badge */}
            {percentage === 100 && progress.total > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 animate-bounce">
                <FaCheckCircle className="w-2 h-2 text-white" />
              </div>
            )}
          </div>

          {/* Status Info */}
          <div className="text-right hidden sm:block">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {percentage}%
            </div>
            <div className={`
              text-xs font-bold uppercase tracking-wider flex items-center justify-end space-x-1
              ${statusConfig.progressColor}
            `}>
              <StatusIcon className="w-3 h-3" />
              <span>{statusConfig.status}</span>
            </div>
          </div>

          {/* Mobile Status */}
          <div className="sm:hidden">
            <div className="text-sm font-bold text-gray-900 dark:text-white">
              {percentage}%
            </div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/0 via-[#6366f1]/2 to-[#6366f1]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Problems Table */}
{isExpanded && (
  <div className="px-6 sm:px-12 lg:px-20 pb-4 animate-in slide-in-from-top duration-300 ease-out">
    <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-xl">
      
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          
          {/* Table Header with Brand Gradient */}
          <thead>
            <tr className="bg-gradient-to-r from-[#6366f1]/10 via-[#a855f7]/5 to-[#6366f1]/10 dark:from-[#6366f1]/20 dark:via-[#a855f7]/10 dark:to-[#6366f1]/20 border-b-2 border-[#6366f1]/20 dark:border-white/20 backdrop-blur-sm">
              <th className="p-3 sm:p-4 text-left font-semibold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider w-[10%]">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full"></div>
                  <span>Status</span>
                </div>
              </th>
              <th className="p-3 sm:p-4 text-left font-semibold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider w-[30%] sm:w-[25%]">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#a855f7] to-[#6366f1] rounded-full"></div>
                  <span>Problem</span>
                </div>
              </th>
              <th className="p-3 sm:p-4 text-center font-semibold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider w-[15%]">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full"></div>
                  <span>Editorial</span>
                </div>
              </th>
              <th className="p-3 sm:p-4 text-center font-semibold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider w-[15%]">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#a855f7] to-[#6366f1] rounded-full"></div>
                  <span>Notes</span>
                </div>
              </th>
              <th className="p-3 sm:p-4 text-center font-semibold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider w-[15%]">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full"></div>
                  <span>Practice</span>
                </div>
              </th>
              <th className="p-3 sm:p-4 text-center font-semibold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider w-[15%] sm:w-[20%]">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#a855f7] to-[#6366f1] rounded-full"></div>
                  <span>Difficulty</span>
                </div>
              </th>
            </tr>
          </thead>
          
          {/* Table Body with Enhanced Styling */}
          <tbody className="divide-y divide-gray-200/30 dark:divide-white/10">
            {subsection.problems.map((problem, problemIndex) => (
              <ProblemItem
                key={problem.id}
                problem={problem}
                sheetId={sheetId}
                sectionId={sectionId}
                subsectionId={subsection.id}
                index={problemIndex}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Empty State */}
      {subsection.problems.length === 0 && (
        <div className="text-center py-12 px-6">
          <div className="relative">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 to-[#a855f7]/5 rounded-full blur-3xl opacity-50"></div>
            
            {/* Content */}
            <div className="relative space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6366f1]/20 to-[#a855f7]/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20">
                <FaCode className="w-8 h-8 text-[#6366f1] dark:text-[#a855f7]" />
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  No Problems Available
                </h4>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  This subsection doesn't have any problems yet. Check back later for new coding challenges!
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="flex justify-center space-x-2 mt-6">
                <div className="w-2 h-2 bg-[#6366f1]/60 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-[#a855f7]/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-2 h-2 bg-[#6366f1]/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default SubsectionView;
