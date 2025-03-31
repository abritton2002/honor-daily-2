import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { History, PenLine } from 'lucide-react-native';
import HeaderBar from '@/components/HeaderBar';
import JournalPrompt from '@/components/JournalPrompt';
import { useJournalStore } from '@/store/journal-store';
import { formatDate, getTodayDateString } from '@/utils/date-utils';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import Card from '@/components/Card';

export default function JournalScreen() {
  const router = useRouter();
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // Get journal store functions with error handling
  const journalStore = useJournalStore();
  
  // Safely access functions with fallbacks
  const currentPrompt = journalStore.currentPrompt;
  const getEntryForDate = journalStore.getEntryForDate || (() => undefined);
  const addEntry = journalStore.addEntry || (() => "");
  const initialize = journalStore.initialize || (() => {});
  
  const [journalContent, setJournalContent] = useState('');
  const today = getTodayDateString();
  
  // Initialize journal store
  useEffect(() => {
    try {
      initialize();
    } catch (error) {
      console.error('Error initializing journal store:', error);
    }
  }, [initialize]);
  
  // Load today's entry if it exists
  useEffect(() => {
    try {
      const todayEntry = getEntryForDate(today);
      if (todayEntry) {
        setJournalContent(todayEntry.content);
      } else {
        setJournalContent('');
      }
    } catch (error) {
      console.error('Error loading today\'s entry:', error);
    }
  }, [getEntryForDate, today]);
  
  const handleSaveEntry = () => {
    try {
      if (journalContent.trim()) {
        addEntry(journalContent);
        Alert.alert('Success', 'Your journal entry has been saved.');
      } else {
        Alert.alert('Empty Entry', 'Please write something before saving.');
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save your journal entry. Please try again.');
    }
  };
  
  const navigateToHistory = () => {
    router.push('/journal/history');
  };
  
  const navigateToNewEntry = () => {
    router.push('/journal/entry');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme.background }]} edges={['top']}>
      <HeaderBar 
        title="Daily Journal" 
        date={formatDate(new Date())} 
      />
      
      {currentPrompt ? (
        <JournalPrompt
          prompt={currentPrompt.text}
          value={journalContent}
          onChangeText={setJournalContent}
          onSave={handleSaveEntry}
        />
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={[styles.emptyText, { color: colorScheme.text.secondary }]}>
            No journal prompt available for today.
          </Text>
          <TouchableOpacity 
            style={[styles.emptyButton, { backgroundColor: colorScheme.primary }]}
            onPress={navigateToNewEntry}
          >
            <Text style={styles.emptyButtonText}>Write Journal Entry</Text>
          </TouchableOpacity>
        </Card>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.historyButton, { backgroundColor: colorScheme.secondary }]}
          onPress={navigateToHistory}
        >
          <History size={24} color={colorScheme.text.inverse} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.newEntryButton, { backgroundColor: colorScheme.primary }]}
          onPress={navigateToNewEntry}
        >
          <PenLine size={24} color={colorScheme.text.inverse} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyCard: {
    margin: 16,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  historyButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  newEntryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});