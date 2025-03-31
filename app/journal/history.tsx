import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Calendar, ChevronRight, ArrowLeft, BookText, Lock } from 'lucide-react-native';
import { useJournalStore } from '@/store/journal-store';
import { useThemeStore } from '@/store/theme-store';
import { useSubscriptionStore } from '@/store/subscription-store';
import { PREMIUM_FEATURES } from '@/store/subscription-store';
import EmptyState from '@/components/EmptyState';
import Card from '@/components/Card';
import PremiumFeatureOverlay from '@/components/PremiumFeatureOverlay';
import colors from '@/constants/colors';
import { getTodayDateString } from '@/utils/date-utils';

export default function JournalHistoryScreen() {
  const router = useRouter();
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // Get data from stores with error handling
  const journalStore = useJournalStore();
  const subscriptionStore = useSubscriptionStore();
  
  // Safely access functions with fallbacks
  const getAllEntries = journalStore.getAllEntries || (() => []);
  const prompts = journalStore.prompts || [];
  const isPremiumFeatureAvailable = subscriptionStore.isPremiumFeatureAvailable || (() => false);
  
  // Get entries and check premium access
  const entries = getAllEntries();
  const hasJournalHistoryAccess = isPremiumFeatureAvailable(PREMIUM_FEATURES?.JOURNAL_HISTORY || "journal_history");
  const today = getTodayDateString();
  
  const getPromptText = (promptId: string) => {
    const prompt = prompts.find(p => p.id === promptId);
    return prompt ? prompt.text : 'No prompt available';
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const isEntryFromToday = (dateString: string): boolean => {
    return dateString.split('T')[0] === today;
  };
  
  const navigateToEntry = (entryId: string, date: string) => {
    // Allow access to today's entry for all users
    if (isEntryFromToday(date) || hasJournalHistoryAccess) {
      router.push({
        pathname: '/journal/entry',
        params: { id: entryId }
      });
    } else {
      // Redirect to subscription page for past entries
      router.push('/subscription');
    }
  };
  
  const renderJournalItem = ({ item }: { item: any }) => {
    const isToday = isEntryFromToday(item.date);
    const isLocked = !isToday && !hasJournalHistoryAccess;
    
    return (
      <TouchableOpacity 
        onPress={() => navigateToEntry(item.id, item.date)}
        activeOpacity={0.7}
      >
        <Card style={styles.entryCard}>
          <View style={styles.entryHeader}>
            <View style={styles.dateContainer}>
              <Calendar size={16} color={colorScheme.text.secondary} style={styles.calendarIcon} />
              <Text style={[styles.dateText, { color: colorScheme.text.primary }]}>
                {formatDate(item.date)}
                {isToday && <Text style={styles.todayBadge}> • Today</Text>}
              </Text>
            </View>
            
            {isLocked ? (
              <Lock size={16} color={colorScheme.accent} />
            ) : (
              <ChevronRight size={20} color={colorScheme.text.muted} />
            )}
          </View>
          
          <Text style={[styles.promptText, { color: colorScheme.text.secondary }]} numberOfLines={2}>
            {getPromptText(item.promptId)}
          </Text>
          
          <Text 
            style={[
              styles.contentPreview, 
              { color: colorScheme.text.primary },
              isLocked && styles.blurredContent
            ]} 
            numberOfLines={2}
          >
            {isLocked ? "••••••••••••••••••••••••••••••••••" : item.content}
          </Text>
        </Card>
      </TouchableOpacity>
    );
  };
  
  const renderEmptyState = () => (
    <EmptyState
      icon={<BookText size={40} color={colorScheme.primary} />}
      title="No Journal Entries Yet"
      description="Your journal history will appear here once you start writing."
    />
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colorScheme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colorScheme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colorScheme.text.primary }]}>Journal History</Text>
        <View style={styles.placeholder} />
      </View>
      
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderJournalItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
      
      {!hasJournalHistoryAccess && entries.length > 0 && entries.some(entry => !isEntryFromToday(entry.date)) && (
        <PremiumFeatureOverlay 
          message="Upgrade to Premium to access your complete journal history and track your growth journey over time."
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  entryCard: {
    marginBottom: 12,
    padding: 16,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  todayBadge: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  promptText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  contentPreview: {
    fontSize: 16,
  },
  blurredContent: {
    opacity: 0.5,
  },
});