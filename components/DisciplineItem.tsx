import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle, Circle } from 'lucide-react-native';
import { useDisciplinesStore } from '@/store/disciplines-store';
import { useThemeStore } from '@/store/theme-store';
import colors from '@/constants/colors';

interface DisciplineItemProps {
  discipline: any;
  onPress?: () => void;
  showDetails?: boolean;
}

export default function DisciplineItem({ 
  discipline, 
  onPress, 
  showDetails = false 
}: DisciplineItemProps) {
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const toggleDiscipline = useDisciplinesStore(state => state.toggleDiscipline);
  const completedToday = useDisciplinesStore(state => state.completedToday || {});
  const getStreak = useDisciplinesStore(state => state.getStreak || (() => 0));
  
  const isCompleted = completedToday[discipline.id] || false;
  const streak = getStreak(discipline.id);
  
  const handleToggle = () => {
    try {
      toggleDiscipline(discipline.id, !isCompleted);
    } catch (error) {
      console.error('Error toggling discipline:', error);
    }
  };
  
  const getFrequencyText = () => {
    if (!discipline.frequency) return 'Daily';
    
    if (discipline.frequency === 'daily') {
      return 'Daily';
    }
    
    if (discipline.frequency === 'weekly') {
      return 'Weekly';
    }
    
    if (discipline.frequency === 'custom' && discipline.scheduledDays) {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const days = discipline.scheduledDays.map((day: number) => dayNames[day]).join(', ');
      return days;
    }
    
    return 'Custom';
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: colorScheme.cardBackground }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.checkbox}
          onPress={handleToggle}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isCompleted ? (
            <CheckCircle 
              size={24} 
              color={colorScheme.primary} 
              fill={colorScheme.primary} 
              strokeWidth={1.5} 
            />
          ) : (
            <Circle 
              size={24} 
              color={colorScheme.text.muted} 
              strokeWidth={1.5} 
            />
          )}
        </TouchableOpacity>
        
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.title, 
              { 
                color: colorScheme.text.primary,
                textDecorationLine: isCompleted ? 'line-through' : 'none',
                opacity: isCompleted ? 0.7 : 1
              }
            ]}
          >
            {discipline.name}
          </Text>
          
          {showDetails && (
            <Text style={[styles.details, { color: colorScheme.text.secondary }]}>
              {getFrequencyText()}
              {discipline.duration && ` • ${discipline.duration} min`}
            </Text>
          )}
        </View>
        
        {streak > 0 && (
          <View 
            style={[
              styles.streakBadge, 
              { backgroundColor: `${colorScheme.primary}20` }
            ]}
          >
            <Text style={[styles.streakText, { color: colorScheme.primary }]}>
              {streak} {streak === 1 ? 'day' : 'days'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 8,
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  details: {
    fontSize: 14,
    marginTop: 4,
  },
  streakBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
  },
});