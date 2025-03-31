import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react-native';
import Card from '@/components/Card';
import { useDisciplinesStore } from '@/store/disciplines-store';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { useThemeStore } from '@/store/theme-store';

export default function GrowthHistoryScreen() {
  const router = useRouter();
  const completionHistory = useDisciplinesStore(state => state.completionHistory);
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // State to track the current month offset (0 = current month, -1 = last month, etc.)
  const [monthOffset, setMonthOffset] = useState(0);
  
  // Generate calendar days for the selected month
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    // Set to the first day of the current month
    const currentMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Get the number of days in the month
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = currentMonth.getDay();
    
    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        key: `empty-start-${i}-${monthOffset}`,
        isEmpty: true
      });
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const dateString = date.toISOString().split('T')[0];
      
      days.push({
        key: dateString,
        date: dateString,
        dayNumber: i,
        completed: completionHistory && completionHistory[dateString] || false,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    return { days, monthName };
  };
  
  const { days, monthName } = generateCalendarDays();
  
  // Group days into weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, Math.min(i + 7, days.length)));
  }
  
  // If the last week has fewer than 7 days, add empty spaces
  const lastWeek = weeks[weeks.length - 1];
  if (lastWeek && lastWeek.length < 7) {
    for (let i = lastWeek.length; i < 7; i++) {
      lastWeek.push({
        key: `empty-end-${i}-${monthOffset}`,
        isEmpty: true
      });
    }
  }
  
  const navigateToPreviousMonth = () => {
    setMonthOffset(monthOffset - 1);
  };
  
  const navigateToNextMonth = () => {
    if (monthOffset < 0) {
      setMonthOffset(monthOffset + 1);
    }
  };
  
  const getStatusColor = (day: any) => {
    if (day.isEmpty) return 'transparent';
    if (day.isToday) return day.completed ? colorScheme.readiness.high : colorScheme.accent;
    return day.completed ? colorScheme.readiness.high : colorScheme.cardBackgroundAlt;
  };
  
  const getDayTextColor = (day: any) => {
    if (day.isEmpty) return 'transparent';
    if (day.isToday) return colorScheme.text.inverse;
    return colorScheme.text.primary;
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colorScheme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colorScheme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colorScheme.text.primary }]}>Growth History</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.calendarContainer} variant="elevated">
          <View style={styles.monthNavigation}>
            <TouchableOpacity 
              onPress={navigateToPreviousMonth}
              style={[styles.navButton, { backgroundColor: colorScheme.cardBackgroundAlt }]}
            >
              <ChevronLeft size={20} color={colorScheme.text.primary} />
            </TouchableOpacity>
            
            <Text style={[styles.monthName, { color: colorScheme.text.primary }]}>{monthName}</Text>
            
            <TouchableOpacity 
              onPress={navigateToNextMonth}
              style={[
                styles.navButton,
                { backgroundColor: colorScheme.cardBackgroundAlt },
                monthOffset === 0 && styles.disabledNavButton
              ]}
              disabled={monthOffset === 0}
            >
              <ChevronRight 
                size={20} 
                color={monthOffset < 0 ? colorScheme.text.primary : colorScheme.text.muted} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.weekdaysHeader}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={`weekday-${index}`} style={[styles.weekdayLabel, { color: colorScheme.text.secondary }]}>{day}</Text>
            ))}
          </View>
          
          {weeks.map((week, weekIndex) => (
            <View key={`week-${weekIndex}`} style={styles.weekRow}>
              {week.map((day) => (
                <View 
                  key={day.key} 
                  style={[
                    styles.dayContainer,
                    day.isEmpty && styles.emptyDay
                  ]}
                >
                  {!day.isEmpty && (
                    <View 
                      style={[
                        styles.dayCircle, 
                        { backgroundColor: getStatusColor(day) },
                        day.isToday && [styles.todayCircle, { borderColor: colorScheme.primary }]
                      ]}
                    >
                      <Text style={[
                        styles.dayNumber,
                        { color: getDayTextColor(day) }
                      ]}>
                        {day.dayNumber}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </Card>
        
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colorScheme.readiness.high }]} />
            <Text style={[styles.legendText, { color: colorScheme.text.secondary }]}>Completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colorScheme.accent }]} />
            <Text style={[styles.legendText, { color: colorScheme.text.secondary }]}>Today</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colorScheme.cardBackgroundAlt }]} />
            <Text style={[styles.legendText, { color: colorScheme.text.secondary }]}>Incomplete</Text>
          </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  calendarContainer: {
    padding: 20,
    marginBottom: 24,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledNavButton: {
    opacity: 0.5,
  },
  monthName: {
    fontSize: 18,
    fontWeight: '600',
  },
  weekdaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weekdayLabel: {
    width: 36,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },
  emptyDay: {
    opacity: 0,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayCircle: {
    borderWidth: 2,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
});