import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Settings, ChevronRight, BookOpen, Calendar, BarChart2 } from 'lucide-react-native';
import Card from '@/components/Card';
import { useProfileStore } from '@/store/profile-store';
import { useDisciplinesStore } from '@/store/disciplines-store';
import { useJournalStore } from '@/store/journal-store';
import { useLearnStore } from '@/store/learn-store';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import { useSubscriptionStore } from '@/store/subscription-store';
import PremiumBadge from '@/components/PremiumBadge';

export default function ProfileScreen() {
  const router = useRouter();
  const { name, avatar, goal } = useProfileStore();
  const { disciplines } = useDisciplinesStore();
  const { entries } = useJournalStore();
  const { getLearningStats } = useLearnStore();
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  const { subscription } = useSubscriptionStore();
  
  // Calculate stats
  const activeDisciplines = disciplines ? disciplines.filter(d => d.isActive).length : 0;
  const journalEntries = entries ? Object.keys(entries).length : 0;
  const { totalCompleted: learningCompleted } = getLearningStats ? getLearningStats() : { totalCompleted: 0 };
  
  const navigateToSettings = () => {
    router.push('/settings');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colorScheme.text.primary }]}>Profile</Text>
        <TouchableOpacity onPress={navigateToSettings} style={styles.settingsButton}>
          <Settings size={24} color={colorScheme.text.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image 
              source={{ uri: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80' }} 
              style={styles.avatar} 
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colorScheme.text.primary }]}>{name || "Your Name"}</Text>
              {subscription && subscription.tier === 'premium' && <PremiumBadge style={styles.premiumBadge} />}
              <Text style={[styles.profileGoal, { color: colorScheme.text.secondary }]}>
                {goal || "Set your growth goal in settings"}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.statsSection}>
          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colorScheme.text.primary }]}>{activeDisciplines}</Text>
                <Text style={[styles.statLabel, { color: colorScheme.text.secondary }]}>Active Disciplines</Text>
              </View>
              
              <View style={[styles.divider, { backgroundColor: colorScheme.border }]} />
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colorScheme.text.primary }]}>{journalEntries}</Text>
                <Text style={[styles.statLabel, { color: colorScheme.text.secondary }]}>Journal Entries</Text>
              </View>
              
              <View style={[styles.divider, { backgroundColor: colorScheme.border }]} />
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colorScheme.text.primary }]}>{learningCompleted}</Text>
                <Text style={[styles.statLabel, { color: colorScheme.text.secondary }]}>Lessons Completed</Text>
              </View>
            </View>
          </Card>
        </View>
        
        <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>History & Analytics</Text>
        
        <TouchableOpacity onPress={() => router.push('/growth/history')}>
          <Card style={styles.menuCard}>
            <View style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <BarChart2 size={20} color={colorScheme.primary} />
              </View>
              <Text style={[styles.menuText, { color: colorScheme.text.primary }]}>Growth History</Text>
              <ChevronRight size={20} color={colorScheme.text.muted} />
            </View>
          </Card>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/journal/history')}>
          <Card style={styles.menuCard}>
            <View style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Calendar size={20} color={colorScheme.primary} />
              </View>
              <Text style={[styles.menuText, { color: colorScheme.text.primary }]}>Journal History</Text>
              <ChevronRight size={20} color={colorScheme.text.muted} />
            </View>
          </Card>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/learning/history')}>
          <Card style={styles.menuCard}>
            <View style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <BookOpen size={20} color={colorScheme.primary} />
              </View>
              <Text style={[styles.menuText, { color: colorScheme.text.primary }]}>Learning History</Text>
              <ChevronRight size={20} color={colorScheme.text.muted} />
            </View>
          </Card>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/subscription')}>
          <Card style={[styles.subscriptionCard, { backgroundColor: colorScheme.primary }]}>
            <View style={styles.subscriptionContent}>
              <Text style={styles.subscriptionTitle}>
                {subscription && subscription.tier === 'premium' ? 'Manage Premium' : 'Upgrade to Premium'}
              </Text>
              <Text style={styles.subscriptionDescription}>
                {subscription && subscription.tier === 'premium' 
                  ? 'Access all your premium features' 
                  : 'Unlock full history, analytics, and more'}
              </Text>
            </View>
            <ChevronRight size={20} color="#FFFFFF" />
          </Card>
        </TouchableOpacity>
      </ScrollView>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileSection: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  premiumBadge: {
    marginBottom: 8,
  },
  profileGoal: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsCard: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  menuCard: {
    padding: 0,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconContainer: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  subscriptionCard: {
    marginTop: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscriptionContent: {
    flex: 1,
  },
  subscriptionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subscriptionDescription: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: 14,
  },
});