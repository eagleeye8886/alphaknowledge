import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../Common/ProgressBar';
import { useProgress } from '../../hooks/useProgress';
import { 
  FaArrowRight, 
  FaTrophy, 
  FaFolderOpen, 
  FaListAlt,
  FaFire,
  FaStar,
  FaCode,
  FaBrain
} from 'react-icons/fa';

const SheetList = ({ content }) => {
  const navigate = useNavigate();
  const { stats } = useProgress();

  const getSheetProgress = (sheetId, sheet) => {
    const totalProblems = sheet.sections.reduce((total, section) => {
      return total + section.subsections.reduce((sectionTotal, subsection) => {
        return sectionTotal + subsection.problems.length;
      }, 0);
    }, 0);

    const completedProblems = stats.sheetStats?.[sheetId] || 0;
    return { completed: completedProblems, total: totalProblems };
  };

  const handleSheetSelect = (sheetId) => {
    navigate(`/sheet/${sheetId}`);
  };

  // Get difficulty distribution for visual appeal
  const getDifficultyStats = (sheet) => {
    let easy = 0, medium = 0, hard = 0;
    sheet.sections.forEach(section => {
      section.subsections.forEach(subsection => {
        subsection.problems.forEach(problem => {
          switch(problem.difficulty?.toLowerCase()) {
            case 'easy': easy++; break;
            case 'medium': medium++; break;
            case 'hard': hard++; break;
          }
        });
      });
    });
    return { easy, medium, hard };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-[#030014] dark:via-slate-900 dark:to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background Effects - Only visible in dark mode */}
      <div className="absolute inset-0 overflow-hidden dark:block hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#6366f1]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#a855f7]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#6366f1] to-[#a855f7] rounded-2xl shadow-lg mb-6">
            <FaBrain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Choose Your DSA Journey
          </h2>
          <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            Master data structures and algorithms with carefully curated problem sets
          </p>
        </div>
        
        {/* Sheets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {content.sheets.map(sheet => {
            const progress = getSheetProgress(sheet.id, sheet);
            const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
            const difficultyStats = getDifficultyStats(sheet);
            
            return (
              <div
                key={sheet.id}
                className="group relative bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-white/10 cursor-pointer transition-all duration-500 ease-out hover:shadow-2xl dark:hover:shadow-[#6366f1]/10 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
                onClick={() => handleSheetSelect(sheet.id)}
              >
                
                {/* Card Content */}
                <div className="relative p-6 sm:p-8 h-full flex flex-col">
                  
                  {/* Sheet Header */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#6366f1] to-[#a855f7] rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <FaCode className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                            {sheet.name}
                          </h3>
                        </div>
                      </div>
                      
                      <FaArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-[#6366f1] group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                      {sheet.description || `Master data structures and algorithms with ${progress.total} carefully curated problems`}
                    </p>
                  </div>

                  {/* Statistics Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 dark:border-white/10">
                      <div className="flex items-center space-x-2">
                        <FaListAlt className="w-4 h-4 text-[#6366f1]" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {progress.total}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Problems</p>
                    </div>
                    
                    <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 dark:border-white/10">
                      <div className="flex items-center space-x-2">
                        <FaFolderOpen className="w-4 h-4 text-[#a855f7]" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {sheet.sections.length}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Sections</p>
                    </div>
                  </div>

                  {/* Difficulty Distribution */}
                  {(difficultyStats.easy > 0 || difficultyStats.medium > 0 || difficultyStats.hard > 0) && (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Difficulty Distribution</p>
                      <div className="flex space-x-2">
                        {difficultyStats.easy > 0 && (
                          <div className="flex items-center space-x-1 bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg text-xs font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>{difficultyStats.easy}</span>
                          </div>
                        )}
                        {difficultyStats.medium > 0 && (
                          <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-lg text-xs font-medium">
                            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                            <span>{difficultyStats.medium}</span>
                          </div>
                        )}
                        {difficultyStats.hard > 0 && (
                          <div className="flex items-center space-x-1 bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 px-2 py-1 rounded-lg text-xs font-medium">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span>{difficultyStats.hard}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Progress Section */}
                  <div className="mt-auto">
                    <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-white/5 dark:to-white/10 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Progress</span>
                        <div className="flex items-center space-x-2">
                          {percentage >= 75 ? (
                            <FaFire className="w-4 h-4 text-orange-500" />
                          ) : percentage > 0 ? (
                            <FaStar className="w-4 h-4 text-[#6366f1]" />
                          ) : null}
                          <span className={`text-sm font-bold ${
                            percentage === 100 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-[#6366f1] dark:text-[#a855f7]'
                          }`}>
                            {progress.completed} / {progress.total}
                          </span>
                        </div>
                      </div>
                      
                      <ProgressBar
                        completed={progress.completed}
                        total={progress.total}
                        label=""
                        variant="minimal"
                        color={percentage === 100 ? "green" : "blue"}
                        size="sm"
                        showLabels={false}
                        animated={true}
                      />
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {percentage}% Complete
                        </span>
                        {percentage === 100 && (
                          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                            <FaTrophy className="w-3 h-3" />
                            <span className="text-xs font-bold">COMPLETED</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Completion Badge */}
                  {percentage === 100 && (
                    <div className="absolute -top-2 -right-2 animate-bounce">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg transform rotate-12 flex items-center space-x-1">
                        <FaTrophy className="w-3 h-3" />
                        <span>Done</span>
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/0 via-[#6366f1]/5 to-[#a855f7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Message */}
        {content.sheets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaListAlt className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sheets available</h3>
            <p className="text-gray-500 dark:text-gray-400">Check back later for new problem sets!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SheetList;
