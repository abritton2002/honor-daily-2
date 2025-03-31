import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LearningItem } from '@/types/learning';
import { LEARNING_ITEMS } from '@/mocks/learning-items';
import { getTodayDateString } from '@/utils/date-utils';

interface LearnState {
  categories: string[];
  learningItems: LearningItem[];
  selectedItemId: string | null;
  completedItems: Record<string, boolean>;
  completionDates: Record<string, string>; // itemId -> date completed
  lastSelectedDate: string | null;
  isInitialized: boolean;
  
  // Actions
  initialize: () => void;
  selectLearningItem: (itemId: string) => void;
  completeLearningItem: (itemId: string) => void;
  isItemCompleted: (itemId: string) => boolean;
  resetDailySelection: () => void;
  
  // Stats
  getLearningStats: () => {
    totalCompleted: number;
    currentStreak: number;
    weeklyProgress: boolean[];
    categoryStats: Array<{
      category: string;
      completed: number;
      total: number;
    }>;
  };
}

export const useLearnStore = create<LearnState>()(
  persist(
    (set, get) => ({
      categories: ['Leadership', 'Productivity', 'Finance', 'Mental Models', 'Performance'],
      learningItems: LEARNING_ITEMS,
      selectedItemId: null,
      completedItems: {},
      completionDates: {},
      lastSelectedDate: null,
      isInitialized: false,
      
      initialize: () => {
        const today = getTodayDateString();
        const { lastSelectedDate, isInitialized } = get();
        
        if (!isInitialized) {
          // If it's a new day, reset the selection
          if (lastSelectedDate !== today) {
            get().resetDailySelection();
          }
          
          set({ isInitialized: true });
        }
      },
      
      selectLearningItem: (itemId: string) => {
        const today = getTodayDateString();
        
        set({
          selectedItemId: itemId,
          lastSelectedDate: today,
        });
      },
      
      completeLearningItem: (itemId: string) => {
        const today = getTodayDateString();
        
        set(state => ({
          completedItems: {
            ...state.completedItems,
            [itemId]: true
          },
          completionDates: {
            ...state.completionDates,
            [itemId]: today
          }
        }));
      },
      
      isItemCompleted: (itemId: string) => {
        return get().completedItems[itemId] || false;
      },
      
      resetDailySelection: () => {
        const today = getTodayDateString();
        
        set({
          selectedItemId: null,
          lastSelectedDate: today,
        });
      },
      
      getLearningStats: () => {
        const { completedItems, completionDates, categories, learningItems } = get();
        
        // Calculate total completed
        const totalCompleted = Object.keys(completedItems).length;
        
        // Calculate current streak
        const streak = calculateStreak(completionDates);
        
        // Calculate weekly progress (last 7 days)
        const weeklyProgress = calculateWeeklyProgress(completionDates);
        
        // Calculate category stats
        const categoryStats = categories.map(category => {
          const categoryItems = learningItems.filter(item => item.category === category);
          const completedCategoryItems = categoryItems.filter(item => 
            completedItems[item.id]
          );
          
          return {
            category,
            completed: completedCategoryItems.length,
            total: categoryItems.length,
          };
        });
        
        return {
          totalCompleted,
          currentStreak: streak,
          weeklyProgress,
          categoryStats,
        };
      },
    }),
    {
      name: 'learn-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper function to calculate streak
function calculateStreak(completionDates: Record<string, string>): number {
  if (!completionDates || Object.keys(completionDates).length === 0) return 0;
  
  // Get all unique dates when items were completed
  const uniqueDates = [...new Set(Object.values(completionDates))].sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  if (uniqueDates.length === 0) return 0;
  
  // Check if today has any completed items
  const today = getTodayDateString();
  const hasCompletedToday = uniqueDates.includes(today);
  
  if (!hasCompletedToday) return 0;
  
  let streak = 1;
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  
  // Start from today and go backwards
  let currentDate = new Date(today);
  
  for (let i = 1; i <= 365; i++) { // Check up to a year back
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateString = prevDate.toISOString().split('T')[0];
    
    if (uniqueDates.includes(prevDateString)) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }
  
  return streak;
}

// Helper function to calculate weekly progress
function calculateWeeklyProgress(completionDates: Record<string, string>): boolean[] {
  const result: boolean[] = [];
  const uniqueDates = [...new Set(Object.values(completionDates))];
  
  // Get the last 7 days
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    result.push(uniqueDates.includes(dateString));
  }
  
  return result;
}