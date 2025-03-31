import React, { useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {Plus, ChevronRight, BookOpen, Lightbulb, Dumbbell} from 'lucide-react-native';
import {useDisciplinesStore} from '@/store/disciplines-store';
import {useJournalStore} from '@/store/journal-store';
import {useWisdomStore} from '@/store/wisdom-store';
import {useThemeStore} from '@/store/theme-store';
import DisciplineItem from '@/components/DisciplineItem';
import JournalPrompt from '@/components/JournalPrompt';
import WisdomCard from '@/components/WisdomCard';
import ProgressCircle from '@/components/ProgressCircle';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import {format} from '@/utils/date-utils';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // Get data from stores with error handling
  const disciplinesStore = useDisciplinesStore();
  const journalStore = useJournalStore();
  const wisdomStore = useWisdomStore();
  
  // Safely access functions with fallbacks
  const getDailyDisciplines = disciplinesStore.getDailyDisciplines || (() => []);
  const getCompletionRate = disciplinesStore.getCompletionRate || (() => 0);
  const completedToday = disciplinesStore.completedToday || {};
  const initializeDisciplines = disciplinesStore.initialize || (() => {});
  
  const getPromptForToday = journalStore.getPromptForToday || (() => null);
  const initializeJournal = journalStore.initialize || (() => {});
  
  const getRandomWisdom = wisdomStore.getRandomWisdom || (() => null);
  const initializeWisdom = wisdomStore.initialize || (() => {});
  
  // Local state
  const [dailyDisciplines, setDailyDisciplines] = useState([]);
  const [completionRate, setCompletionRate] = useState(0);
  const [todaysWisdom, setTodaysWisdom] = useState(null);
  const [journalPrompt, setJournalPrompt] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  
  // Initialize data
  useEffect(() => {
    try {
      initializeDisciplines();
      initializeWisdom();
      initializeJournal();
      
      // Set current date
      setCurrentDate(format(new Date(), 'EEEE, MMMM d'));
    } catch (error) {
      console.error('Error initializing home screen:', error);
    }
  }, []);
  
  // Update daily disciplines and completion rate
  useEffect(() => {
    try {
      const disciplines = getDailyDisciplines();
      setDailyDisciplines(disciplines);
      
      const rate = getCompletionRate();
      setCompletionRate(rate);
    } catch (error) {
      console.error('Error updating disciplines:', error);
    }
  }, [getDailyDisciplines, getCompletionRate, completedToday]);
  
  // Get wisdom and journal prompt
  useEffect(() => {
    try {
      // Get wisdom for today
      const wisdom = getRandomWisdom();
      setTodaysWisdom(wisdom);
      
      // Get journal prompt for today
      const prompt = getPromptForToday();
      setJournalPrompt(prompt);
    } catch (error) {
      console.error('Error getting wisdom and journal prompt:', error);
    }
  }, [getRandomWisdom, getPromptForToday]);
  
  const navigateToDisciplines = () => {
    router.push('/discipline/create');
  };
  
  const navigateToJournal = () => {
    router.push('/journal');
  };
  
  const navigateToWisdom = () => {
    router.push('/wisdom');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.date, { color: colorScheme.text.secondary }]}>{currentDate}</Text>
        <Text style={[styles.title, { color: colorScheme.text.primary }]}>Daily Practice</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Disciplines Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Dumbbell size={20} color={colorScheme.primary} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
                Daily Disciplines
              </Text>
            </View>
            
            <TouchableOpacity onPress={navigateToDisciplines}>
              <Plus size={20} color={colorScheme.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.progressContainer}>
            <ProgressCircle 
              progress={completionRate} 
              size={60} 
              strokeWidth={6} 
              progressColor={colorScheme.primary}
              backgroundColor={`${colorScheme.primary}20`}
            />
            <View style={styles.progressTextContainer}>
              <Text style={[styles.progressTitle, { color: colorScheme.text.primary }]}>
                Daily Progress
              </Text>
              <Text style={[styles.progressSubtitle, { color: colorScheme.text.secondary }]}>
                {Math.round(completionRate * 100)}% completed
              </Text>
            </View>
          </View>
          
          {dailyDisciplines.length > 0 ? (
            <View style={styles.disciplinesList}>
              {dailyDisciplines.map((discipline) => (
                <DisciplineItem 
                  key={discipline.id} 
                  discipline={discipline}
                  onPress={() => router.push(`/discipline/edit?id=${discipline.id}`)}
                />
              ))}
            </View>
          ) : (
            <Card style={[styles.emptyCard, { backgroundColor: colorScheme.cardBackground }]}>
              <Text style={[styles.emptyText, { color: colorScheme.text.secondary }]}>
                No disciplines for today. Add some to build your daily practice.
              </Text>
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: colorScheme.primary }]}
                onPress={navigateToDisciplines}
              >
                <Text style={[styles.addButtonText, { color: colorScheme.buttonText }]}>
                  Add Discipline
                </Text>
              </TouchableOpacity>
            </Card>
          )}
        </View>
        
        {/* Journal Prompt Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <BookOpen size={20} color={colorScheme.primary} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
                Journal Prompt
              </Text>
            </View>
            
            <TouchableOpacity onPress={navigateToJournal}>
              <ChevronRight size={20} color={colorScheme.text.muted} />
            </TouchableOpacity>
          </View>
          
          {journalPrompt ? (
            <JournalPrompt 
              prompt={journalPrompt.text} 
              onPress={() => router.push(`/journal/entry?promptId=${journalPrompt.id}`)}
            />
          ) : (
            <Card style={[styles.emptyCard, { backgroundColor: colorScheme.cardBackground }]}>
              <Text style={[styles.emptyText, { color: colorScheme.text.secondary }]}>
                No journal prompt available. Check back later.
              </Text>
            </Card>
          )}
        </View>
        
        {/* Wisdom Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Lightbulb size={20} color={colorScheme.primary} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
                Daily Wisdom
              </Text>
            </View>
            
            <TouchableOpacity onPress={navigateToWisdom}>
              <ChevronRight size={20} color={colorScheme.text.muted} />
            </TouchableOpacity>
          </View>
          
          {todaysWisdom ? (
            <WisdomCard 
              wisdom={todaysWisdom} 
              onPress={() => router.push('/wisdom')}
            />
          ) : (
            <Card style={[styles.emptyCard, { backgroundColor: colorScheme.cardBackground }]}>
              <Text style={[styles.emptyText, { color: colorScheme.text.secondary }]}>
                No wisdom available. Check back later.
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  date: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTextContainer: {
    marginLeft: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
  },
  disciplinesList: {
    marginBottom: 8,
  },
  emptyCard: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontWeight: '500',
  },
});