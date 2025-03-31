import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight, TrendingUp, Brain, Lightbulb } from 'lucide-react-native';
import { useInsightsStore } from '@/store/insights-store';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';
import InsightCard from '@/components/InsightCard';
import PsychologicalProfileCard from '@/components/PsychologicalProfileCard';
import GrowthPlanCard from '@/components/GrowthPlanCard';
import Card from '@/components/Card';

export default function InsightsScreen() {
  const router = useRouter();
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // Get insights store functions with error handling
  const insightsStore = useInsightsStore();
  
  // Safely access functions with fallbacks
  const getInsights = insightsStore.getInsights || (() => []);
  const psychologicalProfile = insightsStore.psychologicalProfile || {};
  const growthPlan = insightsStore.growthPlan || {};
  const initialize = insightsStore.initialize || (() => {});
  
  const [recentInsights, setRecentInsights] = useState([]);
  
  // Initialize insights store
  useEffect(() => {
    try {
      initialize();
      
      // Get recent insights
      const insights = getInsights(undefined, 3);
      setRecentInsights(insights);
    } catch (error) {
      console.error('Error initializing insights:', error);
    }
  }, [initialize, getInsights]);
  
  const navigateToGrowthInsights = () => {
    router.push('/growth/insights');
  };
  
  const navigateToGrowthPlan = () => {
    router.push('/growth/plan');
  };
  
  const navigateToGrowthHistory = () => {
    router.push('/growth/history');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colorScheme.text.primary }]}>Insights</Text>
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
                Psychological Profile
              </Text>
            </View>
            
            <TouchableOpacity onPress={navigateToGrowthInsights}>
              <ChevronRight size={20} color={colorScheme.text.muted} />
            </TouchableOpacity>
          </View>
          
          <PsychologicalProfileCard profile={psychologicalProfile} />
        </View>
        
        {/* Growth Plan Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <TrendingUp size={20} color={colorScheme.primary} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
                Growth Plan
              </Text>
            </View>
            
            <TouchableOpacity onPress={navigateToGrowthPlan}>
              <ChevronRight size={20} color={colorScheme.text.muted} />
            </TouchableOpacity>
          </View>
          
          <GrowthPlanCard plan={growthPlan} />
        </View>
        
        {/* Recent Insights Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Lightbulb size={20} color={colorScheme.primary} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
                Recent Insights
              </Text>
            </View>
            
            <TouchableOpacity onPress={navigateToGrowthHistory}>
              <ChevronRight size={20} color={colorScheme.text.muted} />
            </TouchableOpacity>
          </View>
          
          {recentInsights && recentInsights.length > 0 ? (
            recentInsights.map((insight) => (
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
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
  emptyCard: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});