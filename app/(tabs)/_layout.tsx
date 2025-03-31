import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Home, BookOpen, BarChart2, User } from 'lucide-react-native';
import { useThemeStore } from '@/store/theme-store';
import { useInsightsStore } from '@/store/insights-store';
import { useDisciplinesStore } from '@/store/disciplines-store';
import { useJournalStore } from '@/store/journal-store';
import { useWisdomStore } from '@/store/wisdom-store';
import colors from '@/constants/colors';
import { isSameDay } from '@/utils/date-utils';

export default function TabLayout() {
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // Initialize stores
  useEffect(() => {
    try {
      // Get store functions safely
      const insightsStore = useInsightsStore.getState();
      const disciplinesStore = useDisciplinesStore.getState();
      const journalStore = useJournalStore.getState();
      const wisdomStore = useWisdomStore.getState();
      
      // Initialize each store
      if (insightsStore.initialize) {
        insightsStore.initialize();
      }
      
      if (disciplinesStore.initialize) {
        disciplinesStore.initialize();
      }
      
      if (journalStore.initialize) {
        journalStore.initialize();
      }
      
      if (wisdomStore.initialize) {
        wisdomStore.initialize();
      }
      
      // Check if we need to reset daily disciplines
      if (disciplinesStore.lastUpdated) {
        const lastUpdated = new Date(disciplinesStore.lastUpdated);
        const today = new Date();
        
        if (!isSameDay(lastUpdated, today) && disciplinesStore.resetDailyDisciplines) {
          disciplinesStore.resetDailyDisciplines();
        }
      }
      
      // Run daily analysis if needed
      if (insightsStore.lastAnalysisDate) {
        const lastAnalysis = new Date(insightsStore.lastAnalysisDate);
        const today = new Date();
        
        if (!isSameDay(lastAnalysis, today) && insightsStore.runDailyAnalysis) {
          insightsStore.runDailyAnalysis();
        }
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }, []);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme.primary,
        tabBarInactiveTintColor: colorScheme.text.muted,
        tabBarStyle: {
          backgroundColor: colorScheme.cardBackground,
          borderTopColor: colorScheme.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: colorScheme.background,
        },
        headerTintColor: colorScheme.text.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}