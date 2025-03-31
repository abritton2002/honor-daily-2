import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WisdomEntry, WisdomType } from '@/types/wisdom';
import { WISDOM_ENTRIES } from '@/mocks/wisdom';
import { getItemsForToday, getTodayDateString } from '@/utils/date-utils';

interface WisdomState {
  entries: WisdomEntry[];
  lastFetchDate: string | null;
  todayEntries: WisdomEntry[];
  isInitialized: boolean;
  
  // Actions
  initialize: () => void;
  refreshTodayEntries: () => void;
  getEntriesByType: (type: WisdomType) => WisdomEntry[];
}

export const useWisdomStore = create<WisdomState>()(
  persist(
    (set, get) => ({
      entries: WISDOM_ENTRIES,
      lastFetchDate: null,
      todayEntries: [],
      isInitialized: false,
      
      initialize: () => {
        const { lastFetchDate, isInitialized } = get();
        const today = getTodayDateString();
        
        if (!isInitialized) {
          if (lastFetchDate !== today) {
            get().refreshTodayEntries();
          }
          
          set({ isInitialized: true });
        }
      },
      
      refreshTodayEntries: () => {
        const today = getTodayDateString();
        const { entries } = get();
        
        // Get one of each type for today
        const quote = getItemsForToday(
          entries.filter(entry => entry.type === 'quote'),
          1
        )[0];
        
        const financial = getItemsForToday(
          entries.filter(entry => entry.type === 'financial'),
          1
        )[0];
        
        const parable = getItemsForToday(
          entries.filter(entry => entry.type === 'parable'),
          1
        )[0];
        
        const todayEntries = [quote, financial, parable].filter(
          (entry): entry is WisdomEntry => entry !== undefined
        );
        
        set({
          todayEntries,
          lastFetchDate: today,
        });
      },
      
      getEntriesByType: (type) => {
        return get().entries.filter(entry => entry.type === type);
      },
    }),
    {
      name: 'wisdom-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);