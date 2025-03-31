import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Discipline } from '@/types/disciplines';
import { MOCK_DISCIPLINES } from '@/mocks/disciplines';
import { isSameDay, format } from '@/utils/date-utils';

interface DisciplinesState {
  disciplines: Discipline[];
  completedToday: Record<string, boolean>;
  streaks: Record<string, number>;
  lastUpdated: string | null;
  
  // Actions
  initialize: () => void;
  addDiscipline: (discipline: Omit<Discipline, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDiscipline: (id: string, updates: Partial<Discipline>) => void;
  deleteDiscipline: (id: string) => void;
  toggleDiscipline: (id: string, completed: boolean) => void;
  resetDailyDisciplines: () => void;
  
  // Getters
  getDisciplines: (category?: string) => Discipline[];
  getDisciplineById: (id: string) => Discipline | undefined;
  getDailyDisciplines: () => Discipline[];
  getCompletionRate: (days?: number) => number;
  getStreak: (id: string) => number;
}

export const useDisciplinesStore = create<DisciplinesState>()(
  persist(
    (set, get) => ({
      disciplines: [],
      completedToday: {},
      streaks: {},
      lastUpdated: null,
      
      initialize: () => {
        const { disciplines, lastUpdated } = get();
        
        // Only initialize if no disciplines exist
        if (disciplines.length === 0) {
          set({
            disciplines: MOCK_DISCIPLINES,
            lastUpdated: new Date().toISOString()
          });
        }
        
        // Check if we need to reset daily disciplines
        const today = new Date();
        if (lastUpdated) {
          const lastUpdatedDate = new Date(lastUpdated);
          if (!isSameDay(today, lastUpdatedDate)) {
            get().resetDailyDisciplines();
          }
        }
      },
      
      addDiscipline: (discipline) => {
        const newDiscipline: Discipline = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...discipline
        };
        
        set((state) => ({
          disciplines: [...state.disciplines, newDiscipline],
          streaks: {
            ...state.streaks,
            [newDiscipline.id]: 0
          }
        }));
      },
      
      updateDiscipline: (id, updates) => {
        set((state) => ({
          disciplines: state.disciplines.map((discipline) =>
            discipline.id === id ? { 
              ...discipline, 
              ...updates,
              updatedAt: new Date().toISOString()
            } : discipline
          )
        }));
      },
      
      deleteDiscipline: (id) => {
        set((state) => {
          const newCompletedToday = { ...state.completedToday };
          const newStreaks = { ...state.streaks };
          
          delete newCompletedToday[id];
          delete newStreaks[id];
          
          return {
            disciplines: state.disciplines.filter((discipline) => discipline.id !== id),
            completedToday: newCompletedToday,
            streaks: newStreaks
          };
        });
      },
      
      toggleDiscipline: (id, completed) => {
        const { completedToday, streaks, disciplines } = get();
        const discipline = disciplines.find(d => d.id === id);
        
        if (!discipline) return;
        
        // Update completed status
        const newCompletedToday = {
          ...completedToday,
          [id]: completed
        };
        
        // Update streak if needed
        let newStreaks = { ...streaks };
        if (completed) {
          // Increment streak
          newStreaks[id] = (streaks[id] || 0) + 1;
          
          // Update last completed date
          get().updateDiscipline(id, {
            lastCompletedDate: new Date().toISOString()
          });
        } else {
          // Decrement streak, but don't go below 0
          newStreaks[id] = Math.max(0, (streaks[id] || 0) - 1);
        }
        
        set({
          completedToday: newCompletedToday,
          streaks: newStreaks,
          lastUpdated: new Date().toISOString()
        });
      },
      
      resetDailyDisciplines: () => {
        set({
          completedToday: {},
          lastUpdated: new Date().toISOString()
        });
      },
      
      getDisciplines: (category) => {
        const { disciplines } = get();
        
        if (category) {
          return disciplines.filter((discipline) => discipline.category === category);
        }
        
        return disciplines;
      },
      
      getDisciplineById: (id) => {
        const { disciplines } = get();
        return disciplines.find((discipline) => discipline.id === id);
      },
      
      getDailyDisciplines: () => {
        const { disciplines } = get();
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        return disciplines.filter((discipline) => {
          if (discipline.frequency === 'daily') {
            return true;
          }
          
          if (discipline.frequency === 'weekly' || 
              discipline.frequency === 'custom') {
            return discipline.scheduledDays && discipline.scheduledDays.includes(dayOfWeek);
          }
          
          return false;
        });
      },
      
      getCompletionRate: (days = 7) => {
        const { completedToday, getDailyDisciplines } = get();
        const dailyDisciplines = getDailyDisciplines();
        
        if (dailyDisciplines.length === 0) return 0;
        
        const completedCount = Object.values(completedToday).filter(Boolean).length;
        return completedCount / dailyDisciplines.length;
      },
      
      getStreak: (id) => {
        const { streaks } = get();
        return streaks[id] || 0;
      }
    }),
    {
      name: 'disciplines-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);