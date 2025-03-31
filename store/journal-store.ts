import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, JournalPrompt } from '@/types/journal';
import { JOURNAL_PROMPTS } from '@/mocks/journal-prompts';
import { getRandomItemForToday } from '@/utils/date-utils';

interface JournalState {
  entries: JournalEntry[];
  prompts: JournalPrompt[];
  currentPrompt: JournalPrompt | null;
  isInitialized: boolean;
  
  // Actions
  initialize: () => void;
  addEntry: (content: string) => string;
  updateEntry: (id: string, content: string) => void;
  deleteEntry: (id: string) => void;
  setCurrentPrompt: (prompt: JournalPrompt) => void;
  refreshPrompt: () => void;
  getPromptForToday: () => JournalPrompt | null;
  
  // Getters
  getEntryById: (id: string) => JournalEntry | undefined;
  getEntryForDate: (date: string) => JournalEntry | undefined;
  getEntriesByDateRange: (startDate: string, endDate: string) => JournalEntry[];
  getRecentEntries: (limit?: number) => JournalEntry[];
  getAllEntries: () => JournalEntry[]; // Added missing function
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      prompts: JOURNAL_PROMPTS,
      currentPrompt: null,
      isInitialized: false,
      
      initialize: () => {
        const { isInitialized, refreshPrompt } = get();
        
        if (!isInitialized) {
          refreshPrompt();
          set({ isInitialized: true });
        }
      },
      
      addEntry: (content) => {
        const { currentPrompt } = get();
        const today = new Date().toISOString().split('T')[0];
        
        // Check if there's already an entry for today
        const existingEntry = get().getEntryForDate(today);
        
        if (existingEntry) {
          // Update existing entry
          get().updateEntry(existingEntry.id, content);
          return existingEntry.id;
        } else {
          // Create new entry
          const newEntry: JournalEntry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            content,
            promptId: currentPrompt?.id || "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set((state) => ({
            entries: [newEntry, ...state.entries],
          }));
          
          return newEntry.id;
        }
      },
      
      updateEntry: (id, content) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? { ...entry, content, updatedAt: new Date().toISOString() }
              : entry
          ),
        }));
      },
      
      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },
      
      setCurrentPrompt: (prompt) => {
        set({ currentPrompt: prompt });
      },
      
      refreshPrompt: () => {
        const { prompts } = get();
        const randomPrompt = getRandomItemForToday(prompts);
        set({ currentPrompt: randomPrompt });
      },
      
      getPromptForToday: () => {
        const { currentPrompt, refreshPrompt } = get();
        
        if (!currentPrompt) {
          refreshPrompt();
          return get().currentPrompt;
        }
        
        return currentPrompt;
      },
      
      getEntryById: (id) => {
        return get().entries.find((entry) => entry.id === id);
      },
      
      getEntryForDate: (date) => {
        const datePrefix = date.split('T')[0]; // Get just the date part
        return get().entries.find((entry) => entry.date.split('T')[0] === datePrefix);
      },
      
      getEntriesByDateRange: (startDate, endDate) => {
        return get().entries.filter(
          (entry) => entry.date >= startDate && entry.date <= endDate
        );
      },
      
      getRecentEntries: (limit = 10) => {
        return get().entries
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      },
      
      // Added missing function
      getAllEntries: () => {
        return get().entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
    }),
    {
      name: 'journal-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);