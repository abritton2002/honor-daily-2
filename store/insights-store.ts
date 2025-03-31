import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_INSIGHTS } from '@/mocks/insights';
import { MOCK_PSYCHOLOGICAL_PROFILE } from '@/mocks/psychological-profile';
import { MOCK_GROWTH_PLAN } from '@/mocks/growth-plan';
import { MOCK_RECOMMENDATIONS } from '@/mocks/recommendations';
import { getTodayDateString } from '@/utils/date-utils';

interface InsightsState {
  insights: any[];
  psychologicalProfile: any;
  growthPlan: any;
  recommendations: any[];
  activityLog: any[];
  lastAnalysisDate: string | null;
  
  // Actions
  initialize: () => void;
  logActivity: (category: string, action: string, details?: any) => void;
  runDailyAnalysis: () => void;
  analyzeJournalEntry: (entryId: string, content: string) => any;
  updatePsychologicalProfile: (updates: any) => void;
  updateGrowthPlan: (updates: any) => void;
  
  // Getters
  getInsights: (category?: string, limit?: number) => any[];
  getRecommendations: (category?: string, limit?: number) => any[];
  getActivityStats: (category?: string, days?: number) => any;
}

export const useInsightsStore = create<InsightsState>()(
  persist(
    (set, get) => ({
      insights: [],
      psychologicalProfile: null,
      growthPlan: null,
      recommendations: [],
      activityLog: [],
      lastAnalysisDate: null,
      
      initialize: () => {
        const { insights, psychologicalProfile, growthPlan, recommendations, lastAnalysisDate } = get();
        
        // Only initialize if data doesn't exist
        if (insights.length === 0) {
          set({ insights: MOCK_INSIGHTS });
        }
        
        if (!psychologicalProfile) {
          set({ psychologicalProfile: MOCK_PSYCHOLOGICAL_PROFILE });
        }
        
        if (!growthPlan) {
          set({ growthPlan: MOCK_GROWTH_PLAN });
        }
        
        if (recommendations.length === 0) {
          set({ recommendations: MOCK_RECOMMENDATIONS });
        }
        
        // Check if we need to run daily analysis
        const today = getTodayDateString();
        if (!lastAnalysisDate || lastAnalysisDate !== today) {
          try {
            get().runDailyAnalysis();
          } catch (error) {
            console.error('Error running daily analysis:', error);
          }
        }
      },
      
      logActivity: (category, action, details = {}) => {
        const activityEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          category,
          action,
          details
        };
        
        set((state) => ({
          activityLog: [activityEntry, ...state.activityLog]
        }));
      },
      
      runDailyAnalysis: () => {
        try {
          // In a real app, this would analyze user data and generate insights
          // For now, we'll just update the lastAnalysisDate
          const today = getTodayDateString();
          
          set({
            lastAnalysisDate: today
          });
          
          // Log the analysis
          get().logActivity('system', 'daily_analysis');
        } catch (error) {
          console.error('Error in runDailyAnalysis:', error);
        }
      },
      
      analyzeJournalEntry: (entryId, content) => {
        try {
          // In a real app, this would use NLP to analyze the journal entry
          // For now, return mock analysis
          const mockAnalysis = {
            entryId,
            emotionalTone: 'positive',
            sentimentScore: 0.65,
            themes: ['gratitude', 'personal growth', 'relationships'],
            growthAreas: ['self_reflection', 'mindfulness', 'emotional_awareness'],
            wordCount: content.split(/\s+/).length,
            timestamp: new Date().toISOString()
          };
          
          // Add this analysis to insights
          const newInsight = {
            id: Date.now().toString(),
            type: 'journal_analysis',
            title: 'Journal Analysis',
            description: 'Analysis of your recent journal entry',
            date: new Date().toISOString(),
            data: mockAnalysis,
            category: 'emotional'
          };
          
          set((state) => ({
            insights: [newInsight, ...state.insights]
          }));
          
          return mockAnalysis;
        } catch (error) {
          console.error('Error analyzing journal entry:', error);
          return {
            emotionalTone: 'neutral',
            sentimentScore: 0,
            themes: [],
            growthAreas: []
          };
        }
      },
      
      updatePsychologicalProfile: (updates) => {
        set((state) => ({
          psychologicalProfile: {
            ...state.psychologicalProfile,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }));
      },
      
      updateGrowthPlan: (updates) => {
        set((state) => ({
          growthPlan: {
            ...state.growthPlan,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }));
      },
      
      getInsights: (category, limit = 10) => {
        const { insights } = get();
        
        let filteredInsights = insights;
        
        if (category) {
          filteredInsights = insights.filter((insight) => insight.category === category);
        }
        
        return filteredInsights
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      },
      
      getRecommendations: (category, limit = 5) => {
        const { recommendations } = get();
        
        let filteredRecommendations = recommendations;
        
        if (category) {
          filteredRecommendations = recommendations.filter((rec) => rec.category === category);
        }
        
        return filteredRecommendations.slice(0, limit);
      },
      
      getActivityStats: (category, days = 7) => {
        const { activityLog } = get();
        
        // Filter by category if provided
        let filteredLog = activityLog;
        if (category) {
          filteredLog = activityLog.filter((entry) => entry.category === category);
        }
        
        // Get date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        // Filter by date range
        filteredLog = filteredLog.filter((entry) => {
          const entryDate = new Date(entry.timestamp);
          return entryDate >= startDate && entryDate <= endDate;
        });
        
        // Count activities by day
        const activityByDay: Record<string, number> = {};
        
        // Initialize all days with 0
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateString = date.toISOString().split('T')[0];
          activityByDay[dateString] = 0;
        }
        
        // Count activities
        filteredLog.forEach((entry) => {
          const dateString = entry.timestamp.split('T')[0];
          if (activityByDay[dateString] !== undefined) {
            activityByDay[dateString]++;
          }
        });
        
        return {
          total: filteredLog.length,
          byDay: activityByDay,
          mostActive: Object.entries(activityByDay)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 1)
            .map(([date]) => date)[0]
        };
      }
    }),
    {
      name: 'insights-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);