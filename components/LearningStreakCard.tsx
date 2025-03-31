import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import Card from './Card';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface LearningStreakCardProps {
  currentStreak: number;
  weeklyProgress: boolean[];
}

export default function LearningStreakCard({ 
  currentStreak, 
  weeklyProgress 
}: LearningStreakCardProps) {
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // Get day names for the last 7 days
  const getDayNames = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const result = [];
    
    for (let i = 6; i >= 0; i--) {
      const dayIndex = (today - i + 7) % 7;
      result.push(days[dayIndex]);
    }
    
    return result;
  };
  
  const dayNames = getDayNames();
  
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.streakContainer}>
          <Flame 
            size={24} 
            color={currentStreak > 0 ? colorScheme.accent : colorScheme.text.muted} 
            style={styles.streakIcon}
          />
          <View>
            <Text style={[styles.streakCount, { color: colorScheme.text.primary }]}>
              {currentStreak}
            </Text>
            <Text style={[styles.streakLabel, { color: colorScheme.text.secondary }]}>
              day streak
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        {weeklyProgress.map((completed, index) => (
          <View key={index} style={styles.dayColumn}>
            <View 
              style={[
                styles.progressDot, 
                { 
                  backgroundColor: completed 
                    ? colorScheme.primary 
                    : colorScheme.progress.track
                }
              ]}
            />
            <Text 
              style={[
                styles.dayLabel, 
                { 
                  color: completed 
                    ? colorScheme.text.primary 
                    : colorScheme.text.muted 
                }
              ]}
            >
              {dayNames[index]}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIcon: {
    marginRight: 12,
  },
  streakCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  streakLabel: {
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  dayColumn: {
    alignItems: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});