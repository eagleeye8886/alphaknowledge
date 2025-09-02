import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { progressAPI } from '../services/api';
import { useAuth } from './AuthContext';

export const ProgressContext = createContext();

// Default stats structure to prevent undefined errors
const DEFAULT_STATS = {
  totalCompleted: 0,
  sheetStats: {},
  sectionStats: {},
  subsectionStats: {},
  difficultyStats: { Easy: 0, Medium: 0, Hard: 0 },
  sheetDifficultyStats: {},
  recentActivity: []
};

export const ProgressProvider = ({ children }) => {
  const { user, initialized } = useAuth();
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(false);
  const [progressMap, setProgressMap] = useState(new Map()); // For O(1) lookup

  // Optimized progress fetching with caching
  const fetchProgress = useCallback(async () => {
    if (!user) {
      setProgress([]);
      setProgressMap(new Map());
      return;
    }
    
    try {
      setLoading(true);
      
      // Check cache first
      const cacheKey = `progress_${user.id}`;
      const cachedProgress = sessionStorage.getItem(cacheKey);
      
      if (cachedProgress) {
        const progressData = JSON.parse(cachedProgress);
        setProgress(progressData);
        // Create map for fast lookup
        const map = new Map();
        progressData.forEach(p => {
          if (p.isCompleted) map.set(p.problemId, true);
        });
        setProgressMap(map);
      }

      const response = await progressAPI.getUserProgress(user.id);
      const progressData = response.data || [];
      
      setProgress(progressData);
      
      // Cache the data
      sessionStorage.setItem(cacheKey, JSON.stringify(progressData));
      
      // Update progress map for O(1) lookups
      const map = new Map();
      progressData.forEach(p => {
        if (p.isCompleted) map.set(p.problemId, true);
      });
      setProgressMap(map);
      
    } catch (error) {
      console.error('Error fetching progress:', error);
      setProgress([]);
      setProgressMap(new Map());
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Optimized stats fetching with caching
  const fetchStats = useCallback(async () => {
    if (!user) {
      setStats(DEFAULT_STATS);
      return;
    }

    try {
      // Check cache first
      const cacheKey = `stats_${user.id}`;
      const cachedStats = sessionStorage.getItem(cacheKey);
      
      if (cachedStats) {
        setStats(JSON.parse(cachedStats));
      }

      const response = await progressAPI.getStats(user.id);
      const statsData = response.data || DEFAULT_STATS;
      
      setStats(statsData);
      
      // Cache the stats
      sessionStorage.setItem(cacheKey, JSON.stringify(statsData));
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(DEFAULT_STATS);
    }
  }, [user]);

  // Debounced refresh to prevent excessive API calls
  const refreshStats = useCallback(async () => {
    await Promise.all([fetchProgress(), fetchStats()]);
  }, [fetchProgress, fetchStats]);

  // Only fetch when auth is initialized and user changes
  useEffect(() => {
    if (!initialized) return;
    
    if (user) {
      fetchProgress();
      fetchStats();
    } else {
      setProgress([]);
      setProgressMap(new Map());
      setStats(DEFAULT_STATS);
      // Clear cache when user logs out
      sessionStorage.removeItem(`progress_${user?.id}`);
      sessionStorage.removeItem(`stats_${user?.id}`);
    }
  }, [user, initialized, fetchProgress, fetchStats]);

  // Optimized toggle with immediate UI update
  const toggleProblem = useCallback(async (problemData) => {
    if (!user) return false;
    
    try {
      // Optimistic update for immediate UI feedback
      const newMap = new Map(progressMap);
      const wasCompleted = newMap.has(problemData.problemId);
      
      if (wasCompleted) {
        newMap.delete(problemData.problemId);
      } else {
        newMap.set(problemData.problemId, true);
      }
      setProgressMap(newMap);

      const response = await progressAPI.toggleProblem({
        ...problemData,
        userId: user.id
      });

      if (response.data.success) {
        // Update progress array
        const existingIndex = progress.findIndex(p => p.problemId === problemData.problemId);
        const newProgress = [...progress];
        
        if (existingIndex >= 0) {
          newProgress[existingIndex] = response.data.progress;
        } else {
          newProgress.push(response.data.progress);
        }
        setProgress(newProgress);

        // Update cache
        const cacheKey = `progress_${user.id}`;
        sessionStorage.setItem(cacheKey, JSON.stringify(newProgress));
        
        // Refresh stats (debounced)
        setTimeout(() => fetchStats(), 500);
        return true;
      } else {
        // Revert optimistic update on failure
        setProgressMap(progressMap);
        return false;
      }
    } catch (error) {
      console.error('Error toggling problem:', error);
      // Revert optimistic update on error
      setProgressMap(progressMap);
      return false;
    }
  }, [user, progress, progressMap, fetchStats]);

  // O(1) completion check using Map
  const isProblemCompleted = useCallback((problemId) => {
    return progressMap.has(problemId);
  }, [progressMap]);

  // Memoized helper functions
  const getSubsectionProgress = useCallback((subsectionId) => {
    return stats.subsectionStats[subsectionId] || 0;
  }, [stats.subsectionStats]);

  const getSectionProgress = useCallback((sectionId) => {
    return stats.sectionStats[sectionId] || 0;
  }, [stats.sectionStats]);

  const getSheetProgress = useCallback((sheetId) => {
    return stats.sheetStats[sheetId] || 0;
  }, [stats.sheetStats]);

  const getSheetDifficultyProgress = useCallback((sheetId, difficulty) => {
    return stats.sheetDifficultyStats?.[sheetId]?.[difficulty] || 0;
  }, [stats.sheetDifficultyStats]);

  // Memoized context value
  const value = useMemo(() => ({
    progress,
    stats,
    loading,
    toggleProblem,
    isProblemCompleted,
    getSubsectionProgress,
    getSectionProgress,
    getSheetProgress,
    getSheetDifficultyProgress,
    fetchProgress,
    fetchStats,
    refreshStats
  }), [
    progress,
    stats,
    loading,
    toggleProblem,
    isProblemCompleted,
    getSubsectionProgress,
    getSectionProgress,
    getSheetProgress,
    getSheetDifficultyProgress,
    fetchProgress,
    fetchStats,
    refreshStats
  ]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
