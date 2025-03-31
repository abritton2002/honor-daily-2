import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react-native';
import Card from './Card';
import { GrowthPlan } from '@/types/insights';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface GrowthPlanCardProps {
  plan: GrowthPlan;
  onPress?: () => void;
  onCompleteMilestone?: (id: string) => void;
  onCompleteChallenge?: (id: string) => void;
}

export default function GrowthPlanCard({ 
  plan, 
  onPress, 
  onCompleteMilestone, 
  onCompleteChallenge 
}: GrowthPlanCardProps) {
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // Safely handle potentially undefined properties
  if (!plan) return null;
  
  const milestones = plan.milestones || [];
  const challenges = plan.challenges || [];
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!plan.endDate) return 0;
    
    const endDate = new Date(plan.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  const daysRemaining = getDaysRemaining();
  
  // Get next milestone or challenge
  const getNextItem = () => {
    const incompleteMilestones = milestones.filter(m => !m.isCompleted);
    const incompleteChallenges = challenges.filter(c => !c.isCompleted);
    
    if (incompleteMilestones.length === 0 && incompleteChallenges.length === 0) {
      return null;
    }
    
    if (incompleteMilestones.length === 0) {
      return incompleteChallenges[0];
    }
    
    if (incompleteChallenges.length === 0) {
      return incompleteMilestones[0];
    }
    
    // If both have items, return the milestone (prioritize milestones)
    return incompleteMilestones[0];
  };
  
  const nextItem = getNextItem();
  
  // Handle milestone completion
  const handleCompleteMilestone = (id: string) => {
    if (onCompleteMilestone) {
      onCompleteMilestone(id);
    }
  };
  
  // Handle challenge completion
  const handleCompleteChallenge = (id: string) => {
    if (onCompleteChallenge) {
      onCompleteChallenge(id);
    }
  };
  
  return (
    <Card style={styles.card}>
      <TouchableOpacity 
        style={styles.container} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colorScheme.text.primary }]}>
              {plan.title}
            </Text>
            <Text style={[styles.dates, { color: colorScheme.text.secondary }]}>
              {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
            </Text>
          </View>
          
          <View style={[styles.daysContainer, { backgroundColor: colorScheme.cardBackgroundAlt }]}>
            <Text style={[styles.daysNumber, { color: colorScheme.text.primary }]}>
              {daysRemaining}
            </Text>
            <Text style={[styles.daysLabel, { color: colorScheme.text.secondary }]}>
              days left
            </Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressTextContainer}>
            <Text style={[styles.progressLabel, { color: colorScheme.text.secondary }]}>
              Progress
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
        
        <View style={styles.focusAreasContainer}>
          {(plan.focusAreas || []).map((area, index) => (
            <View 
              key={index} 
              style={[styles.focusArea, { backgroundColor: `${colorScheme.primary}20` }]}
            >
              <Text style={[styles.focusAreaText, { color: colorScheme.primary }]}>
                {typeof area === 'string' ? area.replace('_', ' ') : ''}
              </Text>
            </View>
          ))}
        </View>
        
        {nextItem && (
          <View style={styles.nextItemContainer}>
            <Text style={[styles.nextItemLabel, { color: colorScheme.text.secondary }]}>
              Next Up:
            </Text>
            <View style={styles.nextItem}>
              <TouchableOpacity 
                style={styles.checkContainer}
                onPress={() => {
                  if ('difficulty' in nextItem) {
                    // It's a challenge
                    handleCompleteChallenge(nextItem.id);
                  } else {
                    // It's a milestone
                    handleCompleteMilestone(nextItem.id);
                  }
                }}
              >
                <Circle size={22} color={colorScheme.primary} />
              </TouchableOpacity>
              
              <View style={styles.nextItemTextContainer}>
                <Text 
                  style={[styles.nextItemTitle, { color: colorScheme.text.primary }]}
                  numberOfLines={1}
                >
                  {nextItem.title}
                </Text>
                <Text 
                  style={[styles.nextItemDescription, { color: colorScheme.text.secondary }]}
                  numberOfLines={1}
                >
                  {nextItem.description}
                </Text>
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.footer}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colorScheme.text.primary }]}>
                {milestones.filter(m => m.isCompleted).length}/{milestones.length}
              </Text>
              <Text style={[styles.statLabel, { color: colorScheme.text.secondary }]}>
                Milestones
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colorScheme.text.primary }]}>
                {challenges.filter(c => c.isCompleted).length}/{challenges.length}
              </Text>
              <Text style={[styles.statLabel, { color: colorScheme.text.secondary }]}>
                Challenges
              </Text>
            </View>
          </View>
          
          <View style={styles.viewDetailsContainer}>
            <Text style={[styles.viewDetailsText, { color: colorScheme.primary }]}>
              View Details
            </Text>
            <ArrowRight size={16} color={colorScheme.primary} />
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  dates: {
    fontSize: 14,
  },
  daysContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  daysNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  daysLabel: {
    fontSize: 12,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  focusAreasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  focusArea: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  focusAreaText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  nextItemContainer: {
    marginBottom: 16,
  },
  nextItemLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  nextItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkContainer: {
    marginRight: 12,
  },
  nextItemTextContainer: {
    flex: 1,
  },
  nextItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  nextItemDescription: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    marginRight: 16,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});