import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CheckCircle2, Circle, ArrowLeft, Award, Flag, Calendar } from 'lucide-react-native';
import { useInsightsStore } from '@/store/insights-store';
import { useSubscriptionStore, PREMIUM_FEATURES } from '@/store/subscription-store';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import Card from '@/components/Card';
import PremiumFeatureOverlay from '@/components/PremiumFeatureOverlay';

export default function GrowthPlanScreen() {
  const router = useRouter();
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const { 
    growthPlan, 
    completeMilestone, 
    completeChallenge,
    generateGrowthPlan
  } = useInsightsStore();
  
  const isPremium = useSubscriptionStore(state => 
    state.isPremiumFeatureAvailable(PREMIUM_FEATURES.GROWTH_PLAN)
  );
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Handle milestone completion
  const handleCompleteMilestone = (id: string) => {
    completeMilestone(id);
  };
  
  // Handle challenge completion
  const handleCompleteChallenge = (id: string) => {
    completeChallenge(id);
  };
  
  // Navigate back
  const handleBack = () => {
    router.back();
  };
  
  // Generate a new growth plan
  const handleGeneratePlan = () => {
    generateGrowthPlan();
  };
  
  // Navigate to subscription screen
  const handleUpgrade = () => {
    router.push('/subscription');
  };
  
  // Safely access plan properties
  const plan = growthPlan || null;
  const milestones = plan?.milestones || [];
  const challenges = plan?.challenges || [];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colorScheme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colorScheme.text.primary }]}>
          Growth Plan
        </Text>
        <View style={styles.headerRight} />
      </View>
      
      {!isPremium ? (
        <PremiumFeatureOverlay
          title="Unlock Growth Plan"
          description="Get a personalized plan to build better habits and achieve your growth goals."
          featureName={PREMIUM_FEATURES.GROWTH_PLAN}
          onUpgrade={handleUpgrade}
        />
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {plan ? (
            <>
              <View style={styles.planHeader}>
                <Text style={[styles.planTitle, { color: colorScheme.text.primary }]}>
                  {plan.title}
                </Text>
                <Text style={[styles.planDescription, { color: colorScheme.text.secondary }]}>
                  {plan.description}
                </Text>
                
                <View style={styles.dateContainer}>
                  <Calendar size={16} color={colorScheme.text.secondary} style={styles.dateIcon} />
                  <Text style={[styles.dateText, { color: colorScheme.text.secondary }]}>
                    {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressTextContainer}>
                  <Text style={[styles.progressLabel, { color: colorScheme.text.secondary }]}>
                    Overall Progress
                  </Text>
                  <Text style={[styles.progressPercent, { color: colorScheme.text.primary }]}>
                    {Math.round((plan.progress || 0) * 100)}%
                  </Text>
                </View>
                
                <View style={[styles.progressBar, { backgroundColor: `${colorScheme.primary}30` }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        backgroundColor: colorScheme.primary,
                        width: `${Math.round((plan.progress || 0) * 100)}%` 
                      }
                    ]} 
                  />
                </View>
              </View>
              
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleContainer}>
                    <Award size={20} color={colorScheme.primary} style={styles.sectionIcon} />
                    <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
                      Milestones
                    </Text>
                  </View>
                  <Text style={[styles.sectionCount, { color: colorScheme.text.secondary }]}>
                    {milestones.filter(m => m.isCompleted).length}/{milestones.length} </Text>
                </View>
                
                {milestones.map((milestone) => (
                  <Card key={milestone.id} style={styles.itemCard}>
                    <TouchableOpacity 
                      style={styles.itemContainer}
                      onPress={() => handleCompleteMilestone(milestone.id)}
                      disabled={milestone.isCompleted}
                    >
                      <View style={styles.checkContainer}>
                        {milestone.isCompleted ? (
                          <CheckCircle2 size={24} color={colorScheme.success} />
                        ) : (
                          <Circle size={24} color={colorScheme.primary} />
                        )}
                      </View>
                      
                      <View style={styles.itemContent}>
                        <Text 
                          style={[
                            styles.itemTitle, 
                            { 
                              color: colorScheme.text.primary,
                              textDecorationLine: milestone.isCompleted ? 'line-through' : 'none'
                            }
                          ]}
                        >
                          {milestone.title}
                        </Text>
                        
                        <Text style={[styles.itemDescription, { color: colorScheme.text.secondary }]}>
                          {milestone.description}
                        </Text>
                        
                        <View style={styles.itemFooter}>
                          <Text style={[styles.targetDate, { color: colorScheme.text.muted }]}>
                            Target: {formatDate(milestone.targetDate)}
                          </Text>
                          
                          {milestone.isCompleted && milestone.completedDate && (
                            <Text style={[styles.completedDate, { color: colorScheme.success }]}>
                              Completed: {formatDate(milestone.completedDate)}
                            </Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Card>
                ))}
              </View>
              
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleContainer}>
                    <Flag size={20} color={colorScheme.warning} style={styles.sectionIcon} />
                    <Text style={[styles.sectionTitle, { color: colorScheme.text.primary }]}>
                      Challenges
                    </Text>
                  </View>
                  <Text style={[styles.sectionCount, { color: colorScheme.text.secondary }]}>
                    {challenges.filter(c => c.isCompleted).length}/{challenges.length}
                  </Text>
                </View>
                
                {challenges.map((challenge) => (
                  <Card key={challenge.id} style={styles.itemCard}>
                    <TouchableOpacity 
                      style={styles.itemContainer}
                      onPress={() => handleCompleteChallenge(challenge.id)}
                      disabled={challenge.isCompleted}
                    >
                      <View style={styles.checkContainer}>
                        {challenge.isCompleted ? (
                          <CheckCircle2 size={24} color={colorScheme.success} />
                        ) : (
                          <Circle size={24} color={colorScheme.warning} />
                        )}
                      </View>
                      
                      <View style={styles.itemContent}>
                        <View style={styles.challengeTitleRow}>
                          <Text 
                            style={[
                              styles.itemTitle, 
                              { 
                                color: colorScheme.text.primary,
                                textDecorationLine: challenge.isCompleted ? 'line-through' : 'none'
                              }
                            ]}
                          >
                            {challenge.title}
                          </Text>
                          
                          <View 
                            style={[
                              styles.difficultyBadge, 
                              { 
                                backgroundColor: 
                                  challenge.difficulty === 'easy' 
                                    ? `${colorScheme.success}20` 
                                    : challenge.difficulty === 'moderate'
                                      ? `${colorScheme.warning}20`
                                      : `${colorScheme.error}20`
                              }
                            ]}
                          >
                            <Text 
                              style={[
                                styles.difficultyText, 
                                { 
                                  color: 
                                    challenge.difficulty === 'easy' 
                                      ? colorScheme.success 
                                      : challenge.difficulty === 'moderate'
                                        ? colorScheme.warning
                                        : colorScheme.error
                                }
                              ]}
                            >
                              {challenge.difficulty}
                            </Text>
                          </View>
                        </View>
                        
                        <Text style={[styles.itemDescription, { color: colorScheme.text.secondary }]}>
                          {challenge.description}
                        </Text>
                        
                        {challenge.isCompleted && challenge.completedDate && (
                          <Text style={[styles.completedDate, { color: colorScheme.success }]}>
                            Completed: {formatDate(challenge.completedDate)}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  </Card>
                ))}
              </View>
              
              <TouchableOpacity 
                style={[styles.generateButton, { backgroundColor: colorScheme.primary }]}
                onPress={handleGeneratePlan}
              >
                <Text style={styles.generateButtonText}>Generate New Plan</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyTitle, { color: colorScheme.text.primary }]}>
                No Growth Plan Yet
              </Text>
              <Text style={[styles.emptyDescription, { color: colorScheme.text.secondary }]}>
                Generate a personalized growth plan based on your habits and goals.
              </Text>
              <TouchableOpacity 
                style={[styles.generateButton, { backgroundColor: colorScheme.primary }]}
                onPress={handleGeneratePlan}
              >
                <Text style={styles.generateButtonText}>Generate Growth Plan</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
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
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  planHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 6,
  },
  dateText: {
    fontSize: 14,
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
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
  sectionCount: {
    fontSize: 14,
  },
  itemCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  checkContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  targetDate: {
    fontSize: 12,
  },
  completedDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  challengeTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  generateButton: {
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
});