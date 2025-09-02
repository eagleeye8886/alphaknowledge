import React from 'react';
import SectionView from './SectionView';
import { useProgress } from '../../hooks/useProgress';
import { 
  FaTrophy, 
  FaFire, 
  FaClock, 
  FaChartBar, 
  FaCode,
  FaBookOpen,
  FaGraduationCap,
  FaStar
} from 'react-icons/fa';

const SheetView = ({ sheet }) => {
  const { stats, getSheetDifficultyProgress } = useProgress();

  const getSheetProgress = () => {
    const totalProblems = sheet.sections.reduce((total, section) => {
      return total + section.subsections.reduce((sectionTotal, subsection) => {
        return sectionTotal + subsection.problems.length;
      }, 0);
    }, 0);

    const completedProblems = stats.sheetStats?.[sheet.id] || 0;
    return { completed: completedProblems, total: totalProblems };
  };

  // Calculate difficulty breakdown for the sheet
  const getDifficultyBreakdown = () => {
    const breakdown = { 
      Easy: { completed: 0, total: 0 }, 
      Medium: { completed: 0, total: 0 }, 
      Hard: { completed: 0, total: 0 } 
    };
    
    sheet.sections.forEach(section => {
      section.subsections.forEach(subsection => {
        subsection.problems.forEach(problem => {
          if (problem.difficulty && breakdown[problem.difficulty]) {
            breakdown[problem.difficulty].total++;
          }
        });
      });
    });
    
    // Get completed counts from stats
    breakdown.Easy.completed = getSheetDifficultyProgress(sheet.id, 'Easy');
    breakdown.Medium.completed = getSheetDifficultyProgress(sheet.id, 'Medium');
    breakdown.Hard.completed = getSheetDifficultyProgress(sheet.id, 'Hard');
    
    return breakdown;
  };

  const progress = getSheetProgress();
  const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
  const difficultyBreakdown = getDifficultyBreakdown();

  // Get status configuration
  const getStatusConfig = () => {
    if (percentage === 100) {
      return {
        color: 'text-green-600 dark:text-green-400',
        bgGradient: 'from-green-500 to-green-600',
        icon: FaTrophy,
        message: 'Congratulations! Sheet completed! 🎉'
      };
    } else if (percentage >= 75) {
      return {
        color: 'text-orange-600 dark:text-orange-400',
        bgGradient: 'from-orange-500 to-orange-600',
        icon: FaFire,
        message: 'Almost there! Keep going! 🔥'
      };
    } else if (percentage > 0) {
      return {
        color: 'text-[#6366f1] dark:text-[#a855f7]',
        bgGradient: 'from-[#6366f1] to-[#a855f7]',
        icon: FaStar,
        message: 'Great progress! Keep it up! ⭐'
      };
    } else {
      return {
        color: 'text-gray-600 dark:text-gray-400',
        bgGradient: 'from-gray-500 to-gray-600',
        icon: FaClock,
        message: 'Ready to start your journey? 🚀'
      };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-[#030014] dark:via-slate-900 dark:to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background Effects - Only visible in dark mode */}
      <div className="absolute inset-0 overflow-hidden dark:block hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#6366f1]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#a855f7]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Sheet Header */}
        <div className="mb-8 p-6 sm:p-8 bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-white/10 relative overflow-hidden">
          
          {/* Header Content */}
          <div className="relative z-10">
            
            {/* Title Section */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#6366f1] to-[#a855f7] rounded-2xl shadow-lg flex items-center justify-center">
                  <FaBookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                    {sheet.name}
                  </h1>
                  {sheet.description && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                      {sheet.description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Status Message */}
              <div className="inline-flex items-center space-x-2 bg-gray-50/80 dark:bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50 dark:border-white/10">
                <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {statusConfig.message}
                </span>
              </div>
            </div>
            
            {/* Progress Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              
              {/* Total Progress Section */}
              <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
                <div className="flex items-center space-x-6">
                  
                  {/* Circular Progress */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
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
                        className={`transition-all duration-1000 ease-out ${statusConfig.color}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    
                    {/* Percentage Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-lg sm:text-xl font-bold ${statusConfig.color}`}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaChartBar className="w-4 h-4 text-[#6366f1]" />
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Total Progress
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {progress.completed} / {progress.total}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Problems completed
                    </div>
                  </div>
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
                <div className="flex items-center space-x-2 mb-4">
                  <FaGraduationCap className="w-4 h-4 text-[#a855f7]" />
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Difficulty Breakdown
                  </span>
                </div>
                
                <div className="space-y-4">
                  {/* Easy */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">Easy</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {difficultyBreakdown.Easy.completed} / {difficultyBreakdown.Easy.total}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {difficultyBreakdown.Easy.total > 0 ? Math.round((difficultyBreakdown.Easy.completed / difficultyBreakdown.Easy.total) * 100) : 0}%
                      </div>
                    </div>
                  </div>

                  {/* Medium */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Medium</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {difficultyBreakdown.Medium.completed} / {difficultyBreakdown.Medium.total}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {difficultyBreakdown.Medium.total > 0 ? Math.round((difficultyBreakdown.Medium.completed / difficultyBreakdown.Medium.total) * 100) : 0}%
                      </div>
                    </div>
                  </div>

                  {/* Hard */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-red-700 dark:text-red-400">Hard</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {difficultyBreakdown.Hard.completed} / {difficultyBreakdown.Hard.total}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {difficultyBreakdown.Hard.total > 0 ? Math.round((difficultyBreakdown.Hard.completed / difficultyBreakdown.Hard.total) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Completion Badge */}
          {percentage === 100 && (
            <div className="absolute top-4 right-4 animate-bounce">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg flex items-center space-x-1">
                <FaTrophy className="w-3 h-3" />
                <span>Completed</span>
              </div>
            </div>
          )}
        </div>

        {/* Sections Container */}
        <div className="space-y-2">
          {sheet.sections.map(section => (
            <SectionView
              key={section.id}
              section={section}
              sheetId={sheet.id}
            />
          ))}
        </div>

        {/* Empty State */}
        {sheet.sections.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCode className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sections available</h3>
            <p className="text-gray-500 dark:text-gray-400">This sheet is currently being prepared. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SheetView;
