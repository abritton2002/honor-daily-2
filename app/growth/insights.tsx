import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Brain, TrendingUp, Lightbulb } from 'lucide-react-native';
import { useInsightsStore } from '@/store/insights-store';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';
import PsychologicalProfileCard from '@/components/PsychologicalProfileCard';
import InsightCard from '@/components/InsightCard';
import Card from '@/components/Card';

export default function GrowthInsightsScreen() {
  const router = useRouter();
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // Get insights store functions with error handling
  const insightsStore = useInsightsStore();
  
  // Safely access functions with fallbacks
  const getInsights = insightsStore.getInsights || (() => []);
  const psychologicalProfile = insightsStore.psychologicalProfile || {};
  const runDailyAnalysis = insightsStore.runDailyAnalysis || (() => {});
  
  const [insights, setInsights] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Load insights
  useEffect(() => {
    try {
      const allInsights = getInsights();
      setInsights(allInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  }, [getInsights]);
  
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      
      // Run analysis to generate new insights
      runDailyAnalysis();
      
      // Get updated insights
      const updatedInsights = getInsights();
      setInsights(updatedInsights);
      
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error refreshing insights:', error);
      setIsRefreshing(false);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colorScheme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colorScheme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colorScheme.text.primary }]}>Psychological Insights</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Psychological Profile Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Brain size={20} color={colorScheme.primary} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
                Your Psychological Profile
              </Text>
            </View>
          </View>
          
          <PsychologicalProfileCard profile={psychologicalProfile} />
          
          <Text style={[styles.sectionDescription, { color: colorScheme.text.secondary }]}>
            Your psychological profile is built based on your activities, journal entries, and patterns observed in the app.
            It helps provide personalized recommendations and insights.
          </Text>
        </View>
        
        {/* Insights Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Lightbulb size={20} color={colorScheme.primary} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
                All Insights
              </Text>
            </View>
            
            <TouchableOpacity 
              onPress={handleRefresh}
              disabled={isRefreshing}
              style={[
                styles.refreshButton,
                { backgroundColor: colorScheme.primary },
                isRefreshing && { opacity: 0.7 }
              ]}
            >
              <Text style={styles.refreshButtonText}>
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {insights && insights.length > 0 ? (
            insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={[styles.emptyText, { color: colorScheme.text.secondary }]}>
                No insights available yet. Continue using the app to generate personalized insights.
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
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
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyCard: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});